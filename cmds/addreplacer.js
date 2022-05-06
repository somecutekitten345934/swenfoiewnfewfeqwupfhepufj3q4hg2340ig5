const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "addreplacer",
	category: 'info',
	aliases: ['addreplacer', 'replaceradd', 'newreplacer'],
	description: 'Adds a replacer; use `<replace key> <replacer content>`',
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send(`You must specify a replacer keyword and its content under the format of \`${message.guild.prefix}addreplacer <name> <content>\`; for example \`${message.guild.prefix}addreplacer firstname Asad\`.`)
		var keyword = args[0].toLowerCase();
		var content = args.slice(1).join(' ');
		if (content.length > 500) return message.channel.send(`${client.config.emoji.err} Your replacer content may not exceed 500 characters.`, { embed: new MessageEmbed().setDescription(`[Learn More](<announcement message URL HERE>)`).setColor(message.author.color) });
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (Object.keys(data).length > 20 && (message.author.id != client.config.owner)) return message.channel.send(`You may not have more than 10 instantaneous replacers; please remove one before continuing.`);
		const newData = Object.assign({}, data, { [keyword]: { content: content, created: Date.now() } });
		await client.db.set(`replacers${message.author.id}`, newData);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully added replacer "${keyword}"`)]
		})
	},
};