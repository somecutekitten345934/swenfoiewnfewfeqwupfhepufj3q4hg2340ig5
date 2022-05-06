const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "unban",
	"aliases": ["unban"],
	"description": "unbans a user from the current guild.",
	"category": "mod",
	"cst": "moderator",
	async run(client, message, args) {
		if (!message.member.roles.cache.has(client.config.roles.mod.normal)) return message.channel.send("You must have the Moderator role in order to use this command. Trial Mods do not have permission to use this command, either.");

		if (!args.length) return message.channel.send("You must follow the format of `" + message.guild.prefix + "unban <user> [reason]`");
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send(`${client.config.emoji.err} You have provided an invalid user!`);
		var reason = args.slice(1).join(' ') || "No reason given";
		const log = new MessageEmbed()
		.setColor(client.config.colors.green)
		.setTitle(`Member Unanned`)
		.setThumbnail(message.author.displayAvatarURL())
		.addField("Moderator", `${message.author.tag} (${message.author.id})`, true)
		.addField("Target", `${user.tag} (${user.id})`, true)
		.addField("Reason", reason)
		.setTimestamp();
		const logMsg = await client.channels.cache.get(client.config.channels.modlog).send({ embeds: [log] })
		const Notification = new MessageEmbed()
		.setColor(client.config.colors['green'])
		.setDescription(`You have been unbanned from ${message.guild.name}. Please conduct yourself appropriately so you do not get banned again. [Log Message](${logMsg.url})—[Support Server Invite](${client.config.ssInvite})`)
		.addField("Moderator", message.author.tag)
		.addField("Reason", reason)

		const msgs = [`${client.config.emoji.tick} ${user.tag} has been successfully unbanned from the server and has been sent the following message:`];
		await message.guild.members.unban(user.id);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(msgs[0])]
		})
		message.channel.send({ embeds: [Notification] });
		client.users.cache.get(user.id)
			.send({ embeds: [Notification] })
				.catch((x) => {});
	}
};