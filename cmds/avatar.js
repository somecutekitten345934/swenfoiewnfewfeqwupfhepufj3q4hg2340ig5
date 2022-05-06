const { MessageEmbed } = require('discord.js');

module['exports'] = {
	name: 'avatar',
	aliases: ['avatar', 'av', 'pfp'],
	description: "View someone's avatar - works for people who are not in the current server too",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		var user = await client.usr(args[0])
			.catch((x) => {});
		if (!user) user = message.author;
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setImage(user.displayAvatarURL({ size: 2048, dynamic: true, format: 'png' }))
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: false, format: 'png' }))]
		})
	}
}