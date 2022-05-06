const { MessageEmbed, DiscordAPIError, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "getwaifu",
	aliases: ["getwaifu"],
	category: "fun",
	description: 'Get a picture of a random waifu',
	usage: 'waifu',
	async run(client, message, args) {
		var fs = require('fs');
		var files = fs.readdirSync(`./Images/getwaifu/`)
		let chosenFile = files[Math.floor(Math.random() * files.length)]

		let gwf = await client.db.get("gwf" + message.author.id) || 0;
        gwf = Number(gwf);
        gwf += 1;
        await client.db.set("gwf" + message.author.id, gwf)

		const attachment = new MessageAttachment(`Images/getwaifu/${chosenFile}`)
		const smash = `👍`;
		// file name must not contain any spaces
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " has requested a waifu!")
			.setDescription(`
			${message.author.tag} has requested a total of ${client.comma(gwf)} waifus!
			To report this image, use \`;reportimage\`
			`)
			.setImage(`attachment://${chosenFile}`)
			.setFooter(`File Name: ${chosenFile}`)

		try {
			let msgEmbed = await message.channel.send({ embeds: [embed], files: [attachment]})
		} catch(error){
			if(error == "DiscordAPIError: Request entity too large"){
				return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
			}
		}
	},
}