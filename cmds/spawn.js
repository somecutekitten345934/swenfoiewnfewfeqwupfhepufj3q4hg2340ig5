const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	"name": "spawn",
	"aliases": ["spawn"],
	"description": "Spawns a briefcase in the current channel",
	cst: "spawnpkg",
	category: 'own',
	async run(client, message, args) {
		let data = await client.db.get(`pkg${message.channel.id}`);
		if(!args.length){
			let data = await client.db.get(`pkg${message.channel.id}`);
			if (data) return message.channel.send(`${client.config.emoji.err} There is already a briefcase in this channel! Steal it with \`${message.guild.prefix}steal\``);

			await client.db.set(`pkg${message.channel.id}`, true);
			let waifu = await fetch(`https://waifu.pics/api/sfw/waifu`).then((res) => res.json());
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has forced a random waifu to drop a ${client.config.emoji.package} containing a reward! Hurry up and steal it with \`${message.guild.prefix}steal\``)
				.setThumbnail(waifu.url)]
	
			});
			return;
		}
		let sub = args[0].toLowerCase();
		if(sub == "special"){
			let special = await client.db.get(`spkg${message.channel.id}`)
			if(special) {
				return message.channel.send(`${client.config.emoji.err} There is already a package in this channel!`)
			}
			if(!special){
				await client.db.set(`spkg${message.channel.id}`, true);
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**SPECIAL DROP!**\n${message.author.tag} has forced Weeb~chan to drop a ${client.config.emoji.package} containing a rare reward! Hurry up and steal it with \`${message.guild.prefix}steal\``)
					.setThumbnail(`https://i.gyazo.com/7b6e00a3e8173f8aecddb6d147d964f9.png`)]

				});
			}
			return;
		}
		if (data) return message.channel.send(`${client.config.emoji.err} There is already a briefcase in this channel! Steal it with \`${message.guild.prefix}steal\``);

		await client.db.set(`pkg${message.channel.id}`, true);
		let waifu = await fetch(`https://waifu.pics/api/sfw/waifu`).then((res) => res.json());
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has forced a random waifu to drop a ${client.config.emoji.package} containing a reward! Hurry up and steal it with \`${message.guild.prefix}steal\``)
			.setThumbnail(waifu.url)]

		});
	}
}