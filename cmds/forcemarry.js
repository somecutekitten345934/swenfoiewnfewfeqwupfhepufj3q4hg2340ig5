const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'forcemarry',
	aliases: ["forcemarry", "forcem", "fm"],
	cst: "fmarry",
	description: 'force-marry 2 users.',
	category: 'own',
	async run(client, message, args) {
		if (!args.length || (args.length < 2)) {
			return message.channel.send('You must mention 2 users in order for this command to function correctly!');
		};
		const user1 = await client.usr(args[0]);
		if (!user1) return message.channel.send("Try running the command again but this time actually ping user1")
		const user2 = await client.usr(args[1]);
		if (!user2) return message.channel.send("Try running the command again but this time actually ping user2");
		await client.db.set("spouse" + user1.id, user2.id);
		await client.db.set("spouse" + user2.id, user1.id);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${user1.tag} is now married to ${user2.tag}`)]
		})		
	}
}