const { MessageEmbed, APIMessage } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "lick",
	aliases: ["lick"],
	category: "social",
	description: 'Give some a big ol lick',
	usage: 'slap',
async run(client, message, args) {
		let data = await fetch("https://waifu.pics/api/sfw/lick").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themself" };
		try{
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " has licked " + user.tag + " ;3")
				.setImage(data.url)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}