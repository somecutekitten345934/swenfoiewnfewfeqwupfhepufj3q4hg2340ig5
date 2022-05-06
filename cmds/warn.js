const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'warn',
	aliases: ['warn'],
	description: `Warn a user`,
	category: 'mod',
	cst: "tmod",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.channel.send(`${client.config.emoji.err} Incorrect usage; try using \`${message.guild.prefix}warn <user> <reason>\``)
		};
		let usr = await client.usr(args[0]).catch((f) => {});	
		if(!usr) return message.channel.send(`${client.config.emoji.err} I can't seem to find that user...`);

		const reason = args.slice(1).join(' ');
	
		let logsMessage = await client.channels.cache.get(client.config.channels.modlog).send({
			embeds: [new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Warned")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`, true)
			.addField("User", `${usr.tag} | ${usr.id}`, true)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Warned")]
		});

		let emb = new MessageEmbed()
		.setDescription(`You have received a warning in ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.config.colors.red)
		.addField(`Moderator`, message.author.tag)
		.addField("Reason", reason);

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${usr.tag} has been warned and was sent the following message:`)]
		});
		message.channel.send(emb);
		await client.users.cache.get(usr.id).send({embeds: [emb]}).catch((x) => {});
	}
};