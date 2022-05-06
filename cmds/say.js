const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'say',
	aliases: ['say', 'echo'],
	description: 'Gets the bot to say your message',
	category: 'botowner999',
	async run(c, message, a) {
		let cst = await c.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if (![c.config.owner].includes(message.author.id)) 
			return message.channel.send(`${c.config.emoji.err} You actually thought you would be able to use this? Only SemiMute#6630 can use this! ;3`);
		if (!cst.includes("say")) return message.channel.send("You do not have permission to use this command.")
		if (!a.length) return message.channel.send("You must specify a message for me to say!");
		var msg = a.join(' ');
		message.delete()
		message.channel.send(msg.toString());
	},
};