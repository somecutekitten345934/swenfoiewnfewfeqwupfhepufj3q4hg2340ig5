const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "id",
	aliases: ['id'],
	description: 'Displays your own DISCORD ID',
	category: 'utl',
	async run(client, message, args) {
		message.channel.send(message.author.id);
	},
};