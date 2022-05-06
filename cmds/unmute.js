const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unmute',
	aliases: ['unmute', 'un-mute'],
	description: 'unmutes a user.',
	category: 'mod',
	cst: "tmod",
	async run (client, message, args) {
		message.reply(`System broken, will be fixed soon`)
		let usr = await client.usr(args[0]).catch((err) => {});
		let mutedrole = await client.db.get(`mutedrole${message.guild.id}`)
		let logs = await client.db.get(`logs${message.guild.id}`)

		if(!mutedrole){
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Error Encountered!`)
				.setDescription(`${client.config.emoji.err} Weebchan does not know how to mute anyone without a muted role setup!`)
			})
		}
		if(!logs){
			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Error Encountered!`)
				.setDescription(`${client.config.emoji.err} Weebchan does not know how to log any moderation actions without a logs channel being set!`)
			})
		}

		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);
		let member = message.guild.member(usr.id);
		if (!member) return message.channel.send(`${client.config.emoji.err} The specified user is not a member of this server`);
		if (!member.roles.cache.has(mutedrole)) {
			return message.channel.send(`${client.config.emoji.err} ${member.user.tag} isn't muted... how are you gonna unmute them?`);
		};
		let dm = new MessageEmbed()
		.setColor(client.config.colors.green)
		.setDescription(`Your mute has been removed in ${message.guild.name}`)
		.addField(`Moderator`, message.author.tag, true)
		.addField("Reason", args.slice(1).join(' ') || "No reason given", true)
		let log = await client.channels.cache.get(logs).send({
			embed: new MessageEmbed()
			.setTitle(`Member Unmuted`)
			.setColor(client.config.colors.green)
			.addFields(
				{ name: 'Moderator', value: `${message.author.tag} | ${message.author.id}`, inline: true },
				{
					name: 'Member',
					value: `${member.user.tag} | ${member.id}`,
					inline: true,
				},
				{
					name: "Reason",
					value: args.slice(1).join(' ') || "No reason given"
				}
			)
			.setFooter("Unmuted")
			.setTimestamp()
		})
		await member.roles.remove(mutedrole);
		await message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${member.user.tag} has been unmuted and was sent the following message:`)
		})
		message.channel.send(dm);
		member.send(dm);
	}
}