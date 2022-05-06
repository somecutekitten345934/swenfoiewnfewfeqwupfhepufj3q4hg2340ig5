const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'bug',
	aliases: ['bug'],
	category: 'utl',	
	description: "Reports a bug in the support server. These will be reveiwed and taken seriously - spam or missuse of this command may result in a stun or blacklist from using this command.",
	async run(client, message, args) {
		let count = await client.db.get('bugcount') || 0;
			count = parseInt(count);
		let arr = message.content.slice(4).split(/\|+/);
		let title = arr[0];
		let desc = arr.slice(1).join(' ');
		if (!title || !desc) {
			return message.channel.send("You must include a title and a description for your bug separated by `|`, for example: `" + message.guild.prefix + "bug title for bug | description`")
		}
		let id = Math.floor(Math.random() * 100000);
		let val = await client.db.get("bugr" + id);
			while (val) {
				id = Math.floor(Math.random() * 100000);
			}
		let embed = [new MessageEmbed()
		.setColor(message.author.color)
		.setAuthor(`Bug Report #${count + 1}`)
		.setTitle(title)
		.setDescription(desc)
		.setTimestamp()
		.addField('Staff', `\`${client.config.prefix}approve ${id} <message>\` to approve this bug report and send ${message.author.tag} <message>\n\`${client.config.prefix}reject ${id} <message>\` reject this bug and send ${message.author.tag} <message>`)
		.setFooter(`${message.author.tag} | ${message.author.id}`)]
		message.channel.send({ embeds: embed});
		let msg = await client.channels.cache.get(client.config.channels.bug).send({ embeds: embed})
		await client.db.set("bugcount", count + 1)
		await client.db.set("bugr" + id, {
			number: count + 1,
			author: message.author.id,
			msg: msg.id,
			at: Date.now(),
			title: title
		})
	}
};