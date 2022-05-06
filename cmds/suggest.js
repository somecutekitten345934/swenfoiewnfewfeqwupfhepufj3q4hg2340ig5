const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'suggest',
	aliases: ['suggest', 'addsmthnew'],
	description: 'Suggest a new idea to be added to the bot; will be posted in <#808123394616197141> | Trolling the suggestions will result in your suggest permissions being removed.',
	category: 'utl',
	disabed: true,
	async run(client, message, args) {
		let usr = await client.usr(message.author.id)
		if(message.guild.id == `742257076637794344`){
				if(message.author.id !== client.config.owner) { return; }
				let cd = await client.db.get("sgstwc" + message.author.id);
				cd = Number(cd);
		let scnd = client.cooldown(message.createdTimestamp, cd);
		if (scnd) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setDescription(`I can't post any suggestions from you for another **${scnd}**`)
				.setTitle(`Command Cooldown!`)
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.question)]
			});
		};

		if (!args.length) return message.channel.send(`Please provide an actual suggestion for Weebineers! Please note that any troll suggestions will result in your command permission being revoked!`)
		await client.db.set('sgstwc' + message.author.id, (message.createdTimestamp + 60000) - client.config.epoch);				
			var suggest = args.join(' ');
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(client.config.thumbnail.cool)
				.setDescription(`I have posted your suggestion to <#912803933347528766>\n\n**Your suggestion:**\n${suggest}`)]
			})
			let channel = client.channels.cache.get(`912803933347528766`)
				channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`New Suggestion`)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(suggest.toString())
					.setFooter(`${message.author.tag} (${message.author.id})`)]
				})
				.then(msg => msg.startThread({ name: `${usr.username}\n's Suggestion`, autoArchiveDuration: 1440, reason: `[WEEBCHAN]: Suggestion was made by ${usr.tag}`})
				.then(msg => msg.setLocked(true))
				)
			
		} else {
			let cd = await client.db.get("sgstc" + message.author.id);
			cd = Number(cd);
			let scnd = client.cooldown(message.createdTimestamp, cd);
			if (scnd) {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setDescription(`I can't post any suggestions from you for another **${scnd}**`)
					.setTitle(`Command Cooldown!`)
					.setColor(client.config.colors.red)
					.setThumbnail(client.config.thumbnail.question)]
				});
			};

			if (!args.length) return message.channel.send(`You must provide a suggestion for me to uhh... suggest?`)
			await client.db.set('sgstc' + message.author.id, (message.createdTimestamp + 60000) - client.config.epoch);				
			var suggest = args.join(' ');
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Suggestion Posted!`)
					.setThumbnail(client.config.thumbnail.amaze)
					.setDescription(`I have posted your suggestion to our [support server](${client.config.ssInvite})\n\n**Your suggestion:**\n${suggest}`)]
				});
				let channel = client.channels.cache.get(client.config.channels.suggestions)
					channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`New Suggestion`)
						.setThumbnail(message.author.displayAvatarURL())
						.setDescription(suggest.toString())
						.setFooter(`${message.author.tag} (${message.author.id})`)]
					})
					.then(msg => msg.startThread({ name: `${usr.username}\n's Suggestion`, autoArchiveDuration: 1440, reason: `[WEEBCHAN]: Suggestion was made by ${usr.tag}`})
					.then(msg => msg.setLocked(true))
					)
		}
	}
}