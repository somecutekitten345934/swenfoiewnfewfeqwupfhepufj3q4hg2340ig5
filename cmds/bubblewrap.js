const { MessageEmbed } = require('discord.js')
const ms = require("ms");

module.exports = {
	name: 'bubblewrap',
	aliases: ['bubblewrap'],
	description: "Pop away!",
	category: 'fun',	
	async run(client, message, args) {
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setTitle(`Heres a fresh bubble wrap sheet to pop!`)
            .setDescription(`
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            ||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||||:boom:||
            `)]
        })
    }
}