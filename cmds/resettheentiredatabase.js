const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'resettheentiredatabase',
	aliases: ['resettheentiredatabase'],
	description: "Resets the entire bot **NOT A JOKE** Only SemiMute can use this command.",
	usage: "<>",
	dev: false,
	category: 'botowner999',
	guild: false,
	async run(client, message, args) {
		if (message.author.id != "216749228087705610") {
			return message.reply('You dont have permission to use this command! Only SemiMute#6630 may run this comamnd')
		};
		await client.db.clear();
			message.channel.send({
				embeds: [new MessageEmbed()
				.setDescription("Successfully wiped the entire database")
				.setColor('#da0000')]
			});
	},
};