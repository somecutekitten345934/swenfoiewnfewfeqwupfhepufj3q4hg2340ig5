const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'useitem',
	aliases: ['use'],
	category: 'ecn',
	description: "Use a consumable item!",
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		if(!args.length){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Invalid Usage!`)
				.setThumbnail(client.config.thumbnail.question)
				.setColor(client.config.colors.red)
				.setDescription(`I'm not really sure what item you would like to use up.... Please specify!\n\nValid consumables include: \`t1sr\`, \`t2sr\`\n`)]
			})
		}
		let modifiers = await client.db.get(`modifiers${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0"
		modifiers = modifiers.split(`;`)
		let t1 = Number(modifiers[0])
		let t2 = Number(modifiers[1])


		if(args[0] == "t1sr" || args[0] == "T1StatRollback"){
			if(cst.includes(`maxedwaifu`)){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`Action Denied!`)
					.setDescription(`You are currently using an **ADMIN** waifu and are not allowed to use this item during this time. Remove the \`maxedwaifu\` permission and try again!`)
					.setThumbnail(client.config.thumbnail.fuckyou)]
				})
			}
		var data = await client.db.get("pet" + message.author.id);
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
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}				
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;

		if (!data) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Missing Waifu!`)
			.setThumbnail(client.config.emoji.question)
			.setDescription(`I can't let you use this item without having a waifu tamed! Tame one via \`${message.guild.prefix}tame\``)]
		})
		data = data.split(';');
		let stat = (args[1] || "").toLowerCase();
		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your ${display} is not home right now and can't be modified! Try waiting until she gets back to modify her stats!`)]
			})
		}
		if(t1 - 1 < 0){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.mad)
				.setTitle(`Insufficient Items`)
				.setDescription(`I can't downgrade your ${display}'s stats if you dont have any modifiers! Purchase modifiers via \`${message.guild.prefix}shop\``)]
			})
		}
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Invalid Stat`)
			.setThumbnail(client.config.thumbnail.mad)
			.setColor(client.config.colors.red)
			.setDescription(`I can't downgrade a stat on your ${display}, if it doesnt exist!
			
			**VALID STATS:**\n${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`)]
		});
		Stat = Stat.split(";");
		data[4] = Number(data[4]);
		data[4] = data[4] + 1;
		data[Stat[2]] = Number(data[Stat[2]]) - 1;
		if (data[Stat[2]] <= 0) return message.channel.send(`Each of your ${display}'s stats must have at least 1 point.`);
		//await client.db.set("dwngrdc" + message.author.id, (message.createdTimestamp + ms("30m")) - client.config.epoch);
		await client.db.set("pet" + message.author.id, data.join(';'));
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has reduced their ${display}'s ${Stat[1]} and received ${emojis[3]} 1!`)]
		}).catch((x) => {});
		modifiers[0] = t1 - 1;
		await client.db.set(`modifiers${message.author.id}`, modifiers.join(`;`))
		return;
		}
		if(args[0] == "t2sr"){
			if(cst.includes(`maxedwaifu`)){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`Action Denied!`)
					.setDescription(`You are currently using an **ADMIN** waifu and are not allowed to use this item during this time. Remove the \`maxedwaifu\` permission and try again!`)
					.setThumbnail(`${client.config.thumbnail.fuckyou}`)]
				})
			}
			var data = await client.db.get("pet" + message.author.id);
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
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}				
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;

		if (!data) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Missing Waifu!`)
			.setThumbnail(client.config.emoji.question)
			.setDescription(`I can't let you use this item without having a waifu tamed! Tame one via \`${message.guild.prefix}tame\``)]
		})
		data = data.split(';');
		let stat = (args[1] || "").toLowerCase();
		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your ${display} is not home right now and can't be modified! Try waiting until she gets back to modify her stats!`)]
			})
		}
		if(t2 - 1 < 0){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.mad)
				.setTitle(`Insufficient Items`)
				.setDescription(`I can't reset your ${display}'s stats if you dont have any modifiers! Purchase modifiers via \`${message.guild.prefix}shop\``)]
			})
		}
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Invalid Stat`)
			.setThumbnail(client.config.thumbnail.mad)
			.setColor(client.config.colors.red)
			.setDescription(`I can't reset a stat on your ${display}, if it doesnt exist!
			
			**VALID STATS:**\n${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`)]
		});
		Stat = Stat.split(";");
		let Credits = Number(data[Stat[2]]);
		let amt = Credits - 1;
		if (amt <= 0) {
			return message.channel.send("You must have at least 1 credits on a specified `<stat>` before depriving your waifu of this stat.");
		};
		data[Stat[2]] = Credits - amt;
		data[4] = Number(data[4]) + amt;
		//await client.db.set("dwngrdc" + message.author.id, (message.createdTimestamp + ms("30m")) - client.config.epoch);
		await client.db.set("pet" + message.author.id, data.join(';'));
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has reset their ${display}'s ${Stat[1]} and received ${emojis[3]} ${amt}!`)]
		}).catch((x) => {});
		modifiers[1] = t2 - 1;
		await client.db.set(`modifiers${message.author.id}`, modifiers.join(`;`))
		return;
		
		}
    }
}