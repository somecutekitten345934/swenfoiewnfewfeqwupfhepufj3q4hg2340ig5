const { MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = {
	name: 'steal',
	description: 'steal a package',
	category: 'eco',
	aliases: ['steal'],
	async run(client, message, args) {
		let _ = await client.db.get("pkg" + message.channel.id);
		let special = await client.db.get(`spkg${message.channel.id}`)
		if(special){
			let lootbox = await client.db.get(`lootbox${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
			lootbox = lootbox.split(";")
			summer = lootbox[5]
			summer = Number(summer)

			lootbox[5] = summer + 1
			await client.db.set(`lootbox${message.author.id}`, lootbox.join(`;`))

			await client.db.delete(`spkg${message.channel.id}`)
			await client.db.delete(`pkg${message.channel.id}`)
			
			let rand = Math.floor(Math.random() * (5 - 3 + 1) ) + 3;
			await client.db.set(`pkgc${message.channel.id}`, (message.createdTimestamp + ms(`${rand}m`)) - client.config.epoch);
			let cooldown = await client.db.get(`pkgc${message.channel.id}`)
			const sdata = client.cooldown(message.createdTimestamp, cooldown);
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has grabbed Weeb~chan's ${client.config.emoji.package} containing a **RARE DROP** and has obtained a ${client.config.emoji.summer}! \nOpen your rare lootbox via \`${message.guild.prefix}lootbox open summer\``)
				.setThumbnail(`https://i.gyazo.com/d800f9c6f88a510ca276ba59947ba3a2.jpg`)]
			})

		}
		if (!_) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`No waifus have dropped their ${client.config.emoji.package} recently.. Sorreh ${client.config.emoji.sadge}`)]
		})

		await client.db.delete(`pkg${message.channel.id}`);
		let oldbal = await client.db.get(`bal${message.author.id}`) || 0;
		let amt = Math.floor(
			Math.random() * 100
		);
		let cst = await client.db.get(`cst${message.author.id}`) || "";
		cst = cst.split(`;`)
		if (Math.floor(Math.random(1) * 10) >= 9) {
			let rand = Math.floor(Math.random() * 100)
			if(rand < 90){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`<:summerchan:846214748339961886> **SMACK!** Weebchan knocks ${message.author.tag} out for 1 minute!`)]
				})
				client.stn(message.author.id, 1, client)
				await client.db.set("stnb" + message.author.id, "knocked out by Weebchan")
				return;
			} else {
				message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.nekolover} **NYA!** A catgirl knocks ${message.author.tag} out for 1 minute!`)]
			})
			client.stn(message.author.id, 1, client)
			await client.db.set("stnb" + message.author.id, "knocked out by a catgirl")
			return;
		}
		};
		if(cst.includes(`BEACHBALL_TALISMAN`)){
			amt = Math.floor(Math.random() * 200)
			message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has stolen a waifus's ${client.config.emoji.package} and found ${client.config.emoji.coin} ${client.comma(amt)}. Due to your ${client.config.emoji.BEACHBALL_TALISMAN} talisman, you have stolen a higher amount!`)]
		})
			await client.db.set(`bal${message.author.id}`, oldbal + amt);
			let randc = Math.floor(Math.random() * 5)
			randc = Number(randc)
			if(randc < 0){
				randc = 1
			}
			let rand = Math.floor(Math.random() * (5 - 3 + 1) ) + 3;
			await client.db.set(`pkgc${message.channel.id}`, (message.createdTimestamp + ms(`${rand}m`)) - client.config.epoch);
			let cooldown = await client.db.get(`pkgc${message.channel.id}`)
			const sdata = client.cooldown(message.createdTimestamp, cooldown);
		} else{
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has stolen a waifus's ${client.config.emoji.package} and found ${client.config.emoji.coin} ${client.comma(amt)}. She tries snatching it back but is unable to.`)]
			})
			await client.db.set(`bal${message.author.id}`, oldbal + amt);
			await client.db.delete(`pkgc${message.channel.id}`)
			let rand = Math.floor(Math.random() * (5 - 3 + 1) ) + 3;
			await client.db.set(`pkgc${message.channel.id}`, (message.createdTimestamp + ms(`${rand}m`)) - client.config.epoch);
			let cooldown = await client.db.get(`pkgc${message.channel.id}`)
			const sdata = client.cooldown(message.createdTimestamp, cooldown);
		}
	}
};