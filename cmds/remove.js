const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'remove',
	aliases: ['delete', 'del', 'remove'],
	description: 'Deletes something from the database',
	usage: '<name of thing to delete(string)>',
	cst: "remove",
	category: 'own',	
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send("You must specify a user and a key to delete");
		const user = await client.usr(args[0])
		let key = args.slice(1).join(' ');
		if (message.author.id !== client.config.owner && (user == client.config.owner)){
			return message.channel.send(`${client.config.emoji.err} You are not permitted to delete any of SemiMute#6630's Data!`)
		}
		if (!key) return message.channel.send("You must provide something to remove under the format of `" + message.guild.prefix + "delete <key>" + '`');
		let cst = await client.db.get("cst" + message.author.id);
      		    cst = cst ? cst.split(";") : [];
		try {
			const now = Date.now();
			await client.db.delete(key + user.id);
			const diff = Date.now() - now;
			message.channel.send(`Weebchan has successfully removed ${key} ${user.id} ${cst.includes("tmr") ? "in " + diff + " miliseconds." : ""}`)
		} catch (err) {
			console.error(err);
			message.channel.send(":x: Error => `" + err.message + "` sent to console.")
		}
	},
}