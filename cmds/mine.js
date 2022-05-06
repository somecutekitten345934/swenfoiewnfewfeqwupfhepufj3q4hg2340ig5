const { MessageEmbed } = require('discord.js');
const delay = require('delay');
const ms = require('ms');

module.exports = {
name: 'mine',
aliases: ['mine', 'swing'],
description: 'Allows you to go mining! **PENDING REVAMP**',
category: 'ecn',
async run(client, message, args) {
	let data = await client.db.get("pet" + message.author.id);
	if (!data) return message.channel.send({
		embeds: [new MessageEmbed()
		.setTitle(`Missing Waifu!`)
		.setThumbnail(client.config.emoji.pout)
		.setDescription(`I can't let you go into the mines if you dont have a **[Lvl 1] Waifu** tamed! Tame one via \`${message.guild.prefix}tame\``)
		.setThumbnail(client.config.thumbnail.pout)]
	})
		data = data.split(";");
		let hp = Number(data[1])
		let en = Number(data[2]);
		let endur = Number(data[6]);
		let lvl = Number(data[0]);
		let xp = Number(data[3]);
		let str = Number(data[7]);
		let intel = Number(data[5]);
		let affec = Number(data[8])
		let consumed = Math.round((60 / (Math.log(endur + 9))));
		let rand = Math.floor(Math.random() * 100);
		let potions = `**NO ACTIVE POTIONS**`
		let runes = `**NO ACTIVE ITEMS**`

	const currAlias = await client.db.get("curralias" + message.author.id) || "default";
	let selected;
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
			display = "waifu";
			emojis = client.config.defaults.PET_EMOJIS;
		}
	}
	let cst = await client.db.get("cst" + message.author.id) || "";
			cst = cst.split(";")

	if(!cst.includes(`pickaxe`)){
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`You seem to be mising a ${client.config.emoji.t1pickaxe} Pickaxe. This item is required in order to go mining! \`;shop\``)]
		})
	}
	let cd = await client.db.get("minec" + message.author.id) || 0;
	let drrcd = await client.db.get("dose1d" + message.author.id) || 0;
	drrcd = Number(drrcd)
	let scnd = client.cooldown(message.createdTimestamp, cd) || 0;

	if (scnd) {
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Please wait another ${scnd} before heading back into the mines or you will pass out from exhaustion..`)
			.setFooter(`TIP: Drink potions of haste to reduce your mining cooldown!`)]
		})
	};
	if (Date.now() <= drrcd) cd -= 5000;{
	};
	var items = [] || [""];
	let tbadges = [] || [""];
	if(drrcd > 0){
		await client.db.set('minec' + message.author.id, (message.createdTimestamp + 6000) - client.config.epoch);
		tbadges.push(`${client.config.emoji.phaste}`)
	} else {
		await client.db.set('minec' + message.author.id, (message.createdTimestamp + 10000) - client.config.epoch);
	};

	if (tbadges.length == 0) tbadges.push("No Active Potions!")
	if (tbadges.length >= 9) tbadges.push("\n")
const ores = [
		client.config.emoji.t1ore,
		client.config.emoji.t2ore,
		client.config.emoji.t3ore,
		client.config.emoji.t4ore,
		client.config.emoji.t5ore,
	];


	if(cst.includes("t5pickaxe")){
		let amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		if(amtGained == 0){
			amtGained = 1
				}
		if(cst.includes(`wingsdarkness2`)){
			amtGained = Math.floor(Math.random() * 180 / 4)
			items.push(`${client.config.emoji.darkness2}`)
		} else if (cst.includes(`wingsdarkness1`)){
			amtGained = Math.floor(Math.random() * 165 / 5)
			items.push(`${client.config.emoji.darkness}`)
		} else {
			amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		}
		if (items.length >= 9) items.push("\n")
		if (items.length == 0) items.push("No Items!")
		message.channel.send({ 
			embeds: [new MessageEmbed()
			.setDescription(`${message.author.tag} and their ${display} travel to a nearby cavern with their ${client.config.emoji.t5pickaxe} and head down, in search of ores..`)
			.setColor(message.author.color)
			.addField(`Active Potions`, `${tbadges.join("")}`)
			.addField(`Active Items`, `${items.join("")}`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()] })

		await delay(1000)
		if(Math.random() * 100 > 98){
			if(cst.includes(`dfnd`)){
				rloss = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
				if(hp < 2000){
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)
					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)

					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send(`Your ${display} does not have enough health to defend you from these monsters. The monsters begin attacking you, stunning you for ${data}`)
				}
				if(en <= rloss){
					cst = cst.filter((x) => !["dfnd"].includes(x))
					await client.db.set("cst" + message.author.id, cst.join(";"))
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag}'s ${display} tries to protect them from the oncoming attack, but runs out of energy.. ${message.author.tag} gets knocked out for ${data}`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				} else {
					nen = data[2] - rloss;
					data[2] = nen
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`As ${message.author.tag} starts to mine, a hoard of monsters begin to attack. Their ${display} jumps in protecting them from the monsters, using up ${emojis[1]} ${rloss}. Due to the shock, you head to the surface without any ores...`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				}
			} else {
				rtime = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				stunTime *= ms(`1m`)

				await client.stn(message.author.id, stunTime/ms("1m"), client);
				await client.db.set('stnb' + message.author.id, "injured from the mines");
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`A group of monsters surround and attack ${message.author.tag} while their ${display} runs off, leaving them behind... Injured, you head back to the surface without any ores...`)
					.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
					.setTimestamp()]
				})
			}
		}

		const Ore = Math.floor(Math.random() * 100);

		if(Ore < 0) {
			Ore = 3
		}
		/*
		- 80% chance for coal,
		- 10% chance for iron,
		- 5% chance for gold,
		- 3% chance for diamond,
		- 2% chance for the netherite thingy
		*/
		let ore;
			if (Ore <= 50) {
				ore = ores[0];
			} else if (Ore >= 95) {
				ore = ores[4]
			} else if (Ore >= 85) {
				ore = ores[3]
			} else if (Ore >= 75) { 
				ore = ores[2]
			} else if (Ore >= 50) {
				ore = ores[1]
			} else {
				ore = ores[0]
			}
		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
		let indx = ores.findIndex((e) => e == ore);
		o[indx] = Number(o[indx]) + amtGained;
		await client.db.set(`ores${message.author.id}`, o.join(";"));

		await delay(500);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} heads into a nearby cave with some ${ore} in it. They mine a total of ${amtGained} ${ore}!`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()]
		})
		return;
	}
	if(cst.includes("t4pickaxe")){
		let amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		if(amtGained == 0){
			amtGained = 1
			}
		if(cst.includes(`wingsdarkness2`)){
			amtGained = Math.floor(Math.random() * 180 / 4)
			items.push(`${client.config.emoji.darkness2}`)
		} else if (cst.includes(`wingsdarkness1`)){
			amtGained = Math.floor(Math.random() * 165 / 5)
			items.push(`${client.config.emoji.darkness}`)
		} else {
			amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		}
		if (items.length >= 9) items.push("\n")
		if (items.length == 0) items.push("No Items!")
		message.channel.send({ 
			embeds: [new MessageEmbed()
			.setDescription(`${message.author.tag} and their ${display} travel to a nearby cavern with their ${client.config.emoji.t4pickaxe} and head down, in search of ores..`)
			.setColor(message.author.color)
			.addField(`Active Potions`, `${tbadges.join("")}`)
			.addField(`Active Items`, `${items.join("")}`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()] })

		await delay(1000)
		if(Math.random() * 100 > 98){
			if(cst.includes(`dfnd`)){
				rloss = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
				if(hp < 2000){
					client.stn(message.author.id, stunTime, client)
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send(`Your ${display} does not have enough health to defend you from these monsters. The monsters begin attacking you, stunning you for ${data}`)
				}
				if(en <= rloss){
					cst = cst.filter((x) => !["dfnd"].includes(x))
					await client.db.set("cst" + message.author.id, cst.join(";"))
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag}'s ${display} tries to protect them from the oncoming attack, but runs out of energy.. ${message.author.tag} gets knocked out for ${data}`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				} else {
					nen = data[2] - rloss;
					data[2] = nen
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`As ${message.author.tag} starts to mine, a hoard of monsters begin to attack. Their ${display} jumps in protecting them from the monsters, using up ${emojis[1]} ${rloss}. Due to the shock, you head to the surface without any ores...`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				}
			} else {
				rtime = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				stunTime *= ms(`1m`)

				await client.stn(message.author.id, stunTime/ms("1m"), client);
				await client.db.set('stnb' + message.author.id, "injured from the mines");
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`A group of monsters surround and attack ${message.author.tag} while their ${display} runs off, leaving them behind... Injured, you head back to the surface without any ores...`)
					.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
					.setTimestamp()]
				})
			}
		}

		const Ore = Math.floor(Math.random() * 100);

		if(Ore < 0) {
			Ore = 3
		}
		/*
		- 80% chance for coal,
		- 10% chance for iron,
		- 5% chance for gold,
		- 3% chance for diamond,
		- 2% chance for the netherite thingy
		*/
		let ore;
		if (Ore <= 50) {
			ore = ores[0];
		} else if (Ore >= 85) {
			ore = ores[3]
		} else if (Ore >= 75) { 
			ore = ores[2]
		} else if (Ore >= 50) {
			ore = ores[1]
		} else {
			ore = ores[0]
		}
		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
		let indx = ores.findIndex((e) => e == ore);
		o[indx] = Number(o[indx]) + amtGained;
		await client.db.set(`ores${message.author.id}`, o.join(";"));

		await delay(500);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} heads into a nearby cave with some ${ore} in it. They mine a total of ${amtGained} ${ore}!`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()]
		})
		return;
	}
	if(cst.includes("t3pickaxe")){
		let amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		if(amtGained == 0){
			amtGained = 1
				}
		if(cst.includes(`wingsdarkness2`)){
			amtGained = Math.floor(Math.random() * 180 / 4)
			items.push(`${client.config.emoji.darkness2}`)
		} else if (cst.includes(`wingsdarkness1`)){
			amtGained = Math.floor(Math.random() * 165 / 5)
			items.push(`${client.config.emoji.darkness}`)
		} else {
			amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		}
		if (items.length >= 9) items.push("\n")
		if (items.length == 0) items.push("No Items!")
		message.channel.send({ 
			embeds: [new MessageEmbed()
			.setDescription(`${message.author.tag} and their ${display} travel to a nearby cavern with their ${client.config.emoji.t3pickaxe} and head down, in search of ores..`)
			.setColor(message.author.color)
			.addField(`Active Potions`, `${tbadges.join("")}`)
			.addField(`Active Items`, `${items.join("")}`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()] })

		await delay(1000)
		if(Math.random() * 100 > 98){
			if(cst.includes(`dfnd`)){
				rloss = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
				if(hp < 2000){
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send(`Your ${display} does not have enough health to defend you from these monsters. The monsters begin attacking you, stunning you for ${data}`)
				}
				if(en <= rloss){
					cst = cst.filter((x) => !["dfnd"].includes(x))
					await client.db.set("cst" + message.author.id, cst.join(";"))
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag}'s ${display} tries to protect them from the oncoming attack, but runs out of energy.. ${message.author.tag} gets knocked out for ${data}`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				} else {
					nen = data[2] - rloss;
					data[2] = nen
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`As ${message.author.tag} starts to mine, a hoard of monsters begin to attack. Their ${display} jumps in protecting them from the monsters, using up ${emojis[1]} ${rloss}. Due to the shock, you head to the surface without any ores...`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				}
			} else {
				rtime = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				stunTime *= ms(`1m`)

				await client.stn(message.author.id, stunTime/ms("1m"), client);
				await client.db.set('stnb' + message.author.id, "injured from the mines");
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`A group of monsters surround and attack ${message.author.tag} while their ${display} runs off, leaving them behind... Injured, you head back to the surface without any ores...`)
					.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
					.setTimestamp()]
				})
			}
		}

		const Ore = Math.floor(Math.random() * 100);

		if(Ore < 0) {
			Ore = 3
		}
		/*
		- 80% chance for coal,
		- 10% chance for iron,
		- 5% chance for gold,
		- 3% chance for diamond,
		- 2% chance for the netherite thingy
		*/
		let ore;
		if (Ore <= 50) {
			ore = ores[0];
		} else if (Ore >= 75) { 
			ore = ores[2]
		} else if (Ore >= 50) {
			ore = ores[1]
		} else {
			ore = ores[0]
		}
		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
		let indx = ores.findIndex((e) => e == ore);
		o[indx] = Number(o[indx]) + amtGained;
		await client.db.set(`ores${message.author.id}`, o.join(";"));

		await delay(500);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} heads into a nearby cave with some ${ore} in it. They mine a total of ${amtGained} ${ore}!`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()]
		})
		return;
	}
	if(cst.includes("t2pickaxe")){
		let amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		if(amtGained == 0){
			amtGained = 1
				}
		if(cst.includes(`wingsdarkness2`)){
			amtGained = Math.floor(Math.random() * 180 / 4)
			items.push(`${client.config.emoji.darkness2}`)
		} else if (cst.includes(`wingsdarkness1`)){
			amtGained = Math.floor(Math.random() * 165 / 5)
			items.push(`${client.config.emoji.darkness}`)
		} else {
			amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		}
		if (items.length >= 9) items.push("\n")
		if (items.length == 0) items.push("No Items!")
		message.channel.send({ 
			embeds: [new MessageEmbed()
			.setDescription(`${message.author.tag} and their ${display} travel to a nearby cavern with their ${client.config.emoji.t2pickaxe} and head down, in search of ores..`)
			.setColor(message.author.color)
			.addField(`Active Potions`, `${tbadges.join("")}`)
			.addField(`Active Items`, `${items.join("")}`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()] })

		await delay(1000)
		if(Math.random() * 100 > 98){
			if(cst.includes(`dfnd`)){
				rloss = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
				if(hp < 2000){
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines!");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send(`Your ${display} does not have enough health to defend you from these monsters. The monsters begin attacking you, stunning you for ${data}`)
				}
				if(en <= rloss){
					cst = cst.filter((x) => !["dfnd"].includes(x))
					await client.db.set("cst" + message.author.id, cst.join(";"))
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag}'s ${display} tries to protect them from the oncoming attack, but runs out of energy.. ${message.author.tag} gets knocked out for ${data}`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				} else {
					nen = data[2] - rloss;
					data[2] = nen
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`As ${message.author.tag} starts to mine, a hoard of monsters begin to attack. Their ${display} jumps in protecting them from the monsters, using up ${emojis[1]} ${rloss}. Due to the shock, you head to the surface without any ores...`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				}
			} else {
				rtime = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				stunTime *= ms(`1m`)

				await client.stn(message.author.id, stunTime/ms("1m"), client);
				await client.db.set('stnb' + message.author.id, "injured from the mines");
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`A group of monsters surround and attack ${message.author.tag} while their ${display} runs off, leaving them behind... Injured, you head back to the surface without any ores...`)
					.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
					.setTimestamp()]
				})
			}
		}

		const Ore = Math.floor(Math.random() * 100);
		/*
		- 80% chance for coal,
		- 10% chance for iron,
		- 5% chance for gold,
		- 3% chance for diamond,
		- 2% chance for the netherite thingy
		*/
		let ore;
		if (Ore <= 50) {
			ore = ores[0];
		} else if (Ore >= 50) {
			ore = ores[1]
		} else {
			ore = ores[0]
		}
		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
		let indx = ores.findIndex((e) => e == ore);
		o[indx] = Number(o[indx]) + amtGained;
		await client.db.set(`ores${message.author.id}`, o.join(";"));

		await delay(500);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} heads into a nearby cave with some ${ore} in it. They mine a total of ${amtGained} ${ore}!`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()]
		})
		return;
	}
	if(cst.includes("pickaxe")){
		let amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		if(amtGained == 0){
			amtGained = 1
			}
		if(cst.includes(`wingsdarkness2`)){
			amtGained = Math.floor(Math.random() * 180 / 4)
			items.push(`${client.config.emoji.darkness2}`)
		} else if (cst.includes(`wingsdarkness1`)){
			amtGained = Math.floor(Math.random() * 165 / 5)
			items.push(`${client.config.emoji.darkness}`)
		} else {
			amtGained = Math.floor(Math.random() * 150 / 6) || 1;
		}
		if (items.length >= 9) items.push("\n")
		if (items.length == 0) items.push("No Items!")
		message.channel.send({ 
			embeds: [new MessageEmbed()
			.setDescription(`${message.author.tag} and their ${display} travel to a nearby cavern with their ${client.config.emoji.t1pickaxe} and head down, in search of ores..`)
			.setColor(message.author.color)
			.addField(`Active Potions`, `${tbadges.join("")}`)
			.addField(`Active Items`, `${items.join("")}`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()] })

		await delay(1000)
		if(Math.random() * 100 > 98){
			if(cst.includes(`dfnd`)){
				rloss = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
				if(hp < 2000){
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send(`Your ${display} does not have enough health to defend you from these monsters. The monsters begin attacking you, stunning you for ${data}`)
				}
				if(en <= rloss){
					cst = cst.filter((x) => !["dfnd"].includes(x))
					await client.db.set("cst" + message.author.id, cst.join(";"))
					let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					stunTime *= ms(`1m`)

					await client.stn(message.author.id, stunTime/ms("1m"), client);
					await client.db.set('stnb' + message.author.id, "injured from the mines");
					let stn = await client.db.get(`stn${message.author.id}`)
					const data = client.cooldown(message.createdTimestamp, stn);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag}'s ${display} tries to protect them from the oncoming attack, but runs out of energy.. ${message.author.tag} gets knocked out for ${data}`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				} else {
					nen = data[2] - rloss;
					data[2] = nen
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`As ${message.author.tag} starts to mine, a hoard of monsters begin to attack. Their ${display} jumps in protecting them from the monsters, using up ${emojis[1]} ${rloss}. Due to the shock, you head to the surface without any ores...`)
						.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
						.setTimestamp()]
					})
				}
			} else {
				rtime = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				let stunTime = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				stunTime *= ms(`1m`)

				await client.stn(message.author.id, stunTime/ms("1m"), client);
				await client.db.set('stnb' + message.author.id, "injured from the mines");
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`A group of monsters surround and attack ${message.author.tag} while their ${display} runs off, leaving them behind... Injured, you head back to the surface without any ores...`)
					.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
					.setTimestamp()]
				})
			}
		}

		const Ore = Math.floor(Math.random() * 100);
		/*
		- 80% chance for coal,
		- 10% chance for iron,
		- 5% chance for gold,
		- 3% chance for diamond,
		- 2% chance for the netherite thingy
		*/
		let ore;
			if (Ore <= 80) {
				ore = ores[0];
			} else {
				ore = ores[0]
			}
		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
		let indx = ores.findIndex((e) => e == ore);
		o[indx] = Number(o[indx]) + amtGained;
		await client.db.set(`ores${message.author.id}`, o.join(";"));

		await delay(500);
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} heads into a nearby cave with some ${ore} in it. They mine a total of ${amtGained} ${ore}!`)
			.setFooter(`TIP: Waifus will protect you from attacks via ${message.guild.prefix}protect!`)
			.setTimestamp()]
		})
		return;
	}
	else {
		return message.channel.send(`${client.config.emoji.err} An error occured whilst determining your pickaxe tier. Contact SemiMute#6630 for more information.`)
	}
},
};