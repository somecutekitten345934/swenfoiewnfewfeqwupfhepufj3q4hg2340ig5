const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: "reject",
	aliases: ["reject", "rej"],
	description: 'Reject a bug, completely disregarding it.',
	cst: "rej0",
	category: 'own',
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must provide a bug ID of the bug you wish to reject")
		const id = args[0];
		const reason = args.slice(1).join(' ');
		message.delete().catch((x) => {});
		const val = await client.db.get(`bugr${id}`);
		if (!val) return message.channel.send(`${client.config.emoji.err} No bug report with ID "${id}" was found.`);
		client.channels.cache.get(client.config.channels.bug)
			.messages.fetch({
				limit: 1,
				around: val.msg,
			})
				.then(async(col) => {
					const rec = new MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(val.title)
						.setDescription(`${client.config.emoji.err} **Bug report #${val.number} was rejected by ${(message.author.tag)} (${message.author.id})**`)
						col.first().edit({
							embeds: [rec]
						});
				})
				.catch((x) => message.channel.send("There was an error: `" + x + "`"));
			message.channel.send(`${client.config.emoji.err} You've rejected bug with ID **${id}**`);
		await client.db.delete(`bugr${id}`);
		let score = await client.db.get(`bugacc${val.author}`) || ""
		client.users.cache.get(val.author)
		.send({
			embeds: [new MessageEmbed()
			.setTitle(`Rejected Bug Report!`)
			.setColor(client.config.colors.red)
			.setThumbnail(client.config.thumbnail.pout)
			.setDescription(`Your bug report (**${id}**) has been rejected by **${message.author.tag}**.\n\n:white_small_square: **BUG REPORT SCORE:** ${score}\n${reason ? `:white_small_square: **DEVELOPER NOTE:** ${reason}` : ""}`)
			.setFooter(`Having a bug report score of 100 or higher will get you the "Bug Hunter" profile rank!`)]
		})
				.catch((x) => {});
	},
};