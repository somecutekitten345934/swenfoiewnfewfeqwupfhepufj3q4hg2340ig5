const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'debugmode',
	aliases: ['debug', 'debugmode'],
	category: 'utl',	
	description: "Tooggle 'debug mode' on/off depending on the current setting.\nThis mode will enable certain features within the bot that allow staff to debug errors; this may be added to your account in order to assist us in tracking errors and resolving them.",
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		const check = cst.includes("debug");
		if (!check) {
			cst.push("debug");
			await client.db.set("cst" + message.author.id, cst.join(";"));
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`You have enabled debug mode.`)]
			})
		} else {
			cst = cst.filter((x) => !["debug"].includes(x));
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`You have disabled debug mode.`)]
			});
		};
	},
};