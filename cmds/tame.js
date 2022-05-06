const { MessageEmbed } = require('discord.js');
const delay = require(`delay`)

module.exports = {
	name: 'tame',
	aliases: ['tame', 'tame'],
	category: 'pet',	
	description: 'tame a waifu! (`;waifu`)',
	async run(client, message, args) {
		if (await client.db.get('pet' + message.author.id)) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Waifu already Tamed!`)
			.setDescription(`Taking care of your waifu is a big responsibility, and it seems you are already doing that! View your tamed waifu via \`${message.guild.prefix}waifu\`\n\n*${message.author.tag} hears a complaint as their waifu thinks they will abandon them!*`)
			.setThumbnail(client.config.thumbnail.pout)]
		});
		await client.db.set('pet' + message.author.id, "1;10000;100;0;0;1;1;1;0;1");
		const msg = await message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Searching for a Waifu....`)
			.setDescription(`Weebchan helps **${message.author.tag}** search for a new waifu to tame...`)
			.setThumbnail(client.config.thumbnail.question)]
		})
		await delay(3000)
		msg.edit({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Taming Waifu...`)
			.setDescription(`Weebchan and **${message.author.tag}** entices a wild waifu with food and shelter...`)
			.setThumbnail(client.config.thumbnail.lewd)]
		})
		await delay(3000)
		msg.edit({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Waifu Tamed!`)
			.setDescription(`**${message.author.tag}**'s taming session was a success! They can now check up on their waifu via \`${message.guild.prefix}waifu\``)
			.setThumbnail(client.config.thumbnail.pat)]
		})
	},
};