const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'commas',
	aliases: ["com", "comma"],
	category: 'custom',	
	description: "Toggle comme separation on/off",
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id);
				cst = cst ? cst.split(";") : [];
		if (cst.includes("ncma")) {
			cst = cst.filter((x) => !["ncma"].includes(x));
			await client.db.set("cst" + message.author.id, cst.join(";"));
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has toggled comma separation on`)]
			})
		} else {
			cst.push("ncma");
			await client.db.set("cst" + message.author.id, cst.join(";"));
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has toggled comma separation off`)]
			})
		}
	}
}