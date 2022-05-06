const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
	"name": "ban",
	"aliases": ["ban"],
	"description": "Bans a user from the current guild.",
	"cst": "moderator",
	async run(client, message, args) {
		let logs = await client.db.get(`logs${message.guild.id}`)
		if(!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Insufficient Permissions!`)
				.setDescription(`${client.config.emoji.err} Sorry, but you lack the \`BAN_MEMBERS\` permission!`)]
			})
		}
		if(!logs){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Error Encountered!`)
				.setDescription(`${client.config.emoji.err} Weebchan does not know how to log any moderation actions without a logs channel being set!`)]
			})
		}
		if (args.length < 1) return message.channel.send("You must provide a `user` resolvable for your ban.")
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send(`${client.config.emoji.err} You have provided an invalid user!`);
		let cst = await client.db.get("cst" + user.id) || "";
		if (cst.split(";").includes("moderator")) return message.channel.send("Moderators cannot ban each other. (`<User>` possesses `moderator` CST.)")
		var reason = args.slice(1).join(' ');
		if (!reason) reason = "<UNKNOWN REASON>"
		const Notification = [new MessageEmbed()
		.setColor(client.config.colors['red'])
		.setDescription(`You have received a permanent ban from ${message.guild.name}. Note that your ban might be lifted soon—to appeal for an unban (or check your remaining ban length), please PM ${client.users.cache.get(client.config.owner).tag}. Additionally, if you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}`)
		.addField("Moderator", message.author.tag)
		.addField("Reason", reason)]

		const msgs = [`${client.config.emoji.tick} ${user.tag} was given a permanent ban for "${reason}"; they have been sent the following message:`];

		var GuildMember = message.guild.members.cache.get(user.id);
		let tcst = await client.db.get(`cst${user.id}`) || ""
		tcst = tcst.split(`;`)
		
		if (!GuildMember) {
			await message.guild.members.ban({ days: 6, reason: `Banned by ${message.author.tag} (${message.author.id}); reason=${reason}` })
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(msgs[0])]
			});
			message.channel.send({ embeds: [Notification] });
		} else {
		GuildMember
			.send({ embeds: [Notification] })
				.catch((x) => {});
		GuildMember.ban({reason: `Banned by ${message.author.tag} (${message.author.id}); reason="${reason}"`});
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(msgs[0])]
		});
		message.channel.send({ embeds: [Notification] });
		};
	},
};