const { MessageEmbed, escapeMarkdown, MessageSelectMenu, MessageActionRow, DiscordAPIError} = require("discord.js");
const ms = require('ms');
const delay = require('delay');

module.exports = {
	name: "equip",
	"aliases": ['equip', 'eq'],
	description: 'Equip your waifu with different items',
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		let cd = await client.db.get(`equipc${message.author.id}`)
		const cooldown = client.cooldown(message.createdTimestamp, cd);
		if (cooldown) {
			return message.reply({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Cooldown!`)
				.setThumbnail(client.config.thumbnail.error)
				.setDescription(`I can't let you equip another item quite yet!

				Try again in **${cooldown}**!`)]
			});
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

		async function COOLDOWN() {
			await client.db.set(`equipc${message.author.id}`, (message.createdTimestamp + ms(`16s`)) - client.config.epoch)
		}
		if (!data) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Missing Waifu!`)
			.setThumbnail(client.config.emoji.pout)
			.setDescription(`I can't let you equip items on your waifu if you dont have one tamed! Tame one via \`${message.guild.prefix}tame\``)
			.setThumbnail(client.config.thumbnail.pout)]
		})

		if(!args.length){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`Invalid Gear Type`)
				.setDescription(`I can't equip any items on your ${display} if you do not tell me what type of item you want to equip!\n\n**Valid Types:**\n\`wings\`, \`necklace\`, \`bracelet\`, \`ring\`, \`talisman\`, \`weapon\`, \`rod\`, \`pick\`, \`collect\``)
				.setThumbnail(client.config.thumbnail.mad)]
			})
		}
		let arg = args[0].toLowerCase()
		if(arg == "wings"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "WINGS")
			let menuarr = []
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						DESCRIPTION: `${i.DESCRIPTION}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s wings`
			})
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`WingsSelect`)
						.setPlaceholder(`Please select some wings!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select some Wings!`)
				.setDescription(`Click the interaction menu I have provided to select some wings to equip your ${display} with!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const vitem = await client.getItem(`${interaction.values}`)
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					await client.db.set(`WINGS${interaction.user.id}`, vitem.NAME)
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Wings Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped your ${display}'s Wings!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Wings Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s Wings!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "necklace"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "NECKLACE")
			let menuarr = []
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						DESCRIPTION: `${i.DESCRIPTION}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s necklace`
			})
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`NecklaceSelect`)
						.setPlaceholder(`Please select a necklace!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									emoji: item.EMOJI,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Necklace!`)
				.setDescription(`Click the interaction menu I have provided to select one of your necklaces to equip your ${display} with!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const indx = Object.values(client.config.items).findIndex((c) => c.NAME == interaction.values)
					const vitem = Object.values(client.config.items)[indx];
					
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					await client.db.set(`NECKLACE${interaction.user.id}`, vitem.NAME)
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Necklace Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped your ${display}'s Necklace!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Necklace Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.EMOJI} ${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s Necklace!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "bracelet"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "BRACELET")
			let menuarr = []
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						DESCRIPTION: `${i.RARITY}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s bracelet`
			})
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`BraceletSelect`)
						.setPlaceholder(`Please select a bracelet!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									emoji: item.EMOJI,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Bracelet!`)
				.setDescription(`Click the interaction menu I have provided to select one of your bracelets to equip your ${display} with!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const indx = Object.values(client.config.items).findIndex((c) => c.NAME == interaction.values)
					const vitem = Object.values(client.config.items)[indx];
					
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					await client.db.set(`BRACELET${interaction.user.id}`, vitem.NAME)
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Bracelet Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped your ${display}'s Bracelet!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Bracelet Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.EMOJI} ${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s Bracelet!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "ring"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "RING")
			let menuarr = []
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						EMOJI: `${i.EMOJI}`,
						DESCRIPTION: `${i.DESCRIPTION}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s ring`
			})
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`RingSelect`)
						.setPlaceholder(`Please select a ring!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Ring!`)
				.setDescription(`Click the interaction menu I have provided to select one of your rings to equip your ${display} with!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const indx = Object.values(client.config.items).findIndex((c) => c.NAME == interaction.values)
					const vitem = Object.values(client.config.items)[indx];
					
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					await client.db.set(`RING${interaction.user.id}`, vitem.NAME)
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Ring Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped your ${display}'s Ring!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Ring Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.EMOJI} ${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s Ring!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "talisman" || arg == "tali"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "TALISMAN")
			let menuarr = []
			let talisman = await client.db.get(`TALISMAN${message.author.id}`) || "NONE;NONE;NONE;NONE;NONE"
			talisman = talisman.split(`;`)
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						DESCRIPTION: `${i.RARITY}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s talisman slot #${args[1]}`
			})
			if(!args[1] || isNaN(args[1]) || isNaN(args[1]) > 5){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(client.config.colors.red)
					.setTitle(`Invalid Slot!`)
					.setDescription(`You must provide what slot you want to equip your talisman to!\n\n**Valid Slots:** 1 to 5`)
					.setThumbnail(client.config.thumbnail.question)]
				})
			}
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`TaliSelect`)
						.setPlaceholder(`Please select a talisman!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Talisman!`)
				.setDescription(`Click the interaction menu I have provided to equip a talisman to your ${display}'s #${args[1]} Slot!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const vitem = await client.getItem(`${interaction.values}`)
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					if(talisman.includes(vitem.NAME) && vitem.NAME !== "NONE"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because you already have it equipped in one of your slots!`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					let tali;
					if(args[1] == 1){
						tali = talisman[0]
					} else if(args[1] == 2){
						tali = talisman[1]
					} else if(args[1] == 3){
						tali = talisman[2]
					} else if(args[1] == 4){
						tali = talisman[3]
					} else if(args[1] == 5){
						tali = talisman[4]
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					if(args[1] == 1){
						talisman[0] = interaction.values
					} else if(args[1] == 2){
						talisman[1] = interaction.values
					} else if(args[1] == 3){
						talisman[2] = interaction.values
					} else if(args[1] == 4){
						talisman[3] = interaction.values
					} else if(args[1] == 5){
						talisman[4] = interaction.values
					}
					await client.db.set(`TALISMAN${interaction.user.id}`, talisman.join(`;`))
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Talisman Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped talisman **Slot #${args[1]}** from your ${display}!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Talisman Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s talisman slot #${args[1]}!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "pick"){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Unable to equip!`)
				.setDescription(`Your **${display}** has not learned how properly equip their pickaxe... Come back later!`)
				.setThumbnail(client.config.thumbnail.pout)]
			})
		}
		if(arg == "wand"){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Equipping Process Failed!`)
				.setDescription(`*As you try to equip a magical item, an ancient being whispers in your mind...*
				
				\`\`\`ℸ ̣ ⍑𝙹ᓭᒷ ∴⍑𝙹 ⍑𝙹ꖎ↸ ℸ ̣ ⍑ᒷ !¡𝙹∴ᒷ∷ 𝙹⎓ ℸ ̣ ⍑ᒷ ᒲ╎リ↸, ᒲᔑ|| ⎓ᔑꖎꖎ ℸ ̣ 𝙹 ℸ ̣ ⍑ᒷ ᒷリ↸ꖎᒷᓭᓭ ᔑʖ||ᓭᓭ\`\`\`
				
				Maybe you arn't ready for the world of magic yet...`)
				.setThumbnail(client.config.thumbnail.pout)]
			})
		}
		if(arg == "weapon"){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Unable to equip!`)
				.setDescription(`Hmm.. weird... there dont seem to be any weapons in existence to equip....`)
				.setThumbnail(client.config.thumbnail.pout)]
			})
		}
		if(arg == "rod"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "FISHING_ROD")
			let menuarr = []
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						EMOJI: `${i.EMOJI}`,
						DESCRIPTION: `${i.DESCRIPTION}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s fishing rod`
			})
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`RodSelect`)
						.setPlaceholder(`Please select a rod!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									emoji: item.EMOJI,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Rod!`)
				.setDescription(`Click the interaction menu I have provided to select one of your rods to equip your ${display} with!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const indx = Object.values(client.config.items).findIndex((c) => c.NAME == interaction.values)
					const vitem = Object.values(client.config.items)[indx];
					
					if(!cst.includes(`administrator132465798`) && vitem.RARITY == "SPECIAL"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it has a rarity of **SPECIAL** and you do not have the \`administrator132465798\` cst!`)
							.setThumbnail(client.config.thumbnail.mad)], components: []
						})
						return;
					}
					if(vitem.DISABLED == "true"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because it is currently disabled! Please equip a different item for the meantime...`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					try {
						let power = await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)
						power = Number(power)
						if(power > 100){
							throw(`[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100`)
						}
					} catch(e) {
						if(e == "[WEEBCHAN]: Waifu stat POWER_LEVEL may not exceed 100"){
							return interaction.update({
								embeds: [new MessageEmbed()
								.setTitle(`Equipping Failed!`)
								.setDescription(`You may not equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) since your ${display}'s :zap: **Power Level** would become :zap: **${await client.getNewPowerLevel(tali, vitem.NAME, message.author.id)}** and may not exceed :zap: **100**`)], components: []
							})
						}
					}
					await client.db.set(`FISHING_ROD${interaction.user.id}`, vitem.NAME)
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Fishing Rod Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped your ${display}'s Fishing Rod!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Fishing Rod Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.EMOJI} ${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your ${display}'s Fishing Rod!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
		if(arg == "collectibles" || arg == "collect"){
			const vindx = Object.values(client.config.items).filter((c) => c.TYPE == "SPECIAL")
			let menuarr = []
			let collectables = await client.db.get(`COLLECTIBLES${message.author.id}`) || "NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE"
			collectables = collectables.split(`;`)
			for(const i of vindx){
				if(cst.includes(i.NAME)){
					menuarr.push({
						NAME: `${i.NAME}`,
						NAME_PROPER: `${i.NAME_PROPER}`,
						DESCRIPTION: `${i.RARITY}`
					})
				}
			}
			menuarr.push({
				NAME: `NONE`,
				NAME_PROPER: `NONE`,
				DESCRIPTION: `Unequip your ${display}'s collectible slot #${args[1]}`
			})
			if(!args[1] || isNaN(args[1]) || isNaN(args[1]) > 5){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(client.config.colors.red)
					.setTitle(`Invalid Slot!`)
					.setDescription(`You must provide what slot you want to equip your collectible to!\n\n**Valid Slots:** 1 to 10`)
					.setThumbnail(client.config.thumbnail.question)]
				})
			}
				const components = (state) => [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
						.setCustomId(`CollectSelect`)
						.setPlaceholder(`Please select a collictable!`)
						.addOptions(
							menuarr.map((item) => {
								return {
									label: item.NAME_PROPER,
									value: item.NAME,
									description: item.DESCRIPTION,
								}
							})
						)
					)
				]
				await COOLDOWN()
				const embed = new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Select a Collectible!`)
				.setDescription(`Click the interaction menu I have provided to equip a collectible to your #${args[1]} Slot!`)
				.setThumbnail(client.config.thumbnail.question)

				const msg = await message.channel.send({
					embeds: [embed],
					components: components(false),
				})
				const filter = (interaction) => interaction.user.id === message.author.id;

				const collector = message.channel.createMessageComponentCollector({
					filter,
					componentType: "SELECT_MENU",
					time: 15000,
				})
				collector.on(`collect`, async (interaction) => {
					const vitem = await client.getItem(`${interaction.values}`)
					if(collectables.includes(vitem.NAME) && vitem.NAME !== "NONE"){
						interaction.update({
							embeds: [new MessageEmbed()
							.setTitle(`Equipping Failed!`)
							.setColor(client.config.colors.red)
							.setDescription(`Unable to equip **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) because you already have it equipped in one of your slots!`)
							.setThumbnail(client.config.thumbnail.error)], components: []
						})
						return;
					}
					let tali;
					if(args[1] == 1){
						tali = collectables[0]
					} else if(args[1] == 2){
						tali = collectables[1]
					} else if(args[1] == 3){
						tali = collectables[2]
					} else if(args[1] == 4){
						tali = collectables[3]
					} else if(args[1] == 5){
						tali = collectables[4]
					} else if(args[1] == 6){
						tali = collectables[5]
					} else if(args[1] == 7){
						tali = collectables[6]
					} else if(args[1] == 8){
						tali = collectables[7]
					} else if(args[1] == 9){
						tali = collectables[9]
					} else if(args[1] == 10){
						tali = collectables[9]
					}
					
					if(args[1] == 1){
						collectables[0] = interaction.values
					} else if(args[1] == 2){
						collectables[1] = interaction.values
					} else if(args[1] == 3){
						collectables[2] = interaction.values
					} else if(args[1] == 4){
						collectables[3] = interaction.values
					} else if(args[1] == 5){
						collectables[4] = interaction.values
					} else if(args[1] == 6){
						collectables[5] = interaction.values
					} else if(args[1] == 7){
						collectables[6] = interaction.values
					} else if(args[1] == 8){
						collectables[7] = interaction.values
					} else if(args[1] == 9){
						collectables[8] = interaction.values
					} else if(args[1] == 10){
						collectables[9] = interaction.values
					}
					await client.db.set(`COLLECTIBLES${interaction.user.id}`, collectables.join(`;`))
					if(interaction.values == "NONE"){
						const newEM = new MessageEmbed()
						.setTitle(`Collectible Unequipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully unequipped collectible **Slot #${args[1]}**!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					} else {
						const newEM = new MessageEmbed()
						.setTitle(`Collectible Equipped!`)
						.setColor(client.config.colors.green)
						.setDescription(`Successfully equipped **${vitem.NAME_PROPER}** (\`${vitem.NAME}\`) as your collectible slot #${args[1]}!`)
						.setThumbnail(client.config.thumbnail.thumbsup)
						interaction.update({ embeds: [newEM], components: []})
						return;
					}
				})
			return;
		}
	}
}