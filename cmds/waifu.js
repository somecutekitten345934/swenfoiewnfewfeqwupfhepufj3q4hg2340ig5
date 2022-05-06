const delay = require('delay');
const { MessageEmbed, Message } = require('discord.js');
const ms = require(`ms`)

module.exports = {
	name: 'waifu',
	aliases: ['waifu'],
	category: 'pet',
	description: "View your waifu's stats",
    async run(client, message, args) {
		async function Embed(id, tag, bot = false) {
			let data = await client.db.get('pet' + id);
			let petalias = await client.db.get(`petalias${id}`) || ""
			if (bot == true) {
				data = "9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999";			};
			if (!data) {
				return message.channel.send(`${message.author.id == id ? `You don't own a waifu!` : `${tag} does not own a waifu!`} Why not tame one by using \`${message.guild.prefix}tame\``)
			};
			const currAlias = await client.db.get("curralias" + id) || "default";
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
			let pn = await client.db.get(`petname${id}`) || display;
			display = pn;
			let cst = await client.db.get(`cst${id}`) || ""
			cst = cst.split(`;`)

			let bonus = await client.getBonusStats(`${id}`)
			bonus = bonus.split(`;`)
			let INTELB = Number(bonus[0])
			let ENDURB = Number(bonus[1])
			let STRB = Number(bonus[2])
			let AFFECB = Number(bonus[3])
			let DEXB = Number(bonus[4])

			let sleepstat;
			let sleeptime;

			let mcst = await client.db.get(`cst${message.author.id}`) || "";
			mcst = mcst.split(`;`)
			const vtime = await client.db.get(`waifusleep${id}`)
			const startTime = await client.db.get(`waifusleep${id}`) || `${Date.now()}`
			let time = Date.now() - startTime

			if(cst.includes(`waifusleep`)){
				sleepstat = `${client.config.emoji.sleep} Sleeping for.. **${ms(time, { long: true})}**`
			} else {
				sleepstat = `${display} is currently awake!`
			}

			let ncst = await client.db.get(`cst${message.author.id}`) || "";
			if(ncst.startsWith(`;`)){
				var ccst = ncst.substring(1);
				await client.db.set(`cst${message.author.id}`, ccst)
				return message.channel.send(`${client.config.emoji.err} Sorry, but it seems your CST data was incorrectly formatted, so we corrected it for you! Try the command again.`)
			}

			let npet = await client.db.get(`petaliases${message.author.id}`) || "";
			if(npet.startsWith(`;`)){
				var nnpet = npet.substring(1);
				await client.db.set(`petaliases${message.author.id}`, nnpet)
				return message.channel.send(`${client.config.emoji.err} Sorry, but it seems your waifu alias data was incorrectly formatted, so we corrected it for you! Try the command again.`)
			}

			if(cst.includes(`maxedwaifu`)){
				data = client.config.maxedPet
			}
			
			data = data.split(";");
			if (data.length < 9) return message.channel.send("Your waifu's data must be at least 9 elements long. To fix this, please contact `" + client.users.cache.get(client.config.owner).tag + "`.");
			"level;health;energy;exp;credits;intel;endur;str;affec;glycogenesis"
			let health = data[1];
		    let affec = data[8];
			let energy = data[2];                                     
			let level = Number(data[0]);
			let xp = data[3];
			let cred = data[4];
			let intel = data[5];
			let endur = data[6];
			let str = data[7];
			let dex = data[9];
			let nextLevel = client.config.reqs[level - 1] || "∞";
            let desc = await client.db.get(`petdesc${id}`) || `Your waifu can have a description! Set it via \`${message.guild.prefix}waifu desc\``

			// ANTI HYPER LINKS
			if(desc.includes(`[`) || desc.includes(`]`) || desc.includes(`(`) || desc.includes(`)`)){
				message.channel.send({ embeds: [new MessageEmbed().setTitle(`Illegal Characters!`).setDescription(`This ${display}'s description contains illegal characters, so it has been wiped! Sorry!`)]})
				desc = "Weebchan has wiped this bio due to illegal characters!"
				await client.db.delete(`petdesc${id}`)
			}

			if(args[0] == "sleep" || args[0] == "nap"){
				if(!cst.includes(`waifusleep`)){
					let startTime = Date.now();
					await client.db.set(`waifusleep${message.author.id}`, startTime)
					mcst.push(`waifusleep`)
					if(mcst.includes(`dfnd`)){
						mcst = mcst.filter(x => !["dfnd"].includes(x));
						await client.db.set(`cst${message.author.id}`, mcst.join(`;`))
						message.channel.send({
							embeds: [new MessageEmbed()
							.setDescription(`${client.config.emoji.sleep} **[LVL ${level}] ${display}** goes up to ${message.author.tag} and lays down... drifting into deep sleep and is no longer on guard for any monster attacks!
							
							**SLEEPING INFORMATION**
							:white_small_square: ${display} will no longer be able to do activities!
							:white_small_square: ${display} will recover lost ${emojis[0]} & ${emojis[1]} every hour
							:white_small_square: ${display}'s protection will be disabled whilst sleeping`)]
						})
					} else {
						await client.db.set(`cst${message.author.id}`, mcst.join(`;`))
						message.channel.send({
							embeds: [new MessageEmbed()
							.setDescription(`${client.config.emoji.sleep} **[LVL ${level}] ${display}** goes up to ${message.author.tag} and lays down... drifting into deep sleep!\n\n**SLEEPING INFORMATION**\n:white_small_square: ${display} will no longer be able to do activities!\n:white_small_square: ${display} will recover lost ${emojis[0]} & ${emojis[1]} every hour\n:white_small_square: ${display}'s protection will be disabled whilst sleeping`)]
						})
					}
					return;
				} else if(cst.includes(`waifusleep`)){
					let dpill2;
					let startTime = await client.db.get(`waifusleep${message.author.id}`) || "0"
					let time = Date.now() - startTime
					if(cst.includes(`dreamcatcher`)){
						time = time * 2
						mcst = mcst.filter(x => !["dreamcatcher"].includes(x));
						dpill2 = "yeet"
					}
					let timed = Math.trunc(time / 3600000)
					mcst = mcst.filter(x => !["waifusleep"].includes(x));
					await client.db.delete(`waifusleep${message.author.id}`)
					await client.db.set(`cst${message.author.id}`, mcst.join(`;`))
					let dpill = `:white_small_square: ${display} was not fed a ${client.config.emoji.DREAM_CATCHER_POTION}!`
					if(dpill2 == "yeet"){
						dpill = `:white_small_square: ${display} had a ${client.config.emoji.DREAM_CATCHER_POTION} active so the effectiveness of sleep was doubled!!`
					}
					if(time < 3600000){
						return message.channel.send({
							embeds: [new MessageEmbed()
							.setDescription(`${client.config.emoji.sleep} *YAWN* ${message.author.tag} wakes up their **[LVL ${level}] ${display}** from their deep sleep and did not gain any multipliers!
							
							**WARNING:** 
							Your ${display} was woken too early and has not recovered any ${emojis[0]} or ${emojis[1]}. Let them sleep for at least an hour!

							**SLEEPING SUMMARY**
							:white_small_square: ${display} slept for a total of ${ms(time, { long: true})}
							:white_small_square: ${display}'s protection can now be activated
							:white_small_square: ${display} can now do activities once again
							${dpill}
							`)]
						})
					}
					let rhp = timed * 2000
					if(rhp > 10000){
						rhp = 10000
					}
					let ren = timed * 20
					if(ren > 100){
						ren = 100
					}
					let nhp = health + rhp
					if(nhp > 10000){
						nhp = 10000
					}
					let nen = energy + ren
					if(nen > 100){
						nen = 100
					}
					data[1] = Math.trunc(nhp)
					data[2] = Math.trunc(nen)
					await client.db.set(`pet${message.author.id}`, data.join(`;`))
					message.channel.send({
						embeds: [new MessageEmbed()
						.setDescription(`${client.config.emoji.sleep} *YAWN* ${message.author.tag} wakes up their **[LVL ${level}] ${display}** from their deep sleep gaining a x${timed} multiplier!
						
						**SLEEPING SUMMARY**
						:white_small_square: ${display} slept for a total of ${ms(time, { long: true})}
						:white_small_square: ${display} has recovered ${emojis[0]} ${client.comma(Math.trunc(rhp))} & ${emojis[1]} ${client.comma(Math.trunc(ren))}
						:white_small_square: ${display}'s protection can now be activated
						:white_small_square: ${display} can now do activities once again
						`)]
					})
					return;

				}
			}
			if(args[0] == "ability"){
				let midas;
				if(cst.includes(`KING_MIDAS_RING`)){
					midas = "**UNLOCKED**"
				} else {
					midas = "**REQUIRES KING MIDAS'S RING**"
				}
				let waiful;
				if(affec >= 1000){
					waiful = "V;50% (MAX)"
				} else if(affec >= 800){
					waiful = "IV;40%"
				} else if(affec >= 600){
					waiful = "III;30%"
				} else if(affec >= 400){
					waiful = "II;20%"
				} else if(affec >= 200){
					waiful = "I;10%"
				} else {
					waiful = "NOT UNLOCKED;0%"
				}
				waiful = waiful.split(`;`)
				let inv = await client.getInventoryString(`${usr.id}`)
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`${display}'s Abilities`)
					.setDescription(`
					Abilities have a chance to activate during certain waifu related events and actions

					:white_small_square: [R] **Waifu's Loyalty** [I-V] (CURRENT: **TIER: ${waiful[0]}**) 
					Gives your waifu a **${waiful[1]}** chance to bonus strike a boss during boss fights. Each tier is based off your **AFFECTION STAT** ${level >= 25 ? `\n\n:white_small_square: [R] **Waifu's Last Stand** [I]\nSaves your waifu from near death, but depletes all remaining energy. Requires at least ${emojis[1]} 30 to activate` : ``} ${inv.includes(`SOLOMONS_GATE_FRAGMENT`) ? `\n\n:white_small_square: **Spectral Dragon** [I-III] (CURRENT: UNKNOWN)\nSummons a spectral dragon to join your fight against high level enemies.\nDoes **NOT** stack with Waifu's Loyalty` : ``}
					`)]
				})
			}
			if(args[0] == "desc"){
				let ndesc = args.slice(1).join(' ');
				ndesc = ndesc.slice(0, 250)
			if(!args[1]){
				return message.reply(`I don't think your ${display} would be pleased with that description.. Maybe actually put something!`)
			}
				await client.db.set(`petdesc${message.author.id}`, ndesc)
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.tick} ${message.author.tag} has set their ${display}'s description as:\n "${ndesc}"`)]
				})
			}
			if(args[0] == "shop"){
				let bal = await client.db.get(`bal${message.author.id}`)
				return message.channel.send({
            embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`Shop - ${message.author.tag}`)
				.setDescription(`Current Balance - ${client.config.emoji.coin} ${client.comma(bal)}\n\n`)
				.addField(`Potions`, 
				`
[501] ${client.config.emoji.chill} - 1x Potion of Darkness - Max Energy Recovery \`${message.guild.prefix}feed dark\`; costs ${client.config.emoji.coin} 1,000 ea
[701] ${client.config.emoji.pmystery} - 1x Potion of Mystery - What will you get this time?\`${message.guild.prefix}feed mystery\` costs ${client.config.emoji.coin} 5,000 ea
[702] ${client.config.emoji.DREAM_CATCHER_POTION} - Dream Catcher Potion - x2 Sleep timer multiplier; \`${message.guild.prefix}feed dream\` costs ${client.config.emoji.coin} 5,000 ea
				`)
				.addField(`Recovery Potions`,
				`
[801] ${client.config.emoji.lhealth} - 1x Lesser Potion of Health - Recovers ${client.config.emoji.heart} 500 \`${message.guild.prefix}feed lhealth\` costs ${client.config.emoji.coin} 1,250 ea
[802] ${client.config.emoji.health} - 1x Potion of Health - Recovers ${client.config.emoji.heart} 1000 \`${message.guild.prefix}feed health\` costs ${client.config.emoji.coin} 2,500 ea
[803] ${client.config.emoji.ghealth} - 1x Greater Potion of Health - Recovers ${client.config.emoji.heart} 1500 \`${message.guild.prefix}feed ghealth\` costs ${client.config.emoji.coin} 3,750 ea
				`)]
				})
			}
			if(args[0] == "potions"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setTitle(`Waifu Guide: What each potion does to your ${display}`)
					.setDescription(
						`
Here are the different types of potions that you can feed your ${display}

${client.config.emoji.chill} **Potion of Darkness** (\`;feed dark\`) - Fully restores your energy
${client.config.emoji.pmystery} **Potion of Mystery** (\`;feed mystery\`) - 50/50 chance to greatly heal or heavily damage it

${client.config.emoji.lhealth} **Lesser Potion of Health** (\`;feed lhealth\`) - Heals your waifu for ${client.config.emoji.heart} 500
${client.config.emoji.health} **Potion of Health** (\`;feed health\`) - Heals your waifu for ${client.config.emoji.heart} 1000
${client.config.emoji.ghealth} **Greater Potion of Health** (\`;feed ghealth\`) - Heals your waifu for ${client.config.emoji.heart} 1500
??? **Sleeping Pill** (\`;feed sleep\`) - Gives your waifu more pleasant dreams, and increases the multiplier by 2x
`)]
				})
			}
			// GUIDE FOR WAIFUS - STATS ONLY
			if(args[0] == "guide"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setTitle(`Waifu Guide: What each stat on your waifu does!`)
					.setDescription(
						`
Here are what each and every stat for your waifu will do for you!

${emojis[0]} **Health** - The life of your waifu. If it gets too low, you cant do certain things!
${emojis[1]} **Energy** - Allows you to use your waifu for different actions
${emojis[2]} **Experience** - The more the experience you gain, the more you level up!
${emojis[3]} **Credits** - Allows you to upgrade different stats via \`;upgrade\`
${emojis[4]} **Intellect** - Increases the amount of experience you receive
${emojis[5]} **Endurance** - Reduces the amount of energy used every action
${emojis[6]} **Strength** - Increase the amount of base damage you deal
${emojis[7]} **Affection** - Increases the ability to do special abilities
${emojis[8]} **Dexterity** - Increases the chance for a CRITICAL hit

**__Extras__**
:zap: **Power Level** - Determined by how good your ${display}'s inventory is. Each item can have up to :zap: 15
`)]
				})
			}
			let timed = Math.trunc(time / 3600000)
			let rhp = timed * 2000
			if(rhp > 10000){
				rhp = 10000
			}
			var ren = timed * 20
			if(ren > 100){
				ren = 100
			}
			var nhp = health + rhp
			if(nhp > 10000){
				nhp = 10000
			}
			var nen = energy + ren
			if(nen > 100){
				nen = 100
			}
			if(args[0] == "help"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`Waifu Guide: How to properly tend to your waifu!`)
					.setDescription(`
                    \`${message.guild.prefix}disown\` to disown your ${display} and delete it.
                    \`${message.guild.prefix}feed\` to feed your ${display} and completely refill its energy.
                    \`${message.guild.prefix}name <new name>\` to name your ${display}. (requires Supreme)
                    \`${message.guild.prefix}stroke\` to stroke your ${display} and increase its affection by 1.
                    \`${message.guild.prefix}train\` to get your ${display} to go out on an adventure and fight bosses!
                    \`${message.guild.prefix}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1.
					\`${message.guild.prefix}protect\` to toggle your waifus protection.
                    \`${message.guild.prefix}waifu shop\` - View the different purchasable waifu items
                    \`${message.guild.prefix}waifu guide\` - View information about each waifu stat
                    \`${message.guild.prefix}waifualias\` - Select from the cosmetic waifu aliases you own.
					`)]
				})
			}
				if(petalias){
					petalias = petalias.replace(/;/g, "\n")
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`${tag}'s [Lvl ${level}] ${client.capital(display)}`)
						.setThumbnail(`${emojis[9]}`)
						.setDescription(`${petalias}`)]
					})
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`${tag}'s [Lvl ${level}] ${client.capital(display)}`)
						.setThumbnail(`${emojis[9]}`)
						.setDescription(`\`${message.guild.prefix}waifu help\` - View command usage for your ${display}
						\`${message.guild.prefix}waifu ability\` - View your ${display}'s abilities!
						\`${message.guild.prefix}inventory\` - View your ${display}'s inventory
		
	"*${desc}*"
		
	**Health Stats**
	:white_small_square: ${emojis[0]} Health - ${client.comma(client.noExponents(health))}/10,000 
	:white_small_square: ${emojis[1]} Energy - ${client.comma(client.noExponents(energy))}/100
		
	**Level:** ${level}
	:white_small_square: ${emojis[2]} Experience - ${message.author.com == 1 ? client.noExponents(xp) : client.comma(client.noExponents(xp))}/${message.author.com == 1 ? client.noExponents(nextLevel) : client.comma(client.noExponents(nextLevel))}
	:white_small_square: ${emojis[3]} Credits - ${message.author.com == 1 ? client.noExponents(cred) : client.comma(client.noExponents(cred))}
		
	**${display}'s Stats**
	:white_small_square: ${emojis[4]} **Intelligence** - ${client.comma(client.noExponents(intel))} ( + ${client.comma(INTELB)} )
	:white_small_square: ${emojis[5]} **Endurance** - ${client.comma(client.noExponents(endur))} ( + ${client.comma(ENDURB)} )
	:white_small_square: ${emojis[6]} **Strength** - ${client.comma(client.noExponents(str))} ( + ${client.comma(STRB)} )
	:white_small_square: ${emojis[7]} **Affection** - ${client.comma(client.noExponents(affec))} ( + ${client.comma(AFFECB)} )
	:white_small_square: ${emojis[8]} **Dexterity** - ${client.comma(client.noExponents(dex))} ( + ${client.comma(DEXB)} )
		
	**${display}'s Extras**
	:white_small_square:  **Sleeping:** ${sleepstat} ${vtime ? `(${emojis[0]} + ${client.comma(Math.trunc(rhp))} & ${emojis[1]} + ${client.comma(Math.trunc(ren))})` : ""}
	:white_small_square: :zap: **Power Level:** ${client.comma(await client.getPowerLevel(id))}/100
						`)]
					})
				}
		}
		if (!args.length) {
			return Embed(message.author.id, message.author.tag)
		};
		if(!args.length) args = [message.author.id];
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		 Embed(usr.id, usr.tag, usr.bot);
	},
}