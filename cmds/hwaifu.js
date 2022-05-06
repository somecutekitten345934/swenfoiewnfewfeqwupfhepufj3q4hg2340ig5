const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
	name: "hwaifu",
	aliases: ["hwaifu"],
	category: "nsfw",
	description: 'Request some nice wholesome waifus... **NSFW CHANNEL ONLY**',
	usage: 'waifu',
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
		var fs = require('fs');
		var files = fs.readdirSync(`./Images/hwaifu/`)
		let chosenFile = files[Math.floor(Math.random() * files.length)]

		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) user = { tag: "themself" };
        let ghwaifu = await client.db.get("ghwaifu" + 509798534204096513) || 0;

    	ghwaifu = Number(ghwaifu);
        ghwaifu += 1;
        await client.db.set("ghwaifu" + 509798534204096513, ghwaifu)

		let horny = await client.db.get("horny" + message.author.id) || 0;
		let author = message.author.id

	horny = Number(horny);
        horny += 1;
        await client.db.set("horny" + author, horny)

		const attachment = new MessageAttachment(`Images/hwaifu/${chosenFile}`)

		const smash = `👍`;
		// file name must not contain any spaces
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(message.author.tag + " has requested a horny waifu for " + user.tag + "!")
			.setDescription(`
			${message.author.tag} has requested a horny waifu ${client.comma(horny)} times!\n
			React with ${smash} if you liked this image!
			`)
			.setImage('attachment://' + chosenFile)
			.setFooter(`File Name: ${chosenFile}\nReport this image via ${message.guild.prefix}reportimage`)

		let msgEmbed = await message.channel.send({ embeds: [embed], files: [attachment]})
		msgEmbed.react(smash)
	}
		
} // D: