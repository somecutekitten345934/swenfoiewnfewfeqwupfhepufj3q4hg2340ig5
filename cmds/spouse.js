const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "spouse",
	aliases: ['spouse'],
	category: 'social',
	description: "See who someone is married to",
	async run(client, message, args) {
		if (!args) {
			args = [`<@${message.author.id}>`];
		};
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => {});
		};
		if (!usr) {
			usr = {
				id: message.author.id,
				tag: message.author.tag,
			};
		};		
		let spouse = await client.db.get("spouse" + usr.id);
		if (!spouse) return message.channel.send(`${usr.tag} isn't married to anyone. L`);
		let user = await client.users.fetch(spouse);
		let tag = `${user.username}#${user.discriminator}`;

		message.channel.send({
			embeds: [new MessageEmbed()
			.setDescription(`:two_hearts: ${usr.tag} is currently married to ${tag}`)
			.setColor(message.author.color)]
		})
	}
}