'use strict'
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const delay = require('delay')

module.exports = {
	name: 'nuker',
	aliases: ['nuke', 'nuker'],
	category: 'own',	
	description: "Nukes your ENTIRE balance at once.. NOT JOKING",
	cst: "nuker",
	async run(client, message, args) {
		let data = await client.db.get('nkc' + message.author.id);
		data = Number(data);
		let time = client.cooldown(message.createdTimestamp, data);
		if (!args.length) return message.channel.send("You must mention a user to obliterate them with a nuke!");
			const user = await client.usr(args[0]).catch((err) => {});
		if (!user) return message.channel.send("You have not mentioned a user to nuke!");

		if (user) {
				let bal = await client.db.get('bal' + user) || 0;
				await client.db.set('bal' + user.id, 0);
				await message.channel.send({
					embeds: [new MessageEmbed()
					.setDescription(`**${message.author.tag}** has dropped a nuke on **${user.tag}**, melting all of the ${client.config.emoji.coin} in their purse!`)
					.setColor(message.author.color)]
				})
		}
	}
}
