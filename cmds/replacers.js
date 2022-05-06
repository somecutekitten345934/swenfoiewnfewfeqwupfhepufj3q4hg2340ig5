const delay = require('delay');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'replacers',
	aliases: ['replacers'],
	description: 'View all of your currently active replacers.',
	category: 'custom',
	async run(client, message, args) {
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		var count = 1;
		const msg = Object.entries(data).map(x => `${count++} \`${x[0]}\` - Created At: ${require('moment')(x[1].created).format('MMMM Do YYYY, h:mm:ss A')} - Content: \`${client.trim(x[1].content, 50)}\``).join('\n');

		const user = await client.users.fetch(`${message.author.id}`).catch(() => null);
		if (!user) return message.channel.send("User not found:(");

		mmsg = await message.channel.send(`${client.config.emoji.loading} Attempting to DM ${message.author.tag} (${message.author.id}) their replacer contents..`)
		await delay(2000)
		mmsg.edit(`${client.config.emoji.tick} Successfully sent ${message.author.tag} their replacer contents via private messages!`)
		await user.send(`**YOUR WEEBINEERS REPLACERS:**\n${msg}`).catch(() => {
		   mmsg.edit(`${client.config.emoji.err} Failed to dm ${message.author.tag} the contents of their replacers. This could be because they do not share any servers with Weebineers, or they have private messages off.`);
		});
	},
};