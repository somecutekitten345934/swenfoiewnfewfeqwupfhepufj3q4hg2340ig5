const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: "approve",
	aliases: ["approve"],	
	description: 'approve a bug. All this does is post it in #announcements lol',
	cst: "apr",
	async run(client, message, args) {
		if (!args.length) return message.channel.send("You must provide a bug ID of the bug you wish to approve")
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
						.setColor("#6ae691")
						.setTitle(val.title)
						.setDescription(`${client.config.emoji.tick} **Bug Report #${val.number} was approved by ${message.author.tag}**`)
						col.first().edit({
							embeds: [rec],
						});
				client.channels.cache.get(client.config.channels.bugLog)
					.send(`Bug reported by ${client.users.cache.get(val.author).tag || "UNKNOWN_USER#0000"} was approved by ${message.author.tag}`, {
						embeds: [new MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(val.title.toString())
						.setDescription(col.first().embeds[0].description)
						.setTimestamp(val.at)]
					})		
			})
				.catch((x) => message.channel.send("There was an error: `" + x + "`"));
			message.channel.send(`${client.config.emoji.tick} You've approved bug with ID **${id}**`);
		await client.db.delete(`bugr${id}`);
		let score = await client.db.get(`bugacc${client.users.cache.get(val.author).id}`) || 0
		let nscore = score + 1;
		await client.db.set(`bugacc${client.users.cache.get(val.author).id}`, nscore)
		console.log(val.author)
		client.users.cache.get(val.author)
			.send({
				embeds: [new MessageEmbed()
				.setTitle(`Approved Bug Report!`)
				.setColor(client.config.colors.green)
				.setThumbnail(client.config.thumbnail.amaze)
				.setDescription(`Your bug report (**${id}**) has been approved by **${message.author.tag}**.\n\n:white_small_square: **BUG REPORT SCORE:** ${nscore}\n${reason ? `:white_small_square: **DEVELOPER NOTE:** ${reason}` : ""}`)
				.setFooter(`Having a bug report score of 100 or higher will get you the "Bug Hunter" profile rank!`)]
			})
				.catch((x) => {});
		if(score == 100) {
			let user = await client.usr(val.author).catch((x) => {});
			let cst = await client.db.get(`cst${val.author}`) || ""
			cst = cst.split(`;`)
			cst.push(`BUG_HUNTER_RANK`)
			await client.db.set(`cst${val.author}`, cst.join(`;`))
			user.send({
				embeds: [new MessageEmbed()
				.setTitle(`Approved Bug Report Milestone!`)
				.setColor(client.config.colors.green)
				.setThumbnail(client.config.thumbnail.amaze)
				.setDescription(`:tada: Your bug report (**${id}**) has gotten you your **100th** bug report to be approved! You have gained the ${client.config.emoji.BUG_HUNTER_RANK} **Bug Hunter** profile rank!`)]
			})
		}
	}
}