const { MessageEmbed, escapeMarkdown } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'stun',
	aliases: ['stun'],
	cst: "administrator132465798",
	description: 'stuns a user, preventing them from using any commands',
	category: 'own',
	async run(client, message, args) {
		if(args.length < 2 || (isNaN(args[1]))) return message.channel.send("You must specify the user to stun, along with the stun time (in minutes)");
		let usr = await client.usr(args[0]).catch((e) => {});
		if (!usr) return message.channel.send(`Unknown user "${args[0]}"`);
		await client.db.set("stn" + usr.id, (message.createdTimestamp + Number(args[1]) * 60000) - client.config.epoch);
		await client.db.set("dns" + usr.id, (message.createdTimestamp + Number(args[1])) - client.config.epoch);
		message.channel.send(`${client.config.emoji.tick} Successfully stunned **${usr.tag}** for ${args[1]} minutes.`);
		message.channel.send(`Successfully set stn ${usr.id} as ${(message.createdTimestamp + Number(args[1]) * 60000) - client.config.epoch}`);
	},
};