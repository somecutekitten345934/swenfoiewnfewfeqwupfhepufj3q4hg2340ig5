const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "hug",
	aliases: ["hugs", "hug"],
	category: "social",
	description: 'Give somene a hug you social butterfly',
	usage: 'hug',
	async run(client, message, args) {
		var fs = require('fs');
		var files = fs.readdirSync(`./Images/hug/`)
		let chosenFile = files[Math.floor(Math.random() * files.length)]

		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send(`${client.config.emoji.err} You must mention someone to hold their hand!`)
		if (user == message.author.id) return message.channel.send(`${client.config.emoji.err} You can't hold your own hand! Try mentioning someone!`)

		const smash = `👍`;

		const attachment = new MessageAttachment('Images/hug/' + chosenFile);

		// file name must not contain any spaces
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " gives " + user.tag + " a hug!")
			.setDescription(`
			To report this image, use \`;reportimage\`
			`)
			.setImage('attachment://' + chosenFile)
			.setFooter(`File Name: ${chosenFile}`)

		let msgEmbed = await message.channel.send({ embeds: [embed], files: [attachment]})
	}
}