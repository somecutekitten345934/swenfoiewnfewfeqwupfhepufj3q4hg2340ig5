  const Discord = require("discord.js")

module.exports = {
	name: "membercount",
	aliases: ["members", 'membercount', 'mc'],
	description: "Gets the total members of a server and seperates them out; bot count, human count, etc, etc.",
	category: 'info',
	usage: 'membercount',
	async run(client, message, args) {
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setThumbnail(message.guild.iconURL())
			.setTitle(message.guild.name)
			.addField("Humans", message.guild.members.cache.filter(e=>!e.user.bot).size.toString(), true)
			.addField("Bots", message.guild.members.cache.filter(e=>e.user.bot).size.toString(), true)
			.addField("Total", message.guild.memberCount.toString(), true)
			.setColor(message.author.color)]
		})
	},
};