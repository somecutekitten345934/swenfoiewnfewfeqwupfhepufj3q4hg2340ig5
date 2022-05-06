const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "nom",
	aliases: ["nom", "getwaifu"],
	category: "social",
	description: 'Get a picture of a random waifu',
	usage: 'nom',
	async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/nom").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themselves" };
		try {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " took a big nom on some food ;3")
				.setImage(data.url)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}