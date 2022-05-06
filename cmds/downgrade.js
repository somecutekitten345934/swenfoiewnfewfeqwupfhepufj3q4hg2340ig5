const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'downgrade',
	aliases: ['downgrade', 'decondition'],
	description: `downgrade one of your waifu's stat and receive one credit in return`,
	category: 'pet',
	async run(client, message, args) {
		if(message.author.id !== client.config.owner) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.error)
				.setTitle(`Deprecated System`)
				.setDescription(`I'm sorry, but I no longer downgrade your waifus stats for free.. it now comes at a price!
				
				Already have a **T1 Stat Rollback** or a **__T2 Stat Rollback__**? Use one via \`${message.guild.prefix}use <item>\``)]
			})
		}
		const cd = await client.db.get('dwngrdc' + message.author['id']) || 0;
		let data = client.cooldown(message.createdTimestamp, cd);
		if (data) {
			return message.channel.send(`You must wait another ${data} before downgrading another one of your waifu's stat!`);
		};
		data = await client.db.get("pet" + message.author.id);
		if (!data) return message.channel.send("You don't have a waifu!\n`" + message.guild.prefix + "tame` to tame one!")
		data = data.split(';');
		let stat = (args[0] || "").toLowerCase();
		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your Waifu is not home right now and can't be modified! Try waiting until she gets back to modify her stats!`)
			})
		}
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.channel.send(`The different types of stats are: ${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`);		
		Stat = Stat.split(";");
		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				selected = display;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}				
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		data[4] = Number(data[4]);
		data[4] = data[4] + 1;
		data[Stat[2]] = Number(data[Stat[2]]) - 1;
		if (data[Stat[2]] <= 0) return message.channel.send(`Each of your ${display}'s stats must have at least 1 point.`);
		//await client.db.set("dwngrdc" + message.author.id, (message.createdTimestamp + ms("30m")) - client.config.epoch);
		await client.db.set("pet" + message.author.id, data.join(';'));
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has reduced their ${display}'s ${Stat[1]} and received ${emojis[3]} 1!`)
		}).catch((x) => {});
	},
};