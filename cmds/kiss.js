const { MessageEmbed, APIMessage, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "kiss",
	aliases: ["kiss"],
	category: "fun",
	description: 'Give someone a smooch!',
	usage: 'slap',
	async run(client, message, args) {
			var fs = require('fs');
			var files = fs.readdirSync(`./Images/kiss/`)
			let chosenFile = files[Math.floor(Math.random() * files.length)]
	
			let user = await client.usr(args[0]).catch((x) => {});
			if (!user) return message.channel.send(`${client.config.emoji.err} You must mention someone to kiss them!`)
			if (user == message.author.id) return message.channel.send(`${client.config.emoji.err} That's kinda sad that you're trying to kiss yourself... Maybe try kissing someone else?`)
	
			const smash = `👍`;
			// file name must not contain any spaces
			const attachment = new MessageAttachment(`Images/kiss/${chosenFile}`)
			const embed = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(message.author.tag + " has kissed " + user.tag + "")
				.setDescription(`
				To report this image, use \`;reportimage\`
				`)
				.setImage('attachment://' + chosenFile)
				.setFooter(`File Name: ${chosenFile}`)
	
			let msgEmbed = await message.channel.send({ embeds: [embed], files: [attachment]})
		}
			
	}