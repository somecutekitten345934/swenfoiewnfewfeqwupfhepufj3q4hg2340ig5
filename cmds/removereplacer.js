const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'removereplacer',
	aliases: ['replacer.removeone', 'removereplacer', 'repl.rem', 'delreplacer'],
	category: 'custom',
	description: 'Removes a replacer/supplanter.',
	async run(client, message, args) {
		const data = await client.db.get(`replacers${message.author['id']}`) || {};
		if (typeof data != 'object') return message.channel.send("There was an error whilst parsing your role data: `TypeError: User#Supplanters must be of type Object or null`\nContact an admin asking them to remove your role data!");

		if(!args.length){
			return message.channel.send(`${client.config.emoji.err} Please provide me with a replacer to remove!`)
		}
		var keyword = args[0].toLowerCase();
		if (!Object.keys(data).includes(keyword)) {
			return message.channel.send(`No supplanter with name "${keyword}" was found. Please look in \`${message.guild.prefix}replacers\` to view a list of all your currently active replacers.`);
		} else {
			const newData = data;
			delete data[keyword];
			await client.db.set(`replacers${message.author.id}`, newData)
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`You have removed your "${keyword}" replacer`)]
			})
		}
	},
}