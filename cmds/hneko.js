const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "hneko",
	aliases: ["hneko", "gethneko", "hentaineko", "nsfwwneko"],
	category: "nsfw",
	description: 'Get a random **NSFW** neko **NSFW CHANNEL ONLY**',
	usage: 'neko',
	async run(client, message, args) {
	if(!message.channel.nsfw){
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Explicit Content!`)
			.setColor(client.config.colors.red)
			.setDescription(`Sorry! I'm not allowed to show you this content outside of an NSFW channel since it is probably lewd!`)
			.setThumbnail(client.config.thumbnail.lewd)]
		})
	}
		let data = await fetch("https://waifu.pics/api/nsfw/neko").then((res) => res.json());
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themself" };
        let ghneko = await client.db.get("ghneko" + 509798534204096513) || 0;
		let owner = client.config.owner

    	ghneko = Number(ghneko);
        ghneko += 1;
        await client.db.set("ghneko" + 509798534204096513, ghneko)

		let hneko = await client.db.get("hneko" + message.author.id) || 0;

    	hneko = Number(hneko);
        hneko += 1;
        await client.db.set("hneko" + message.author.id, hneko)

		try {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " has requested a horny neko for " + user.tag + "!")
				.setDescription(`${message.author.tag} requested a total of ${hneko} horny nekos!`)
				.setImage(data.url)
				.setFooter(`Everyone on the bot collectively has requested ${ghneko} horny nekos`)]
			});
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}