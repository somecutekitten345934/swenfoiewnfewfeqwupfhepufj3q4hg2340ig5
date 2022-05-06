const { MessageEmbed, Message } = require('discord.js');

module.exports = {
	name: 'name',
	aliases: ['name'],
	description: 'Name your waifu.',
	category: 'pet',
	cst: "supreme",
	async run(client, message, args) {
		if(args[0] == "clear"){
			await client.db.delete(`petname${message.author.id}`)
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully removed their waifu's name`)]
			})
		}
		if (!args.length) return message.channel.send("You must specify a new name for your waifu!")
		let newName = args.join(' ');
		if(newName.length > 50) return message.channel.send("Your waifu's name may not exceed 50 characters in length.")
		await client.db.set('petname' + message.author.id, newName);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully renamed their waifu to ${newName}`)]
		});
	},
};