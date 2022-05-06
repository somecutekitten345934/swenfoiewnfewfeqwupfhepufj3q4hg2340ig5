const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'bio',
	aliases: ['bio', 'setbio'],
	category: 'utl',	
	description: 'Edits your `bio` (Shwon in the `profile` command)',
	async run(client, message, args) {
		let str = args.join(' ');
		str = str.slice(0, 250)
		
		if(!args.length){
			return message.reply(`Do you really want your bio as nothing?? I think not!`)
		}

		await client.db.set('bio' + message.author.id, str)
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has updated their profile bio to "${str}"`)]
		})
	}
}