const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "botcredits",
	aliases: ['botcred'],
	description: 'Displays developers for the bot',
	category: 'utl',
	async run(client, message, args) {
		const em = [new MessageEmbed()
    .setTitle("Weebineers Credits")
    .setColor(message.author.color)
    .setDescription("Below are all the people who helped make Weebchan what it is, from ideas, to code.")
    .addField("Owner", 'SemiMute#6630 - Lead Developer')
	.addField("Economist Creator", 'ツ $tatic#9239 - Let Semi use his bots SRC to learn to code <3.')]
	message.channel.send({ embeds: em})
	}
}