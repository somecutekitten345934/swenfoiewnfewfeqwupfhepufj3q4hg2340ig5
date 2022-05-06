const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js');
const delay = require("delay");
const ms = require(`ms`)

module.exports = {
	name: "train",
	aliases: ["trn", "train"],
	description: "Send your waifu on adventures and fight bosses! **PENDING REVAMP**",
	category: 'pet',
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
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
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send({
			embeds: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.err} You must own a **[LVL 1] Waifu** in order to use this command! Begin your adventures by taming one with \`${message.guild.prefix}tame\`!`)
			.setThumbnail(`https://cdn.discordapp.com/avatars/509798534204096513/27813c431bf7b41862b9f157285c4c18.png`)
		})
				"level;health;energy;exp;credits;intel;endur;str;affec"
  	async function upgradePet() {
			let data = await client.db.get(`pet${message.author.id}`);
		data = data.split(';');
			lvl = Number(data[0])
			if (lvl >= 50) return;
		let cred = Number(data[4]);
		if (isNaN(cred)) cred = 0;
		data[4] = Number(cred + 1);
		data[0] = lvl + 1;
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`**WAIFU ꖎᒷ⍊ᒷꖎ ⚍!¡!** :tada:\n${message.author.tag}'s **[LEVEL ${data[0] - 1}] ${display}** has leveled up to **LEVEL ${data[0]}** and ⊣ᔑ╎リᒷ↸ ${emojis[3]} 1`)]
		});
		if(cst.includes(`maxedwaifu`)){
			return message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
		} else {
			await client.db.set(`pet${message.author.id}`, data.join(`;`))
		}
	}
	let data = await client.db.get("pet" + message.author.id);
			if(cst.includes(`maxedwaifu`)){
				data = client.config.maxedPet
			}
		data = data.split(";");
	if (!data) return message.channel.send({
		embeds: [new MessageEmbed()
		.setColor(message.author.color)
		.setDescription(`${client.config.emoji.err} You must own a **[LVL 1] Waifu** in order to use this command! Begin your adventures by taming one with \`${message.guild.prefix}tame\`!`)
		.setThumbnail(`https://cdn.discordapp.com/avatars/509798534204096513/27813c431bf7b41862b9f157285c4c18.png`)]
	})
	if(cst.includes(`waifusleep`)){
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.sleep} Sorry, your ${display} can't go on an adventure while sleeping! Wake them up with \`${message.guild.prefix}waifu sleep\` for them to adventure with you!`)]
		})
	}
	let petuse = await client.db.get(`petuse${message.author.id}`)
	let petusec = client.cooldown(message.createdTimestamp, petuse);
	if(petusec){
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(client.config.thumbnail.pout)
			.setTitle(`${display} Not Home!`)
			.setDescription(`Your ${display} is not currently by your side! You may not send her out again until she returns...\n\nYour ${display} will automatically return in **${petusec}**`)]
		})
	}
		let hp = Number(data[1]);
		let en = Number(data[2]);
		let endur = Number(data[6]);
		let lvl = Number(data[0]);
		let xp = Number(data[3]);
		let str = Number(data[7]);
		let intel = Number(data[5]);
		let affec = Number(data[8])
		let consume = Math.round((60 / (Math.log(endur + 6 / 5))) / 2 / 4);
		if(consume < 2){
			consume = 2
		}
		consume = Number(consume)

		let rand = Math.floor(Math.random() * 100);

		let sugarrush = Math.floor(Math.random() * 100)
		let cd = await client.db.get("trainc" + message.author.id);
		let scnd = client.cooldown(message.createdTimestamp, cd);
		if (scnd) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your ${display} is too tired to go on an adventure again.... Try waiting another ${scnd} before training again!`)
				.setThumbnail(emojis[9])]
			});
		};
		if (en - consume < 0) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Your ${display} is too tired to do anything right now! Get her energy up with \`${message.guild.prefix}feed\``)
				.setThumbnail(emojis[9])]
			})
		};
		if (hp < 1000) {
			return message.channel.send(":broken_heart: I'm too injured to go on an adventure right now! Why not feed me to get me above **1,000** health by using `" + message.guild.prefix + "feed`?")
		}

		if(Math.trunc(Math.random() * 100 > 98)){
			return message.reply({
				embeds: [new MessageEmbed()
				.setDescription(`Your **[Lvl ${lvl}] ${display}** feels an dark and mysterious power lurking ahead... They decide to retreat back to you....\n\n*You shudder as you feel a dark presence.... What could that be?*`)
				.setThumbnail(emojis[9])]
			})
		}
		let xpGained = Math.floor(intel * 2 * 120) * lvl * 2;
		let fxpGained = Math.floor(intel * 2 * 30) * lvl * 2;

		// TALISMAN XP BUFFS
		if(cst.includes(`TAMER_RELIC`)){
			fxpGained = Math.floor(intel * 2 * 50 ) * lvl * 2;
			xpGained = Math.floor(intel * 2 * 140) * lvl * 2;
		} else if(cst.includes(`TAMER_TALISMAN`)){
			fxpGained = Math.floor(intel * 2 * 40 ) * lvl * 2;
			xpGained = Math.floor(intel * 2 * 120) * lvl * 2;
		}
		let exp = xp + xpGained;

		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		await client.db.set("trainc" + message.author.id, (message.createdTimestamp + 15000) - client.config.epoch);
		let minhealth = Math.floor(lvl * 150 * 2  * 2)
		let maxhealth = Math.floor(lvl * 350 * 4 * 4)
		let bosshealth = Math.floor(minhealth + (Math.random() * (maxhealth - minhealth)))
		let nbh = bosshealth
		nbh = Number(nbh)
		let min_damage = Math.floor(str * 2 * 15) * lvl;
		let max_damage = Math.floor(str * 5 * 40) * lvl;
		let dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)))
		dmg = Number(dmg)
		let dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)
		let nen = en
		nen = Number(nen)

		let ranmob = [
			"Demon;https://i.gyazo.com/19562be0a75fb65b1912188e7fe52284.png",
			"Undead Skeleton;https://i.gyazo.com/4f201d2133b195976a8ab092de04075b.png",
			"Demon King;https://i.gyazo.com/f5ba70b244dbbff9e57e2ff329610e2a.png",
			"Slime;https://i.gyazo.com/ca27e452f0c1d1e426bfac99154ee80e.png",
			"Dragon;https://i.gyazo.com/4863c5d07f93d4074f6a9045a8d9a48b.png"
		]
		let cmob = ranmob[~~(Math.random() * ranmob.length)]
		cmob = cmob.split(`;`)
		await client.db.set(`petuse${message.author.id}`, (message.createdTimestamp + ms(`5m`)) - client.config.epoch)

		if(Math.random() * 500 > 499){
			if(!cst.includes(`TAMER_RELIC`)){
				cst.push(`TAMER_RELIC`)
				await client.db.set(`cst${message.author.id}`, cst.join(`;`))
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**MYTHICAL DROP!** (Chance: 1/500)
					
					${message.author.tag}'s **[LVL ${lvl}] ${display}** has discovered a refined ${client.config.emoji.TAMER_RELIC} on their adventure!
					`)
					.setFooter(`ITEM ID: TAMER_RELIC`)
					.setThumbnail(`https://i.gyazo.com/f4d6270e9e2b6cc3393a3a8b03b8d277.png`)]
				})
			} else {
				cst.push(`TAMER_RELIC`)
				await client.db.set(`cst${message.author.id}`, cst.join(`;`))
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**DUPLICATE MYTHICAL DROP!** (Chance: 1/500)
					
					${message.author.tag}'s **[LVL ${lvl}] ${display}** has discovered a refined ${client.config.emoji.TAMER_RELIC} on their adventure! ${message.author.tag} already has this talisman... so nothing changed!
					`)
					.setFooter(`ITEM ID: TAMER_RELIC`)
					.setThumbnail(`https://i.gyazo.com/f4d6270e9e2b6cc3393a3a8b03b8d277.png`)]
				})
			}
		}
		if(Math.random() * 300 > 299){
			if(!cst.includes(`TAMER_TALISMAN`)){
				cst.push(`TAMER_TALISMAN`)
				await client.db.set(`cst${message.author.id}`, cst.join(`;`))
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**RARE DROP!** (Chance: 1/???)
					
					${message.author.tag}'s **[LVL ${lvl}] ${display}** has discovered a ${client.config.emoji.TAMER_TALISMAN} on their adventure!
					`)
					.setFooter(`ITEM ID: TAMER_TALISMAN`)
					.setThumbnail(`https://i.gyazo.com/f4d6270e9e2b6cc3393a3a8b03b8d277.png`)]
				})
			} else {
				cst.push(`TAMER_TALISMAN`)
				await client.db.set(`cst${message.author.id}`, cst.join(`;`))
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**DUPLICATE RARE DROP!** (Chance: 1/250)
					
					${message.author.tag}'s **[LVL ${lvl}] ${display}** has discovered a(n) ${client.config.emoji.TAMER_TALISMAN} on their adventure! ${message.author.tag} already has this talisman... so nothing changed!
					`)
					.setFooter(`ITEM ID: TAMER_TALISMAN`)
					.setThumbnail(`https://i.gyazo.com/f4d6270e9e2b6cc3393a3a8b03b8d277.png`)]
				})
			}
		}
		await client.db.set(`cst${message.author.id}`, cst.join(`;`))
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** goes on an adventure and discovers a **${cmob[0]}** boss with ${emojis[0]} ${client.comma(bosshealth)}!`)
			.setThumbnail(cmob[1])]
		})
		await delay(3000)
		nen = nen - consume
		nbh = nbh - dmg
		let nhp = hp - dintake
		if(nbh < 0) { nbh = "0"}

		// WAIFU STAT SETS
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** consumes ${emojis[1]} ${consume} and slashes at the **${cmob[0]}** dealing ${emojis[0]} ${client.comma(dmg)} damage and recieves ${emojis[0]} ${client.comma(dintake)} damage...`)
			.addField(`Your ${display}'s Battle Stats`, `
			${emojis[0]} ${client.comma(nhp)}
			${emojis[1]} ${client.comma(nen)}
			`, true)
			.addField(`Enemy Stats`, `
			${emojis[0]} ${client.comma(nbh)}
			`, true)]
		})
		await delay(3000)
		if(nbh <= 0){
		await client.db.delete(`petuse${message.author.id}`)
			exp = xp + xpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				await client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(emojis[9])
				.setDescription(`The  **${cmob[0]}** lets out its final cries as **[LVL ${lvl}] ${display}** goes in for the kill gaining ${emojis[2]} ${client.comma(xpGained)} from the battle!`)
				.addField(`Your ${display}'s Battle Stats`, `
				${emojis[0]} ${client.comma(nhp)}
				${emojis[1]} ${client.comma(nen)}
				`, true)
				.addField(`Enemy Stats`, `
				${emojis[0]} ${client.comma(nbh)}
				`, true)]
			})
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
			
		}
		if(nhp < 1000){
			await client.db.delete(`petuse${message.author.id}`)
			exp = xp + fxpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				await client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** retreats from the fight as it's health is too low to continue. ${display} has gained **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the fight`)]
			})
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nbh <= 0){
			await client.db.delete(`petuse${message.author.id}`)
			exp = xp + fxpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				await client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** retreats from the fight as it's health is too low to continue. ${display} has gained **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the fight`)]
			}) 
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nen - consume < 0){
			await client.db.delete(`petuse${message.author.id}`)
			exp = xp + xpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				await client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** retreats from the fight as it's energy is too low to continue. ${display} has gained **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the fight`)]
			}) 
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}

		// BOSS FUNCTIONS 

		// Use this when the BOSS dies
		function BOSS_DEATH() {
			client.db.delete(`petuse${message.author.id}`)
			exp = xp + xpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(emojis[9])
				.setDescription(`The  **${cmob[0]}** lets out its final cries as **[LVL ${lvl}] ${display}** goes in for the kill gaining ${emojis[2]} ${client.comma(xpGained)} from the battle!`)
				.addField(`Your ${display}'s Battle Stats`, `
				${emojis[0]} ${client.comma(nhp)}
				${emojis[1]} ${client.comma(nen)}
				`, true)
				.addField(`Enemy Stats`, `
				${emojis[0]} ${client.comma(nbh)}
				`, true)]
			})
		}

		
		// use this function when the health is too low
		async function PLAYER_LOW_HEALTH(){
			client.db.delete(`petuse${message.author.id}`)
			exp = xp + fxpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** retreats from the fight as it's health is too low to continue. ${display} has gained **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the fight`)]
			}) 
		}
		async function PLAYER_NOT_ENOUGH_DAMAGE(){
			client.db.delete(`petuse${message.author.id}`)
			exp = xp + fxpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** fails to kill the **${cmob[0]}** and has to retreat due to the battlefield becoming too dangerous.... ${message.author.tag}'s **[LVL ${lvl}] ${display}** gains **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the failed battle`)]
			})
		}
		async function PLAYER_NOT_ENOUGH_ENERGY(){
			client.db.delete(`petuse${message.author.id}`)
			exp = xp + fxpGained;
			data[1] = nhp
			data[3] = exp;
			data[2] = nen
			if(cst.includes(`maxedwaifu`)){
				message.channel.send(`${client.config.emoji.err} Failed to bind data to pet${message.author.id} due to user having cst \`maxedwaifu\``)
			} else {
				client.db.set(`pet${message.author.id}`, data.join(`;`))
			}
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** does not have enough energy to continue the fight and has to retreat... ${message.author.tag}'s **[LVL ${lvl}] ${display} gains** **REDUCED EXPERIENCE** ${emojis[2]} ${client.comma(fxpGained)} from the failed battle`)]
			})
		}



		// NEXT FIGHT
		nen = nen - consume
		dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)))
		nbh = nbh - dmg
		nhp = nhp - dintake
		if(nbh < 0) { nbh = 0}
		dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)

		// WAIFU STAT SETS
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** consumes ${emojis[1]} ${consume} and lunges at the **${cmob[0]}** dealing ${emojis[0]} ${client.comma(dmg)} damage and recieves ${emojis[0]} ${client.comma(dintake)} damage...`)
			.addField(`Your ${display}'s Battle Stats`, `
			${emojis[0]} ${client.comma(nhp)}
			${emojis[1]} ${client.comma(nen)}
			`, true)
			.addField(`Enemy Stats`, `
			${emojis[0]} ${client.comma(nbh)}
			`, true)]
		})
		await delay(3000)
		if(nbh <= 0){
			BOSS_DEATH()

			// IF PLAYER HAS ITEM CANDYCORN_TALISMAN
			if(cst.includes(`CANDYCORN_TALISMAN`)){
				let bal = await client.db.get(`bal${message.author.id}`)
				let rng = Math.floor(Math.random() * 100)
				let coins = Math.floor(Math.random() * 250)
				if(rng > 75){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setTitle(`SUGAR RUSH`)
						.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** discovers that the ${cmob[0]} dropped ${client.config.emoji.coin} ${coins} when it was defeated!`)]
					})
				}
			}
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nhp < 1000){
			PLAYER_LOW_HEALTH()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nen - consume < 0){
			PLAYER_NOT_ENOUGH_ENERGY()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}

		nen = nen - consume
		dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)))
		nbh = nbh - dmg
		nhp = nhp - dintake
		if(nbh < 0) { nbh = "0"}
		dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)
		// WAIFU STAT SETS
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** consumes ${emojis[1]} ${consume} and tears at the **${cmob[0]}** dealing ${emojis[0]} ${client.comma(dmg)} damage and recieves ${emojis[0]} ${client.comma(dintake)} damage...`)
			.addField(`Your ${display}'s Battle Stats`, `
			${emojis[0]} ${client.comma(nhp)}
			${emojis[1]} ${client.comma(nen)}
			`, true)
			.addField(`Enemy Stats`, `
			${emojis[0]} ${client.comma(nbh)}
			`, true)]
		})
		await delay(3000)
		if(nbh <= 0){
			BOSS_DEATH()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nhp < 1000){
			PLAYER_LOW_HEALTH()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nen - consume < 0){
			PLAYER_NOT_ENOUGH_ENERGY()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}

		nen = nen - consume
		dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)))
		nbh = nbh - dmg
		nhp = nhp - dintake
		if(nbh < 0) { nbh = 0}
		dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)
				// WAIFU STAT SETS
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** consumes ${emojis[1]} ${consume} and slashes at the **${cmob[0]}** dealing ${emojis[0]} ${client.comma(dmg)} damage and recieves ${emojis[0]} ${client.comma(dintake)} damage...`)
			.addField(`Your ${display}'s Battle Stats`, `
			${emojis[0]} ${client.comma(nhp)}
			${emojis[1]} ${client.comma(nen)}
			`, true)
			.addField(`Enemy Stats`, `
			${emojis[0]} ${client.comma(nbh)}
			`, true)]
		})
		await delay(3000)
		if(nbh <= 0){
			BOSS_DEATH()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nhp < 1000){
			PLAYER_LOW_HEALTH()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		if(nen - consume < 0){
			PLAYER_NOT_ENOUGH_ENERGY()
			let levelups = 0;
			let loops = 0;
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (exp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}

		// Next Fight
		nen = nen - consume
		dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)))
		nbh = nbh - dmg
		nhp = nhp - dintake
		if(nbh < 0) { nbh = "0"}
		dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)
				// WAIFU STAT SETS
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setDescription(`${message.author.tag}'s **[LVL ${lvl}] ${display}** consumes ${emojis[1]} ${consume} and slashes at the **${cmob[0]}** dealing ${emojis[0]} ${client.comma(dmg)} damage and recieves ${emojis[0]} ${client.comma(dintake)} damage...`)
			.addField(`Your ${display}'s Battle Stats`, `
			${emojis[0]} ${client.comma(nhp)}
			${emojis[1]} ${client.comma(nen)}
			`, true)
			.addField(`Enemy Stats`, `
			${emojis[0]} ${client.comma(nbh)}
			`, true)]
		})
		let waiful;

		if(affec >= 1000){
			waiful = 5
			wllvl = "V"
		} else if(affec >= 800){
			waiful = 6
			wllvl = "IV"
		} else if(affec >= 600){
			waiful = 7
			wllvl = "III"
		} else if(affec >= 400){
			waiful = 8
			wllvl = "II"
		} else if(affec >= 200){
			waiful = 9
			wllvl = "I"
		} else {
			waiful = 10
			wllvl = "NULL"
		}
		if(Math.random() * 10 > waiful && nbh <= 0){
			await delay(3000)
			dmg = Math.trunc(min_damage + (Math.random() * (max_damage - min_damage)) * 2)
			nbh = nbh - dmg
			if(nbh < 0) { nbh = "0"}
			dintake = Math.trunc(Math.random() * lvl * 20 / endur * 6)
					// WAIFU STAT SETS
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(emojis[9])
				.setTitle(`BONUS STRIKE!`)
				.setDescription(`**[LVL ${lvl}] ${display}**'s affection lets them activate their **WAIFU'S LOYALTY ${wllvl}** ability dealing ${emojis[0]} ${client.comma(dmg)} (**DOUBLE DAMAGE**) to the **${cmob[0]}**`)
				.addField(`Your ${display}'s Battle Stats`, `
				${emojis[0]} ${client.comma(nhp)}
				${emojis[1]} ${client.comma(nen)}
				`, true)
				.addField(`Enemy Stats`, `
				${emojis[0]} ${client.comma(nbh)}
				`, true)]
			})
			await delay(3000)
			if(nbh <= 0){
				BOSS_DEATH()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (exp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
			if(nhp < 1000){
				PLAYER_LOW_HEALTH()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (xp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
			if(nbh > 0){
				PLAYER_NOT_ENOUGH_DAMAGE()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (exp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
		} else {
			await delay(3000)
			if(nbh <= 0){
				BOSS_DEATH()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (exp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
			if(nhp < 1000){
				PLAYER_LOW_HEALTH()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (exp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
			if(nbh > 0){
				PLAYER_NOT_ENOUGH_DAMAGE()
				let levelups = 0;
				let loops = 0;
				if (lvl >= 50) return;
				client.config.reqs.forEach((req) => {
					if (exp - req <= 0) {
						levelups = loops + 1 - lvl;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					await upgradePet();
				};
				return;
			}
		}
	},
};