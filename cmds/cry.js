const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "cry",
	aliases: ["cry", "cryies", "sadge"],
	category: "social",
	description: "Cry on someones shoulder because you're sadge",
	usage: 'cry',
	async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/cry").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "their own" };
		try {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " is now crying on " + user.tag + "'s shoulder")
				.setImage(data.url)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}