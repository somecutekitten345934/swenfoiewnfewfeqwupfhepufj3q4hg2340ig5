'use strict'
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'BagOfCash',
	aliases: ['boc', 'bagofcash'],
	category: 'own',	
	description: "Gives you a bug o'l bag of cash",
	async run(client, message, args) {
		let data = await client.db.get('bcc' + message.author.id);
		data = Number(data);
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";")

		if (!cst.includes("bagofcash")) {
			return message.reply(`Did you think you were worthy of me simping for you? You thought **WRONG**!`)
		}
		let time = client.cooldown(message.createdTimestamp, data);
		if (time) {
				message.channel.send(`You must wait another ${time} before getting simped on`);
		} else {
				let bal = await client.db.get('bal' + message.author.id) || 0;
				bal = Number(bal);
				await client.db.set('bcc' + message.author.id, message.createdTimestamp - client.config.epoch)
				await client.db.set('bal' + message.author.id, bal + 99999999999999999);
				message.channel.send({
					embeds: [new MessageEmbed()
					.setDescription(`Weebchan simps on **${message.author.tag}** and gives them ${client.config.emoji.coin} 99,999,999,999,999,999`)
					.setThumbnail(client.config.thumbnail.lewd)
					.setColor(message.author.color)]
				})
				await client.db.set("bocc" + message.author.id, (message.createdTimestamp + ms("12h")) - client.config.epoch);
		}
	}
}