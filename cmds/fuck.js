const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
	name: "fuck",
	aliases: ["fuck", "frick"],
	category: "nsfw",
	description: 'Fuck the target... litterally **NSFW CHANNEL ONLY**',
	usage: 'waifu',
	async run(client, message, args) {
        if (!message.channel.nsfw){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Explicit Content!`)
				.setColor(client.config.colors.red)
				.setDescription(`Sorry! I'm not allowed to show you this content outside of an NSFW channel since it is probably lewd!`)
				.setThumbnail(client.config.thumbnail.lewd)]
			})
		}
		var fs = require('fs');
		var files = fs.readdirSync(`./Images/fuck/`)
		let chosenFile = files[Math.floor(Math.random() * files.length)]

		if(!args.length){
			return message.channel.send(`${client.config.emoji.err} Try actually pinging someone to fuck!`)
		}
		let user = await client.usr(args[0]).catch((x) => {});
		if(user == message.author.id){
			return message.channel.send(`You can no longer fuck yourself... Sorreh ${client.config.emoji.sadge}`)
		}
		if (!user) user = { tag: "themself" };
		let hfuck = await client.db.get("hfuck" + client.config.owner);
		let owner = client.config.owner

    	hfuck = Number(hfuck);
        hfuck += 1;
        await client.db.set("hfuck" + owner, hfuck)
		const attachment = new MessageAttachment(`Images/fuck/${chosenFile}`)

		// file name must not contain any spaces
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " has fucked " + user.tag + "!")
			.setDescription(`To report a specific image, please provide the FILE NAME`)
			.setImage('attachment://' + chosenFile)
			.setFooter(`File Name: ${chosenFile}`)], files: [attachment]
		});
	},
} // D: