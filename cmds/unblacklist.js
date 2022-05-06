let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unblacklist",
	aliases: ['unbl', "unbotban"],
	cst: "unblacklist",
	desc: "unblacklist a user from the bot.",
	usage: "unblacklist <user> [reason]",
	category: 'botdeveloper',
async run(client, message, args) {
	if (args.length < 1) return message.channel.send("You must input a UserResolvable argument.")
  const user = await client.usr(args[0]).catch((x) => {});
	if (!user) return message.channel.send("Please provide a valid ID or mention a user in the server!");
	let cst = await client.db.get("cst" + user.id);
			cst = cst ? cst.split(";") : [];
	const msg = `${client.config.emoji.tick} ${user.tag} was`;
	const Embeds = {
		unblacklisted: [new MessageEmbed()
		.setColor(client.config.colors.green)
		.setDescription(`You have been unblacklisted from Weebineers Bot. This means that you're now allowed to use the bot and will no longer be ignored!`)
		.addField(
			"Developer",
			message.author.tag
		)
		.addField("Reason", args.slice(1).join(" ") || "no reason")]
	}
	if (cst.includes("blacklisted")) {
		cst = cst.filter((x) => !["blacklisted"].includes(x));
		await client.db.set("cst" + user["id"], cst.join(";"));
		message.channel.send(`${msg} successfully unblacklisted and was sent the following message:`);
		message.channel.send({ embeds: Embeds.unblacklisted });
		return user 
			.send({ embeds: Embeds.unblacklisted })
				.catch((x) => {});
	} else {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.green)
				.setDescription(`omg bro what are you THINKING that guy isnt even blacklisted`)]
			});
		};
	},
};