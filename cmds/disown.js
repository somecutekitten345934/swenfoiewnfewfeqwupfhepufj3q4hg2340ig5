const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'disown',
	aliases: ['disown'],
	description: 'This **deletes** your waifu. **THIS ACTION CAN NOT AND WILL NOT BE UNDONE.**', 
	category: 'pet',	
	async run(client, message, args) {
		let check = await client.db.get('pet' + message.author.id);
		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				selected = display;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				selected = "default";
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}
		if (!check) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Not Tamed!`)
			.setThumbnail(client.config.thumbnail.pout)
			.setDescription(`You can't disown your${display} if you dont have one tamed!\n\nTame your very own waifu with \`${message.guild.prefix}tame\``)]
		});
		if(message.author.id == client.config.owner){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(client.config.thumbnail.lewd)
				.setDescription(`No`)]
			})
		}

		let affec = check[8];
		affec = affec - 1
		if(affec < 0){
			affec = 0
			await client.stn(message.author.id, 5, client)
			message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Action Denied!`)
				.setColor(message.author.color)
				.setThumbnail(client.config.thumbnail.pout)
				.setDescription(`${display} gets so annoyed with ${message.author.tag}, that they knock them out for **15 Minutes**!\n\n*${display} would have lost ${emojis[7]} 1 to you, but doesn't have any! Yikes!**`)]
			})
		} else {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Action Denied!`)
				.setColor(message.author.color)
				.setThumbnail(client.config.thumbnail.pout)
				.setDescription(`${message.author.tag}'s **${display}** slaps the shit out of them for trying to abandon them!\n\n*${display} loses ${emojis[7]} 1 due to ${message.author.tag} trying to disown them*`)]
			})
		}
		check[8] = affec
		await client.db.set(`pet${message.author.id}`, check.join(`;`))
		return
	}
}