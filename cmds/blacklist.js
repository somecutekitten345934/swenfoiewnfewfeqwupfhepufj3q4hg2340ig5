let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "blacklist",
	aliases: ['bl', "botban"],
	cst: "blacklist",
	desc: "un/blacklist a user from the bot.",
	usage: "blacklist [user] <+/->",
	category: 'botdeveloper',
	cst: "botdeveloper",
async run(client, message, args) {
		if (!args.length) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Invalid Usage!`)
			.setDescription(`I don't know.. maybe try giving me a user and a reason for their blacklist!`)
			.setThumbnail(client.config.thumbnail.question)]
		});
  		const user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Invalid User!`)
			.setDescription(`I'm not really sure who you want me to blacklist... give me a user!`)
			.setThumbnail(client.config.thumbnail.question)]
		});
		let cst = await client.db.get("cst" + user.id);
				cst = cst ? cst.split(";") : [];

		const banned = cst.includes("blacklisted");

		if (user.id == client.config.owner) return message.reply({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Game Master Interference!`)
			.setDescription(`**[GM] SemiMute**: That's kinda rude!`)]
		});

		if (banned) {
			return message.channel.send({
				embeds: new MessageEmbed()
				.setColor(client.config.colors.red)
				.setDescription(`This person is already blacklisted... Two negatives mean a positive.. You want me to unblacklist them? Didnt think so!`)
				.setThumbnail(client.config.thumbnail.question)
			});
		} else {
			await client.blacklist(user.id, `${args.slice(1).join(" ") || "Bot Administrator did not provide a reason"}`, false, message.channel.id)
		}
	},
};