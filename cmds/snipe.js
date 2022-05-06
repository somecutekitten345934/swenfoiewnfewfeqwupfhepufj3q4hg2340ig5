const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "snipe",
	aliases: ['snipe', 'sn'],
	description: 'View the last deleted message in the current channel',
	category: 'utl',
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		if(!cst.includes(`sniper`)){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Insufficient Permission!`)
				.setDescription(`Sorry, I can't let you use the snipe system since you do not have the \`sniper\` cst!`)
				.setThumbnail(client.config.thumbnail.mad)]
			})
		}
		let snipedMsg = await client.db.get("snipe" + message.channel.id);
		if(!snipedMsg) return message.channel.send({
			embeds: [new MessageEmbed()
			.setDescription(`I can't find anything to snipe here... leave me alone!`)
			.setThumbnail(client.config.thumbnail.fuckyou)
			.setTitle(`No Snipes!`)]
		})
		const user = await client.users.fetch(snipedMsg.author) || message.author;
		if(snipedMsg.message == "USER_HIDDEN_MESSAGE"){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setThumbnail(client.config.thumbnail.question)
				.setTitle(`Unable to Snipe`)
				.setDescription(`Sorry, but I'm not allowed to snipe messages from that user!`)]
			})
		} else {
		message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`Sniped Message`)
				.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
				.setDescription(snipedMsg.message)
				.setFooter(`Sent ${require('moment')(new Date(snipedMsg.at)).format('MMMM Do YYYY, h:mm:ss UTC')}`)]
			})	
		}
	},
};