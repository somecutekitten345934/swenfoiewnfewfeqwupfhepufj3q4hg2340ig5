const { MessageEmbed, APIMessage } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "dance",
	aliases: ["dance"],
	category: "social",
	description: 'Take someone else out to dance!',
	async run(client, message, args) {
		if (!args.length) {
				return message.channel.send(`Why would you ever try to dance by yourself ;(`);
		}
		let data = await fetch("https://waifu.pics/api/sfw/dance").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themselves" };
		try{
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " has taken " + user.tag + " on a dance!")
				.setImage(data.url)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}