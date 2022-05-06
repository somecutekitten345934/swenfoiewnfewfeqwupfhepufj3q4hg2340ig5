const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'viewreplacer',
	aliases: ['viewreplacer'],
	category: 'info',
	description: 'view a stored replacer\'s content',
	async run(client, message, args) {
		if (!args.length) {
			return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Invalid Arguments!`)
			.setDescription(`Please provide a replacer to look at!`)
			.setThumbnail(client.config.thumbnail.error)]

			})
		}
		const kw = args[0].toLowerCase();

		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (data == undefined){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(`An Error Occurred!`)
				.setDescription(`${client.config.emoji.err} Sorry, but I can't send you replacers if you don't have any!`)
				.setThumbnail(client.config.thumbnail.error)]

			})
		}
		if (!Object.keys(data).includes(kw)) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author['color'])
				.setDescription(`No replacer named "${kw}" found. Look in \`${message.guild.prefix}replacers\` to view a list`)]
			})
		} else {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`Replacer Content | ${kw}`)
				.setDescription(data[kw].content)
				.setFooter("Created")
				.setTimestamp(data[kw].created)]
			})
		}
	}
}