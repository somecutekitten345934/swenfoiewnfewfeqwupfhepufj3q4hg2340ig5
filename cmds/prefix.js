const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'prefix',
	aliases: ['prefix', 'changeprefix'],
	description: 'Edits the server prefix',
	category: 'server',
	async run(client, message, args) {
//    if (args = 0 || args > 2) return message.channel.send("You must specify a new command prefix; this may not be an empty whitespace and may not exceed 3 characters in length.");
if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("Only staff with the `MANAGE_GUILD` permission can change the prefix here.");
    var prefix = args[0];
		if (!prefix || (prefix.length > 3)) return message.channel.send("You must specify a new command prefix; this may not be an empty whitespace and may not exceed 3 characters in length.");
		await client.db.set(`prefix${message.guild.id}`, prefix.toLowerCase());
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully updated the server prefix to \`${prefix.toLowerCase()}\``)]
		})
//		message.channel.send(`Successfully set prefix${message.guild.id} as "${prefix}"`);
	}
} 