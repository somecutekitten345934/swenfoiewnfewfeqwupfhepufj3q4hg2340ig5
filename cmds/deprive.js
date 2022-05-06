const { MessageEmbed } = require('discord.js')
const ms = require("ms");

module.exports = {
	name: 'deprive',
	aliases: ['deprive'],
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	category: 'pet',	
	async run(client, message, args) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.error)
				.setTitle(`Deprecated System`)
				.setDescription(`I'm sorry, but I no longer deprive your waifus stats for free.. it now comes at a price!
				
				Already have a **T1 Stat Rollback** or a **__T2 Stat Rollback__**? Use one via \`${message.guild.prefix}use <item>\``)]
			})
			"level;health;energy;exp;credits;intel;endur;str;affec"
		let cooldown = await client.db.get("dprvc" + message.author.id);
		let cst = await client.db.get(`cst${message.author.id}`)
		cst = cst.split(`;`)

		if(cst.includes(`maxedwaifu`)){
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} You are currently using an **ADMIN** waifu and are not allowed to use this command during that time. Remove the \`maxedwaifu\` permission and try again!`)
			})
		}
		const data = client.cooldown(message.createdTimestamp, cooldown);
		if (data) {
			return message.channel.send(`You must wait another ${data} before depriving another stat!`);
		} else {

    };
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send("You don't seem to own a waifu!");
		let petName = await client.db.get("petname" + message.author.id) || "waifu";
		pet = pet.split(';');

		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your Waifu is not home right now and can't be modified! Try waiting until she gets back to modify her stats!`)
			})
		}
		let stat = (args[0] || "").toLowerCase();
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.channel.send(`The different types of stats are: ${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`);		
		Stat = Stat.split(";");
		let Credits = Number(pet[Stat[2]]);
		let amt = Credits - 1;
		if (amt < 0) {
			return message.channel.send("You must have at least 2 credits on a specified `<stat>` before depriving your waifu of this stat.");
		};
		await client.db.set('dprvc' + message.author.id, (message.createdTimestamp + ms("3h")) - client.config.epoch);
		pet[Stat[2]] = Credits - amt;
		pet[4] = Number(pet[4]) + amt;
		await client.db.set('pet' + message.author.id, pet.join(';'));
		message.channel.send({
			embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has deprived ${petName}'s ${Stat[1]} by ${amt} points and received ${amt} credits!`)
		})
	},
};