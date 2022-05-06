const { MessageEmbed } = require(`discord.js`);
const ms = require('ms');

module.exports = {
	name: 'mute',
	aliases: ['mute'],
	description: 'Mutes a user',
	category: 'mod',
	cst: "tmod",
	async run(client, message, args) {
		if (message.guild.id !== "808086568815558687")
		return message.channel.send({
			embed: new MessageEmbed()
	//		.ssetColor(message.author.color)
			.setDescription(`${client.config.emoji.err} This command only works in Weebineers Haven!`)
		})
		let usr = await client.usr(args[0]).catch((f) => {});
		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);
		let member = message.guild.members.cache.get(usr.id);
		if (!member) return message.channel.send(`${client.config.emoji.err} The specified user is not a member of this server`);
		await member.roles.add(client.config.roles.muted);

		let amt = Number(args[1]);
		if(isNaN(amt) || (!args[1])) return message.channel.send(`${client.config.emoji.err} You must provide a valid length (in minutes). For permanent mutes, use 0 as the length.`)
		let reason = args.slice(2).join(' ');
		if (!reason) reason = "Moderator didn't specify a reason.";

		let logsMessage = await client.channels.cache.get(client.config.channels.modlog).send({
			embeds: [new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Muted")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`)
			.addField("User", `${member.user.tag} | ${member.id}`)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Muted")]
		});
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${member.user.tag} has been given a ${amt == 0 ? `permanent` : `${amt} minute`} mute because of "${reason}" and was sent the following message:`)]
		})
		let dm = new MessageEmbed()
		.setDescription(`You have received a ${amt == 0 ? 'permanent' : `${amt} minute`} mute from ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag)
		.addField("Reason", reason);
		message.channel.send({ embeds: [dm]});
		member.send({embeds: [dm]})
			.catch((x) => {});
		if (amt != 0) {
		setTimeout(async() => {
			let m = await client.db.get('mute' + member.id);
			if (!m) return;
			member.roles.remove(client.config.roles.muted);
			message.channel.send(`${client.config.emoji.tick} ${usr.tag} has been unmuted (mute time over)`);
			member.send({
				embeds: [new MessageEmbed()
				.setDescription(`You have been unmuted from ${message.guild.name}`)
				.setColor(client.config.colors.green)
				.addField("Moderator", client.user.tag)
			 .addField("Reason", "Time's up!")]
			});
			await client.db.delete('mute' + member.id);
		}, amt * ms('1m'))
		};
	},
}