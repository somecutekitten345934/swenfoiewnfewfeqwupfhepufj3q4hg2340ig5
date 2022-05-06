const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "slap",
	aliases: ["slap", "slapthefuckouttayou"],
	category: "social",
	description: 'Slap the shit out of someone with style',
	usage: 'slap',
	async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/slap").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themselves" };
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " slapped " + user.tag + "")
			.setImage(data.url)]
		});
	},
}