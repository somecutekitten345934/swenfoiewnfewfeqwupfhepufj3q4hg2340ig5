const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'about',
	aliases : ['about', 'abt'],
	category: 'info',
	description: 'See stuff about the bot',
	async run(client, message, args) {
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`ABOUT ME`)
			.setThumbnail(client.config.thumbnail.amaze)
			.setDescription(
				`
				Hello ${message.author.username}, I'm Weebchan!
	
				I am a social economy bot created by SemiMute#6630 on 02/04/2021. You can use me to do things like leveling up your waifu, going on adventures, socializing with friends, and much more!
				
				**SPECIAL THANKS**
				- <@501710994293129216> - Provided base code to help SemiMute learn
	
	You can invite me by using this link: <${client.config.inv}>
	
	| **NOTE:** This bot is still in active development; many features may be incomplete or break regularly. We can not guarantee a 100% error-free experience. If you find any bugs, please report them by using \`${message.guild.prefix}bug short description | long, in depth description\` 
				`)
			.setFooter(`Running ${client.user.username} ${client.config.version}`, client.config.footerIMG)]
			
		})
	}
}