const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "cuddle",
	aliases: ["cuddleup", "cuddle"],
	category: "social",
	description: 'Cuddle up with someone',
	usage: 'cuddle',
	async run(client, message, args) {
		return message.channel.send(`Sorry, but this command is currently disabled due to the discord.js v13 update and will be available again at a later date.`)
		var fs = require('fs');
		var files = fs.readdirSync(`./Images/cuddle/`)
		let chosenFile = files[Math.floor(Math.random() * files.length)]

		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send(`${client.config.emoji.err} You must mention someone to cuddle with them!`)
		if (user == message.author.id) return message.channel.send(`${client.config.emoji.err} You can't cuddle with yourself! Try mentioning someone!`)

		const attachment = [new MessageAttachment('./Images/cuddle/', chosenFile)];
		// file name must not contain any spaces
		const embed = [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " has cuddled up with " + user.tag + "")
			.setDescription(`
			`)
			.setImage('attachment://' + chosenFile)
			.setFooter(`File Name: ${chosenFile}`)]

		let msgEmbed = await message.channel.send({ embeds: [embed], files: [attachment]})
	}
		
}