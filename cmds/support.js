const { MessageEmbed } = require("discord.js");

module.exports = {
	"name": "support",
	aliases: ['support', 'helpme', 'bothelp', 'hub', 'weebineers', 'haven'],
	description: "View an invite to the bot's support server",
	category: 'info',
	async run(client, message, args) {
		if (message.guild.id == "363864112482222080") {
			return message.channel.send(`Here's an invite to my Haven: ${client.config.ssInvite}`)
		}
		message.channel.send(`Hey! You can join my support server **Weebchan's Haven** by clicking the link below!\n${client.config.ssInvite}`);
	},
};