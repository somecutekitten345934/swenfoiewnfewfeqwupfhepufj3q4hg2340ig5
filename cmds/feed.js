const { MessageEmbed, Message } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'feed',
	aliases: ['fuel', 'feed'],
	description: "Feed your waifu and increase its energy.",
	category: 'pet',
	async run(client, message, args) {
		"level;health;energy;exp;credits;intel;endur;str;affec";
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Waifu Missing!`)
			.setDescription(`You must own a **[LVL 1] Waifu** in order to use this command! Begin your adventures by taming one with \`${message.guild.prefix}tame\`!`)
			.setThumbnail(client.config.thumbnail.pout)]
		}) 
				pet = pet.split(';');

		let cooldown = await client.db.get('fdc' + message.author.id);
		let bf = [
			"lhealth",
			"health",
			"ghealth",
			"sake",
			"dream"
		]
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		let input = (args[0] || "").toLowerCase();
		let foods = client.config.foods;
		let type = foods[Object.keys(foods).find((x) => input.startsWith(x))];

		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				display = "waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}

		if(cst.includes(`waifusleep`)){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.sleep} Sorry, your ${display} can't be fed you while sleeping! Wake them up with \`${message.guild.prefix}waifu sleep\` in order to feed them!`)]
            })
        }
		const data = client.cooldown(message.createdTimestamp, cooldown);

		if(bf.indexOf(args[0]) !== -1 && (args.length)){

		} else if(data) {
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Feed Cooldown!`)
				.setThumbnail(client.config.thumbnail.question)
				.setDescription(`Your waifu told me that they dont want to be fed for another\n**${data}**!`)]
			});
		}

		if (!type || (!args.length)) return message.channel.send(`The different types of food are ${client.list(Object.values(foods).map((x) => x.name))}`)	
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		let petuse = await client.db.get(`petuse${message.author.id}`)
		if(petuse){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} Your ${display} is not home right now and can't be fed anything! Try waiting until she gets back to feed her!`)]
			})
		}
		if(cst.includes(`dreamcatcher`) && args[0] == "dream"){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} ${message.author.tag}'s ${display} is already under the effects of the ${client.config.emoji.DREAM_CATCHER_POTION} and can't be fed that again!`)]
			})
		}

		let health = Number(pet[1]);
		let en = Number(pet[2]);
		pet[1] = health + type.gives.hp > 10000 ? 10000 : health + type.gives.hp;
		pet[2] = en + type.gives.en > 100 ? 100 : en + type.gives.en;

		let foodt = await client.db.get(type.key + message.author.id)
		if (type.key.split(";").length > 1 && (!cst.includes("allfood"))) {
			let fsh = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
					fsh = fsh.split(";");
			if (fsh[type.key.split(";")[1]] - 1 < 0) return message.channel.send("You don't have that type of food!");
			fsh[type.key.split(";")[1]] -= 1;
			await client.db.set("fsh" + message.author.id, fsh.join(";"));
		} else if (!cst.includes("allfood")) {
			let amt = await client.db.get(`${type.key}${message.author.id}`) || "0";
					amt = Number(amt);
			if (amt - 1 < 0){
				if(currAlias == "Neko"){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`**SAD NEKO NOISES** ${message.author.tag} forgot to fill up their catgirls fridge with ${type.emoji} and cannot feed them any of that type of food. Their neko cries in dispair as they are hungry :( plz feed neko`)
						.setThumbnail(emojis[9])]
					})
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} forgot to fill up their storage with ${type.emoji} and cannot feed them any of that type of food. :(`)
						.setThumbnail(emojis[9])]
					})
				}
			}
		};

		// DEVELOPER ITEM FOR TESTING
		if (type.name == "sake"){
			if (!cst.includes("botdeveloper")){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`As you offer your ${display} <:Sake:819097578376659014>, she turns around and spits out the drink. This drink is not suitable for non developer waifus!`)]
				})
			}
			else {
				pet[1] = 10000;
				pet[2] = 100;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				if(currAlias == "Neko"){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`**NYAAAA!** Your catgirl has been fully fed and is now content!`)
						.setTimestamp()]
					})
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`You have fed your ${display} a ${type.emoji} and have replenished their ${emojis[0]} & ${emojis[1]}`)
						.setTimestamp()]
					})
				}
			}
		}
		if (type.key.split(";").length > 1 && (!cst.includes("allfood"))) {
			let fsh = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
					fsh = fsh.split(";");
			if (fsh[type.key.split(";")[1]] - 1 < 0){
				if(currAlias == "Neko"){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`**SAD NYAA** ${message.author.tag}'s Catgirl cries as her fridge is empty of any ${type.emoji}... You forgot to stock the fridge!`)
						.setThumbnail(emojis[9])]
					});
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${display} tries to eat ${type.emoji} but ends up eating air...... You dont have any ${type.emoji} to feed!`)
						.setThumbnail(emojis[9])]
					});
				}
			}
			fsh[type.key.split(";")[1]] -= 1;
			await client.db.set("fsh" + message.author.id, fsh.join(";"));
		} else if (!cst.includes("allfood")) {
			let amt = await client.db.get(`${type.key}${message.author.id}`) || "0";
					amt = Number(amt);
			if (amt - 1 < 0) {
				if(currAlias == "Neko"){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`**SAD NYAA** ${message.author.tag}'s Catgirl cries as her fridge is empty of any ${type.emoji}... You forgot to stock the fridge!`)
						.setThumbnail(emojis[9])]
					});
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${display} tries to eat ${type.emoji} but ends up eating air...... You dont have any ${type.emoji} to feed!`)
						.setThumbnail(emojis[9])]
					});
				}
			} else {
				amt -= 1;
				await client.db.set(`${type.key}${message.author.id}`, amt);
			}
		};

		// POTIONS OF HEALING -- DO NOT ADD COOLDOWNS
		if(type.name == "lhealth"){
			let newhealth = pet[1] + 500;
				if (newhealth > 10000){
					newhealth = 10000
				}
				pet[1] = newhealth;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				
			if(currAlias == "Neko"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their catgirl drink a ${type.emoji} and heals them for ${emojis[0]} 500\n\n*Your catgirl nyaaas in appreciation*`)
					.setThumbnail(emojis[9])]
				})
			} else {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their ${display} drink a ${type.emoji} and heals them for ${emojis[0]} 500`)
					.setThumbnail(emojis[9])]
				})
			}
		}
		if(type.name == "health"){
			let newhealth = pet[1] + 1000;
				if (newhealth > 10000){
					newhealth = 10000
				}
				pet[1] = newhealth;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				
			if(currAlias == "Neko"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their catgirl drink a ${type.emoji} and heals them for ${emojis[0]} 1000\n\n*Your catgirl nyaaas in appreciation*`)
					.setThumbnail(emojis[9])]
				})
			} else {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their ${display} drink a ${type.emoji} and heals them for ${emojis[0]} 1000`)
					.setThumbnail(emojis[9])]
				})
			}
		}
		if(type.name == "ghealth"){
			let newhealth = pet[1] + 1500;
				if (newhealth > 10000){
					newhealth = 10000
				}
				pet[1] = newhealth;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				
			if(currAlias == "Neko"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their catgirl drink a ${type.emoji} and heals them for ${emojis[0]} 1500\n\n*Your catgirl nyaaas in appreciation*`)
					.setThumbnail(emojis[9])]
				})
			} else {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their ${display} drink a ${type.emoji} and heals them for ${emojis[0]} 1500`)
					.setThumbnail(emojis[9])]
				})
			}
		}
		if(type.name == "dream"){
			cst.push(`dreamcatcher`)
			await client.db.set(`cst${message.author.id}`, cst.join(`;`))
			if(currAlias == "Neko"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their catgirl drink a ${type.emoji}, prepairing ${display} for a delightful sleep..\n\n*Your catgirl nyaaas in appreciation*`)
					.setThumbnail(emojis[9])]
				})
			} else {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} makes their ${display} drink a ${type.emoji}, prepairing ${display} for a delightful sleep..`)
					.setThumbnail(emojis[9])]
				})
			}
		}
		if(type.name == "milk"){
			if(currAlias !== "Neko"){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`You stumble apon a special delicacy for catgirls.. but your ${display} is not one of them...`)
					.setFooter(`NOTE! Only the Neko waifu alias can use this food.`)]
				})
			} else {
				let milk = await client.db.get(`milk${message.author.id}`) || 0
				milk = Number(milk)
				if(milk == 0){
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`You do not have enough :milk: to feed your neko! This food is only obtained for the most prestigious nekos`)
						.setFooter(`NOTE! Only the Neko waifu alias can use this food.`)]
					})
				}
				nmilk = milk - 1
				await client.db.set(`milk${message.author.id}`, nmilk)
				let newenergy = pet[2] + 100;
				if (newenergy > 100){
					newenergy = 100
				}
				pet[2] = newenergy;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(emojis[9])
					.setDescription(`**NYAAA!** ${message.author.tag} goes to their catgirl and feeds her some :milk: replenishing ${emojis[1]} ${type.gives.en}!\n${message.author.tag} now has :milk: ${nmilk} left!`)
					.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
				});
				return;
			}
		}
		if (type.name == "mystery"){
			if (Math.trunc(Math.random() * 100 > 50)){
				let time = 3
						time *= 60000	
				await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
				
				let amt = Math.trunc(Math.random() * (5000 - 1000) + 100);
				let newhealth = health + amt;

				if(newhealth > 10000){
					newhealth = 10000
					amt = 0
				}

				pet[1] = newhealth
				await client.db.set("pet" + message.author.id, pet.join(";"));

				if(currAlias == "Neko"){
					message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`**NYAA!** <:nekohayay:844032957199155210>  ${message.author.tag} has fed their catgirl a ${type.emoji}, and gained ${emojis[0]} ${amt}`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				} else {
					message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji}, and re-plenished ${emojis[0]} ${amt}!`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				}
			}
			else {
				let lost = Math.trunc(health / 100 * 75)
				lost = Number(lost)
				let newhealth = health - lost;
				newhealth = Number(newhealth)
				if(newhealth < 0){
					newhealth = 0
				}

				pet[1] = newhealth

				await client.db.set("pet" + message.author.id, pet.join(";"));

				let cd = 5
				let time = 3
						time *= 60000	
				await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
				if(currAlias == "Neko"){
					message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag} has fed their catgirl a ${type.emoji} but the potion ended up being poison! ${display} has lost ${emojis[0]} ${lost}... **NYAAAAAAAAA!**`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				} else {
					message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji} but the potion ended up being poison! ${display} has lost ${emojis[0]} ${lost}`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				}
				return;
			}
		}
		if (type.name == "dark") {
			if (Math.floor(Math.random(1) * 10) >= 8) {
				let newhealth = pet[1] + 100;
				let newenergy = pet[2] + 100;
				if (newhealth > 10000){
					newhealth = 10000
				}
				if (newenergy > 100){
					newenergy = 100
				}
				pet[1] = newhealth;
				pet[2] = newenergy;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				if(currAlias == "Neko"){
					message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`**NYAA!** <:nekohayay:844032957199155210>  ${message.author.tag}'s catgirl has been consumed in darkness...`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
					return;
				} else {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji}, and re-plenished ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				}				
			}
			else {
				let newhealth = pet[1] + 100;
				let newenergy = pet[2] + 100;
				if (newhealth > 10000){
					newhealth = 10000
				}
				if (newenergy > 100){
					newenergy = 100
				}
				pet[1] = newhealth;
				pet[2] = newenergy;
				await client.db.set("pet" + message.author.id, pet.join(";"));
				if(currAlias == "Neko"){
					let cd = 5
					let time = 3
							time *= 60000	
					await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`**NYAA!** <:nekohayay:844032957199155210>  ${message.author.tag} has fed their catgirl a ${type.emoji}, and gained ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				} else {
					let cd = 5
					let time = 3
							time *= 60000	
					await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(emojis[9])
						.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji}, and re-plenished ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
						.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
					});
				}
				let cd = 5
				let time = 3
						time *= 60000	
				await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
				return;
			}	
		}
		else {
							let cd = 5
			let time = 3
					time *= 60000	
			await client.db.set(`fdc${message.author.id}`, (message.createdTimestamp + time) - client.config.epoch);
		};
		await client.db.set("pet" + message.author.id, pet.join(";"));
		if(currAlias == "Neko"){
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(emojis[9])
				.setDescription(`**NYAA!** <:nekohayay:844032957199155210>  ${message.author.tag} has fed their catgirl a ${type.emoji}, and gained ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
				.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
			});
		} else {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(emojis[9])
				.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji}, and re-plenished ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
				.setFooter(`TIP: Getting your Glycogenesis up will reduce your cooldown for feeding!`)]
			});
		}
	},
};