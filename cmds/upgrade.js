const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'upgrade',
	aliases: ['upgrade', 'improve', 'up', 'upgr'],
	description: `Upgrade one of your waifu's stat`,
	category: 'pet',
	async run(client, message, args) {
		let data = await client.db.get("pet" + message.author.id);
		if (!data) return message.channel.send("You don't have a waifu!\n`" + message.guild.prefix + "tame` to tame one!")
		data = data.split(';');
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)

		if(cst.includes(`maxedwaifu`)){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} You are currently using an **ADMIN** waifu and are not allowed to use this command during that time. Remove the \`maxedwaifu\` permission and try again!`)]
			})
		}
		let stat = (args[0] || "").toLowerCase();
		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your Waifu is not home right now and can't be modified! Try waiting until she gets back to modify her stats!`)]
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
					display = "waifu";
					emojis = client.config.defaults.PET_EMOJIS;
				}
			}				
			let pn = await client.db.get(`petname${message.author.id}`) || display;
			display = pn;
	
		let amt = isNaN(args[1]) ? 1 : Number(args[1]);
		if (amt <= 0) amt = 1; 
		        "level;health;energy;exp;credits;intel;endur;str;affec"
		let credits = Number(data[4]);
		if (credits - amt < 0) return message.channel.send("You don't have enough credits for that!");
		data[4] = credits - amt; 
		data[Stat[2]] = Number(data[Stat[2]]) + amt;
		await client.db.set("pet" + message.author.id, data.join(';'))
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has upgraded their ${display}'s ${Stat[1]} by ${amt} credits but lost ${emojis[3]} ${amt} in the process!`)]
		});
	}
}