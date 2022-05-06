const { MessageEmbed, escapeMarkdown, Message } = require("discord.js");
const ms = require('ms');
const delay = require('delay')

module.exports = {
	name: "animepunch",
	aliases: ['animepunch'],
	cst: "animepunch",
	category: 'own',
	description: 'anime punch the target rendering them unconscious for a long long time',
	async run(client, message, args) {
		async function dm(user, userColor, txt) {
			let embed = new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(txt)
			await client.users.cache.get(user.id)
				.send({ embeds: new MessageEmbed(embed).setColor(userColor) })
					.catch((x) => {});
			message.channel.send({ embeds: [embed] })
			await delay(1000);
		}
		if (!args.length) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid User!`)
				.setDescription(`I'm not really sure who you want me to anime punch... give me a user!`)
				.setThumbnail(client.config.thumbnail.question)]
			});
	}
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send("You need to ping someone to sentence, dum dum");
		await client.db.set("sentc" + message.author.id, message.createdTimestamp - client.config.epoch);
		let usercolor = await client.db.get('clr' + user.id) || client.config.defaultHexColor;
				usercolor = usercolor.split(";")[0];
		let didntWork = Math.floor(Math.random() * 100);

		let bal = await client.db.get("bal" + user.id) || 0;
			bal = Number(bal);
		let amtLost = bal / 5;
		if (bal - amtLost < 0) amtLost = bal;
		amtLost = Math.floor(amtLost);

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.green)
			.setDescription(`Alright ${message.author.tag}, I will go over and anime punch ${user.tag}!`)
			.setThumbnail(client.config.thumbnail.thumbsup)]
		})
		await delay(3000)
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.green)
			.setDescription(`...`)
			.setThumbnail(client.config.thumbnail.question)]
		})
		await delay(3000)
		let stunTime = Math.floor(Math.random() * 10) + 1;
		if (stunTime < 99999) stunTime = 9999999999999;
		stunTime *= ms('1m');
				//		stn: function (id, amt, client) {
		await client.stn(user.id, stunTime/ms("1m"), client);
		await client.db.set('stnb' + user.id, "knocked out");
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.green)
			.setTitle(`Knockout!`)
			.setDescription(`Weebchan hits ${user.tag} so hard they've been knocked out for ${stunTime / ms(`1m`)} minutes!`)
			.setThumbnail(client.config.thumbnail.amaze)]
		})
	},
};