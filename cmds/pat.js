const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "pat",
	aliases: ["pat"],
	category: "social",
	description: 'Get a picture of a random waifu',
	usage: 'waifu',
	async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/pat").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themself" };
		try {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " has pat " + user.tag + "'s head!")
				.setImage(data.url)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}