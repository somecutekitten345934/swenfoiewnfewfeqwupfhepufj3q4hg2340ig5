const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "wave",
	aliases: ["wave", "hi"],
	category: "wave",
	description: 'Wave at someone hello like a decent human being and not a gremlin in your basement',
	usage: 'waifu',
	async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/wave").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themself" };
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " has waved at " + user.tag + "")
			.setImage(data.url)]
		});
	},
}