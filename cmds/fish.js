const { MessageEmbed, Message } = require('discord.js');
const delay = require('delay');
const ms = require('ms');

module.exports = {
	name: 'fish',
	aliases: ['cast', 'fish'],
	description: 'Allows you to go fishing!',
	category: 'ecn',
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		let fishingCollection = await client.db.get(`fishingColl${message.author.id}`) || `0;0;100;f;0;0;100;f;0;0;100;f;0;0;100;f;0;0;100`
		fishingCollection = fishingCollection.split(`;f;`)

		let fishColl = fishingCollection[0]
		fishColl = fishColl.split(`;`)
		let dolphColl = fishingCollection[1]
		dolphColl = dolphColl.split(`;`)
		let sharkColl = fishingCollection[2]
		sharkColl = sharkColl.split(`;`)
		let pufferColl = fishingCollection[3]
		pufferColl = pufferColl.split(`;`)
		let tropicColl = fishingCollection[4]
		tropicColl = tropicColl.split(`;`)


		if(cst.includes(`fishrod`)){
			return message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`Legacy Items Detected!`)
				.setDescription(`Hello Legacy Adventurer!

				**NOTICE!** (Related Patch: __v0.6.0__)
				We detected that you currently have the item \`fishrod\` but was changed to ID:\`BASIC_FISHING_ROD\`
				
				**MIGRATION**
				Don't worry! All items can be migrated to the new system and be kept!
				Please execute \`${message.guild.prefix}migrate\` to migrate legacy items to the new system`)]
			})
		}
		let data = await client.db.get("pet" + message.author.id);
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

		if (!data) return message.reply({
			embeds: [new MessageEmbed()
			.setTitle(`Missing Waifu!`)
			.setThumbnail(client.config.emoji.pout)
			.setColor(client.config.colors.red)
			.setDescription(`I can't let you go fishing without a waifu! Tame one via \`${message.guild.prefix}tame\``)]
		})
		if(cst.includes(`maxedwaifu`)){
			data = client.config.maxedPet
		}
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
		data = await client.addGhostStats(message.author.id, data)
		data = data.split(`;`)
		let health = Number(data[1]);
		let affec = data[8];
		let energy = data[2];                         
		let level = Number(data[0]);
		let xp = Number(data[3]);
		let cred = Number(data[4]);
		let intel = Number(data[5]);
		let endur = data[6];
		let str = Number(data[7]);
		let dex = Number(data[9]);
		let nextLevel = client.config.reqs[level - 1] || "∞";

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
			.setDescription(`**WAIFU LEVELUP!** :tada:\n${message.author.tag}'s **[LEVEL ${data[0] - 1}] ${display}** has leveled up to **LEVEL ${data[0]}** and gained ${emojis[3]} 1`)]
		});
		if(cst.includes(`maxedwaifu`)){} else {
			await client.db.set(`pet${message.author.id}`, data.join(`;`))
		}
	}
		if(energy - 1 < 0){
			return message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`Low Energy!`)
				.setThumbnail(client.config.thumbnail.pout)
				.setDescription(`I can't let you take your **[Lvl ${level}] ${display}** out on an adventure since they dont have enough ${emojis[1]} Energy!\n\nLet your ${display} recover some ${emojis[1]} Energy then try again..`)]
			})
		}
		if(health < 100){
			return message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`Low Health!`)
				.setThumbnail(client.config.thumbnail.pout)
				.setDescription(`I can't let you take your **[Lvl ${level}] ${display}** out on an adventure since they dont have at least ${emojis[0]} 100 Health!\n\nLet your ${display} recover some ${emojis[0]} Health then try again..`)]
			})
		}
		if (!cst.includes("BASIC_FISHING_ROD")){
			return message.reply({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Equipment Missing!`)
				.setDescription(`Sorry, but I can't allow your **[Lvl ${level}] ${display}** to fish without at least a ${client.config.emoji.t1rod}!
				
				Purchase a basic rod from \`${message.guild.prefix}shop\``)
				.setThumbnail(client.config.thumbnail.mad)]
			})
		};
		let equipped = await client.db.get(`FISHING_ROD${message.author.id}`) || ""
		if(equipped == "WEEBCHANS_FISHING_ROD" && !cst.includes(`botdeveloper`)){
			return message.reply(`*A mysterious force prevents your **[Lvl ${level}] ${display}** from using Weebchan's Fishing Rod*`)
		}
		if(!equipped || equipped == "NONE"){
			return message.reply({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`No Rod Equipped!`)
				.setDescription(`Sorry, but it doesnt seem that your **[Lvl ${level}] ${display}** brought any rods with them to the docks
				
				Equip your rod with \`${message.guild.prefix}equip rod\``)
				.setThumbnail(client.config.thumbnail.mad)]
			})
		}
		try{
			const indx = Object.values(client.config.items).findIndex((c) => c.NAME == equipped)
			const vitem = Object.values(client.config.items)[indx];
			if(!vitem) throw(`ERROR_INVALID_ITEM`)
			if(vitem.HIDDEN == undefined){
			  vitem.HIDDEN == "false"
			}
			if(vitem.DISABLED == true){
				throw(`ERROR_DISABLED_ITEM`)
			}
		}catch(err){
			if(err == "ERROR_DISABLED_ITEM"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`An Error Occurred!`)
					.setDescription(`An error occurred whilst attempting to use your ${display}'s \`${equipped}\` since it's disabled!
					
					**ERROR:** ERROR_DISABLED_INVENTORY_ITEM`)
					.setThumbnail(client.config.thumbnail.pout)]
				})
			} else {
				return message.reply({
					embeds: [new MessageEmbed()
					.setTitle(`An Error Occurred!`)
					.setDescription(`An error occurred whilst attempting to determine your **[Lvl ${level}] ${display}**'s fishing rods statistics.
					
					**ERROR:** ERROR_INVALID_EQUIPPED_FISHING_ROD`)]
				})
			}
		}
		const indx = Object.values(client.config.items).findIndex((c) => c.NAME == equipped)
		const vitem = Object.values(client.config.items)[indx];
		let cd = await client.db.get("fishc" + message.author.id);
				cd = Number(cd);
		let scnd = client.cooldown(message.createdTimestamp, cd);
		if (scnd) {
			return message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`Cooldown!`)
				.setDescription(`I refuse to take you and your **[Lvl ${level}] ${display}** on another fishing trip! We just went! Ask me in about **${scnd}**`)
				.setThumbnail(client.config.thumbnail.cooldown)]
			});
		};
		if (health <= 100) {
			return message.channel.send(`Maybe bring your waifu out of a vegetable state and give it more than ${emojis[0]} **100**`)
		}
		const effect = await client.db.get(`fsheffect${message.author.id}`) || "NONE"
		let sts;
		if(equipped == "WEEBCHANS_FISHING_ROD"){
			// DEVELOPER FISHING ROD DOES NOT HAVE COOLDOWN
		} else {
			if(effect == "GOLDEN_WORM"){

			} else {
				sts = (message.createdTimestamp + ms(`${vitem.COOLDOWN}m`)) - client.config.epoch;
				if(cst.includes(`ARTIFACT_OF_TIME`)){
					let inventory = await client.getInventoryString(`${message.author.id}`)
					if(inventory.includes(`ARTIFACT_OF_TIME`)){
						sts = (message.createdTimestamp + ms(`${Math.trunc(vitem.COOLDOWN / 4 * 3)}m`)) - client.config.epoch;
					}
				}
				await client.db.set('fishc' + message.author.id, sts);
			}
		}

		const fishes = [
			':dolphin:',
			':shark:',
			':blowfish:',
			':tropical_fish:',
			':fish:',
		];
		const indxeff = Object.values(client.config.fisheffects).findIndex((c) => c.ID == effect)
        const eff = Object.values(client.config.fisheffects)[indxeff];
		if(eff.ID == "SEAFOAM_SOUP"){
			await client.db.delete(`fsheffect${message.author.id}`)
			let failc = Math.random() * 100

			if(failc <= 70){
				return message.reply({
					embeds: [new MessageEmbed()
					.setTitle(`Escaped Fish!`)
					.setThumbnail(client.config.thumbnail.fish)
					.setDescription(`After ${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and are brought back from the fishing trip with Weebchan, they ended up catching nothing.. better luck next time!`)
					.setThumbnail(client.config.thumbnail.pout)]
				});
			}
		}
		let chance = Math.random() * 100;
		if(cst.includes(`CHARM_OF_THE_DEEP`)){
			let inventory = await client.getInventoryString(`${message.author.id}`)
			if(inventory.includes(`CHARM_OF_THE_DEEP`)){
				chance = Math.trunc(Math.random() * (100 - 30) + 30);
			}
		}
		if(effect == "BLACK_ROCK"){
			if(chance < 57.5){
				chance = 57.5
				await client.db.delete(`fsheffect${message.author.id}`)
			}
		}
		if(effect == "BLACK_ROCK2"){
			if(chance >= 1){
				chance = 1
				await client.db.delete(`fsheffect${message.author.id}`)
			}
		}
		if(args[0] == `-r` && cst.includes(`botdeveloper`)){
			message.reply(`Ok ${message.author.username}, I'll give you a relic.. dont tell anyone!`)
			chance = 99.6
		}
		if(args[0] == `-c` && cst.includes(`botdeveloper`)){
			message.reply(`Ok ${message.author.username}, I'll give you a curse.. dont tell anyone!`)
			chance = 87
		}
		if(args[0] == `-rr` && cst.includes(`botdeveloper`)){
			message.reply(`Ok ${message.author.username}, I'll give you a rare reward.. dont tell anyone!`)
			chance = 57.7
		}


		if(args[0] == `-i` && cst.includes(`botdeveloper`)){
			message.reply(`Ok ${message.author.username}, I'll give you an item.. dont tell anyone!`)
			chance = 92.6
		}
		if(args[0] == `-t` && cst.includes(`botdeveloper`)){
			message.reply(`Ok ${message.author.username}, I'll give you an trash.. dont tell anyone! (Yikes!)`)
			chance = 1
		}
		await client.db.set(`petuse${message.author.id}`, (message.createdTimestamp + ms(`5m`)) - client.config.epoch)
		await client.db.set(`stn${message.author.id}`, 60000)
		await client.db.set(`stnb${message.author.id}`, "fishing")
		const msg = await message.reply({
			embeds: [new MessageEmbed()
			.setTitle(`Preparing Fishing Adventure...`)
			.setThumbnail(client.config.thumbnail.fish)
			.setDescription(`**${message.author.tag}** and their **[Lvl ${level}] ${display}** grab their ${vitem.EMOJI} using up ${emojis[1]} 1 waiting for for Weebchan...`)]
		})

		const Fish = Math.floor(Math.random() * fishes.length)
		const fish = fishes[Fish];
		let amtGained;
		if(fish == ":fish:"){
			amtGained = Math.floor(((Math.random() * str * 3 * 0.9) + (Math.random() * dex * 4 * 1.2)) * 0.7 * 1.1)
		} else if (fish == ":dolphin:"){
			amtGained = Math.floor(((Math.random() * str * 3 * 0.9) + (Math.random() * dex * 4 * 1.2)) * 0.7 * 1.1)
		} else if (fish == ":shark:"){
			amtGained = Math.floor(((Math.random() * str * 3 * 0.9) + (Math.random() * dex * 4 * 1.2)) * 0.7 * 1.1)
		} else if (fish == ":blowfish:"){
			amtGained = Math.floor(((Math.random() * str * 3 * 0.9) + (Math.random() * dex * 4 * 1.2)) * 0.7 * 1.1)
		} else if (fish == ":tropical_fish:"){
			amtGained = Math.floor(((Math.random() * str * 3 * 0.9) + (Math.random() * dex * 4 * 1.2)) * 0.7 * 1.1)
		}
		if(amtGained >= 15){
			amtGained = 12
		}
		data[2] = data[2] - 1
		let xpGained = Math.floor(intel * 2 * 1.1 * level * 0.7);
		let loot;
		await delay(3000)
		msg.edit({
			embeds: [new MessageEmbed()
			.setTitle(`Traveling to Fishing Spot...`)
			.setThumbnail(client.config.thumbnail.fish)
			.setDescription(`Weebchan takes ${message.author.tag} and **[Lvl ${level}] ${display}** to the best fishing spot...`)]
		})
		await delay(3000)
		msg.edit({
			embeds: [new MessageEmbed()
			.setTitle(`Fishing...`)
			.setThumbnail(client.config.thumbnail.fish)
			.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** equips their ${vitem.EMOJI} and starts fishing....`)]
		})
		await delay(3000)
		await client.db.delete(`petuse${message.author.id}`)
		if(chance >= 99.5){ // RELIC
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "RELIC")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			console.log(ritem.NAME)
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Isanely Rare Catch!`)
				.setColor(client.config.colors.relic)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and pulls up something **fabulous** from the depths of the sea!
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		} else if(chance >= 99){ // ARTIFACT
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "ARTIFACT")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Very Rare Catch!`)
				.setColor(client.config.colors.artifact)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and discovers an **artifact** from the depths below
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		} else if(chance >= 97.5){ // ITEM
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "ITEM")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`You found an item!`)
				.setColor(client.config.colors.item)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and pulls up something from the depths of the sea!
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		} else if(chance >= 86.5){ // NEGATIVE STATUS EFF
			var trashItems = Object.values(client.config.fisheffects).filter((c) => c.RARITY == "NEGATIVE")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			await REWARD_TYPE_EFFECT()
			if(ritem.ID == "POISONOUS_PUFFERFISH"){
				await client.stn(message.author.id, 10, client);
				await client.db.set('stnb' + message.author.id, "poisoned from a mysterious aquatic substance");
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Negative Effect Discovery`)
				.setColor(client.config.colors.negeffect)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and discovers a one time __negative__ effect for their next fishing trip... Yikes!

				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				
				**Effect Gained:**
				+ **${ritem.NAME}** (${ritem.USAGE})
				*${ritem.DESCRIPTION}*
				`)]
			})
			if(cst.includes(`HEALING_RING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`HEALING_RING`)){
					let chance = Math.floor(Math.random() * 100)
					if(chance > 50){
						if(ritem.NAME == `POISONOUS_PUFFERFISH`){
							await client.db.delete(`stn${message.author.id}`)
						}
						await client.db.delete(`fsheffect${message.author.id}`)
						let item = client.getItem(`HEALING_RING`)
						message.channel.send({
							embeds: [new MessageEmbed()
							.setTitle(`${display} Healed!`)
							.setColor(client.config.colors.green)
							.setDescription(`**[Lvl ${level}] ${display}**'s **${item.NAME_PROPER}** shines with a warm glow, and all negative effects have been washed away....`)]
						})
					}
				}
			}
		} else if(chance >= 72.5){ // POSITIVE STATUS EFFECT
			var trashItems = Object.values(client.config.fisheffects).filter((c) => c.RARITY == "POSITIVE")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			await REWARD_TYPE_EFFECT()
			if(ritem.ID == "GOLDEN_WORM"){
				await client.db.delete(`fsheffect${message.author.id}`)
				await client.db.delete(`fishc${message.author.id}`)
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Positive Effect Discovery`)
				.setColor(client.config.colors.poseffect)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and discovers a one time positive effect for their next fishing trip.
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}

				**Effect Gained:**
				+ **${ritem.NAME}** (${ritem.USAGE})
				*${ritem.DESCRIPTION}*
				`)]
			})
		} else if(chance >= 57.5){ // RARE
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "RARE")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			console.log(`[WEEBCHAN FISHING]: Stage INITIAL of RARE_FISHING_LOOT yields worth of ${ritem.WORTH}`)
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
					console.log(`[WEEBCHAN FISHING]: Stage FORTUNAS_BLESSING of REWARD_TYPE_MONEY yields worth of ${ritem.WORTH}`)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Rare Catch!`)
				.setColor(client.config.colors.rare)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and pulls up something from the depths of the sea!
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		} else if(chance >= 30){ // COMMON
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "COMMON")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			msg.edit({
			embeds: [new MessageEmbed()
				.setTitle(`Common Catch!`)
				.setColor(client.config.colors.common)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and pulls up something from the depths of the sea... this item again???
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		} else if(chance >= 0){
			var trashItems = Object.values(client.config.fishloot).filter((c) => c.RARITY == "TRASH")
			var ritem = trashItems[Math.floor(Math.random() * trashItems.length)]
			if(cst.includes(`RING_OF_TRANSFORMATION`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`RING_OF_TRANSFORMATION`)){
					ritem.WORTH = Math.trunc(Math.random() * (6 - 1) + 1)
				}
			}
			if(cst.includes(`FORTUNAS_BLESSING`)){
				let inventory = await client.getInventoryString(`${message.author.id}`)
				if(inventory.includes(`FORTUNAS_BLESSING`)){
					ritem.WORTH = Math.trunc(Number(ritem.WORTH) * 1.5)
				}
			}
			if(ritem.TYPE == "INSTANT_MONEY"){
				await REWARD_TYPE_MONEY()
			} else {
				await REWARD_TYPE_ITEM()
			}
			msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`Garbge Catch...`)
				.setThumbnail(client.config.thumbnail.fish)
				.setDescription(`${message.author.tag}'s **[Lvl ${level}] ${display}** packs up their ${vitem.EMOJI} and pulls a disappointment from the sea
				
				+ ${emojis[2]} ${client.comma(xpGained)} Waifu Experience
				+ ${fish} x${amtGained}
				+ **${ritem.NAME}** ${Number(ritem.WORTH) > 0 ? `[Worth: ${client.config.emoji.coin} ${client.comma(ritem.WORTH)}]` : ``}
				*${ritem.DESCRIPTION}*${cst.includes(ritem.ID) ? `\n\n:warning: **DUPLICATE ITEM**: You got a duplicate item, so nothing was given...` : ``}

				**Effect:**
				- ${eff.NAME} "*${eff.DESCRIPTION}*"
				`)]
			})
		}
		async function REWARD_TYPE_ITEM() {
			await client.db.delete(`fsheffect${message.author.id}`)
			await client.db.delete("stn" + message.author.id);
			await client.db.delete("stnb" + message.author.id);
			await client.db.delete(`petuse${message.author.id}`)
			
			let f = await client.db.get(`fsh${message.author.id}`) || "0;0;0;0;0;0";
			f = f.split(";"); 
			f[Fish] = Number(f[Fish]) + amtGained;
			await client.db.set(`fsh${message.author.id}`, f.join(";"));
			data[3] = xp + xpGained
			if(!cst.includes(`maxedwaifu`)){ 
				data = data.join(`;`)
				data = await client.delGhostStats(message.author.id, data)
				data[2] = data[2] - 1
				await client.db.set(`pet${message.author.id}`, data)}
			if(!cst.includes(ritem.PERMISSION)){
				cst.push(ritem.PERMISSION)
				await client.db.set(`cst${message.author.id}`, cst.join(`;`))
			}
			if (level >= 50) return;
			let levelups = 0;
			let loops = 0;
			client.config.reqs.forEach((req) => {
				if (xp - req <= 0) {
					levelups = loops + 1 - level;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		async function REWARD_TYPE_MONEY() {
			await client.db.delete(`fsheffect${message.author.id}`)
			let bal = await client.db.get('bal' + message.author.id);
			bal = Number(bal)
			let nbal;
			let itemworth = ritem.WORTH
			itemworth = Number(ritem.WORTH)
			console.log(`[WEEBCHAN FISHING]: Stage INITIAL of REWARD_TYPE_MONEY yields worth of ${ritem.WORTH}`)
			let inventory = await client.getInventoryString(`${message.author.id}`)
			if(eff.ID == "LUCKY_CHARM" && !inventory.includes(`FORTUNAS_BLESSING`)){
				itemworth = Number(ritem.WORTH) * 2
				console.log(`[WEEBCHAN FISHING]: Stage LUCKY_CHARM of REWARD_TYPE_MONEY yields worth of ${itemworth}`)
			}
			ritem.WORTH = itemworth
			nbal = bal + itemworth
			let f = await client.db.get(`fsh${message.author.id}`) || "0;0;0;0;0;0";
			f = f.split(";");
			f[Fish] = Number(f[Fish]) + amtGained;
			await client.db.set(`fsh${message.author.id}`, f.join(";"));
			if(ritem.WORTH >= 200_000 || itemworth >= 200_000){
				message.channel.send({ embeds: [new MessageEmbed().setTitle(`Game Master Interference!`).setDescription(`**[GM] SemiMute:** Weebchan tried to give you WAY above the normal amount for that items worth, so I had to stop her! Unfortunately, nothing was added to your account this trip. Sorry!`)]})
				return;
			}
			const channel = client.channels.cache.get(client.config.channels.transactions);
			channel.send(`[**FISHING**] **(${message.author.tag}) [${message.author.id}]**: Gained < + ${client.config.emoji.coin} ${itemworth}  & ${fish} ${amtGained} >  [BALANCE CHANGES: (NEW) ${client.config.emoji.coin} ${client.comma(nbal)} | (OLD) ${client.config.emoji.coin} ${client.comma(bal)}]`)
			await client.db.set(`bal${message.author.id}`, nbal)
			await client.db.delete("stn" + message.author.id);
			await client.db.delete("stnb" + message.author.id);
			await client.db.delete(`petuse${message.author.id}`)
			data[3] = xp + xpGained
			if(!cst.includes(`maxedwaifu`)){ 
				data = data.join(`;`)
				data = await client.delGhostStats(message.author.id, data)
				data[2] = data[2] - 1
				await client.db.set(`pet${message.author.id}`, data)}
			if (level >= 50) return;
			let levelups = 0;
			let loops = 0;
			client.config.reqs.forEach((req) => {
				if (xp - req <= 0) {
					levelups = loops + 1 - level;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		async function REWARD_TYPE_EFFECT() {
			let f = await client.db.get(`fsh${message.author.id}`) || "0;0;0;0;0;0";
			f = f.split(";"); 
			f[Fish] = Number(f[Fish]) + amtGained;
			await client.db.set(`fsh${message.author.id}`, f.join(";"));
			await client.db.delete("stn" + message.author.id);
			await client.db.delete("stnb" + message.author.id);
			await client.db.delete(`petuse${message.author.id}`)
			data[3] = xp + xpGained
			if(!cst.includes(`maxedwaifu`)){ 
				data = data.join(`;`)
				data = await client.delGhostStats(message.author.id, data)
				data[2] = data[2] - 1
				await client.db.set(`pet${message.author.id}`, data)}
			if(ritem.ID == "GOLDEN_WORM"){
			} else if(ritem.ID == "POISONOUS_PUFFERFISH"){
			} else {
				await client.db.set(`fsheffect${message.author.id}`, ritem.ID)
			}
			if (level >= 50) return;
			let levelups = 0;
			let loops = 0;
			client.config.reqs.forEach((req) => {
				if (xp - req <= 0) {
					levelups = loops + 1 - level;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
			return;
		}
		return;
	},
}
// fuck you ous, aint getting shitty jokes from me