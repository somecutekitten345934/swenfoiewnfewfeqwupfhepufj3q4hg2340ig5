const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "divorce",
	aliases: ['divorce', 'div'],
	description: "Divorce your spouse.",
	category: 'social',	
	async run(client, message, args) {
		let spouse = await client.db.get("spouse" + message.author.id);
		if (!spouse) return message.channel.send("You're not married to anyone yet! `" + message.guild.prefix + "spouse`");
		let author = await client.db.get("spouse" + spouse);
		let usr = await client.users.fetch(spouse);
		let tag = `${usr.username}#${usr.discriminator}`;
		if(spouse == "861209428066172939"){
			return message.reply(`Why would you try to divorce me <:pout:841140539671445504>`)
		}

		await client.db.delete("spouse" + message.author.id);
		await client.db.delete("spouse" + spouse);

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`:broken_heart: ${message.author.tag} has divorced ${tag} :sob:`)]
		});
	},
};