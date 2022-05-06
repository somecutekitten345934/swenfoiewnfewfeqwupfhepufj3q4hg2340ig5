const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unstun',
	aliases: ['unstun', 'un-stun'],
	cst: "unstun",
	category: 'own',
	description: 'unstuns a user, allowing them to use commands',
	async run(client, message, args) {
		if(!args.length) return message.channel.send("You must specify the user to unstun!");
		let usr = await client.usr(args[0]).catch((f) => {});
		if(!usr) return;
		let Data = await client.db.get('stn' + usr.id);
		if (!Data) return message.channel.send(`${usr.tag} is not stunned`)
		await client.db.delete('stn' + usr.id);
		await client.db.delete("dns" + usr.id);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully unstunned ${usr.tag}`)]
		})
	} 
}