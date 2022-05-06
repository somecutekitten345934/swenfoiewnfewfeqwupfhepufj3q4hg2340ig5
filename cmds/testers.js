const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'testers',
	aliases: ['testers'],	
	description: 'View who the active beta testers are',
	async run(client, message, args) {
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Weebineers Beta Testers")
			.setThumbnail(message.author.avatarURL({dynamic:true}))
			.setDescription("Here are all the current beta testers.\nThis position is hand picked and not applied for.")
			.addField("Testers", "<@524016475661664256> (524016475661664256)\n<@814363968084770837> (814363968084770837)\n<@853429915176665120> (853429915176665120)\nUNKNOWN#0000 (UNKNOWNID)\nUNKNOWN#0000 (UNKNOWNID)\n")
			.setTimestamp()
		})
	}
}