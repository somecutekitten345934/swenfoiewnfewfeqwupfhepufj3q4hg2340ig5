const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'editreplacer',
	aliases: ['editreplacer', 'changereplacer', 'erepl'],
	description: "Edits a replacer's content; format `editreplacer <replacer keyword> <new content>`",
	category: 'custom',	
	async run(client, message, args) {
		if (args.length < 2) return message.channel.sendd("You must use the correct format; `" + message.guild.prefix + "editreplacer <replacer keyword> <new content>`");
		var kw = args[0].toLowerCase();
		var newContent = args.slice(1).join(' ');

		var data = await client.db.get(`replacers${message.author.id}`) || {};
		
		if (!Object.keys(data).includes(kw)) {
			return message.channel.send(`A supplanter by that name was not found. Look in \`${message.guild.prefix}replacers\` to view a list and \`${message.guild.prefix}addreplacer <keyword> <content>\` to add a new one.`);
		}
			var newData = Object.assign({}, data, { [kw]: { content: newContent, created: message.createdTimestamp } });
			await client.db.set(`replacers${message.author.id}`, newData)
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully edited replacer ${kw}`)]
			})
	}
}