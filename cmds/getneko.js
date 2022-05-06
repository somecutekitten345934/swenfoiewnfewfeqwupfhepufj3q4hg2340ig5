const { MessageEmbed } = require('discord.js');
const { NekoBot } = require("nekobot-api");
const api = new NekoBot();

module.exports = {
	name: "getneko",
	aliases: ["getneko", "getneko", "nyaa"],
	category: "fun",
	description: 'Get a picture of a random neko',
	usage: 'neko',
	async run(client, message, args) {
		const image = await api.get(`neko`)
		let hgs = await client.db.get("nks" + message.author.id) || 0;
        hgs = Number(hgs);
        hgs += 1;
        await client.db.set("nks" + message.author.id, hgs)

		// file name must not contain any spaces
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " requests a neko!")
			.setDescription(`${message.author.tag} has seen ${client.comma(hgs)} nekos!`)
			.setImage(image.toString())
		message.channel.send({ embeds: [embed]})
	},
}