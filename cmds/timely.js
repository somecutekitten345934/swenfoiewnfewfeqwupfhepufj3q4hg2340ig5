const delay = require('delay');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const fetch = require('node-fetch');

module.exports = {
	name: 'timely',
	aliases: ['timely', 'daily', 'weekly', 'monthly'],
	category: 'ecn',	
	description: `Claim your timely rewards, view streaks, and more`,
	async run(client, message, args) {
		// TIMELY COOLDOWNS
		let data = await client.db.get('dlc' + message.author.id);
		let dailypic = await fetch(`https://waifu.pics/api/sfw/waifu`).then((res) => res.json());

		// OTHERS
		let wdata = await client.db.get(`wlc${message.author.id}`)
		let mdata = await client.db.get(`mlc${message.author.id}`)

		// LIMITED TIME
		let totcd = await client.db.get(`limitedtotcd${message.author.id}`)

		//DAILY TIMERS AND STREAKS
		let dstreakn = await client.db.get(`dstreakn${message.author.id}`)
		console.log(`DSTREAKN == ${dstreakn}`)

		// COUNTDOWN
		let dailyc = client.cooldown(message.createdTimestamp, data);
		let cooldown = await client.db.get(`dstreak${message.author.id}`)
		if(!cooldown){
			await client.db.delete(`dstreakn${message.author.id}`)
			dstreakn = "0"
		}
		if(!dailyc){
			dailyc = `Claim via \`${message.guild.prefix}timely daily\``
		}
		let cd = client.cooldown(message.createdTimestamp, cooldown);
		if(!cd){
			cd = `There is no active streak!`
			dstreakn = 0;
		}

		let wdatac = client.cooldown(message.createdTimestamp, wdata);
		let mdatac = client.cooldown(message.createdTimestamp, mdata);
		if(!wdatac){
			wdatac = `Claim via \`${message.guild.prefix}timely weekly\``
		}
		if(!mdatac){
			mdatac = `Claim via \`${message.guild.prefix}timely monthly\``
		}

		// LIMITED PLACEHOLDERS

		// TRICK OR TREAT
		let totc = client.cooldown(message.createdTimestamp, totcd);
		if(!totc){
			totc = `Claim via \`${message.guild.prefix}timely tot\``
		}

		// TIMELY NO ARG MESSAGE

        let reward;
        reward = Number(reward)

        let nstreak = dstreakn + 1;
        let nreward
        if(nstreak >= 14){
            nreward = 2500
        } else if (nstreak == 13){
            nreward = 2400
        } else if (nstreak == 13){
            nreward = 2300
        } else if (nstreak == 12){
            nreward = 2200
        } else if (nstreak == 11){
            nreward = 2100
        } else if (nstreak == 10){
            nreward = 2000
        } else if (nstreak == 9){
            nreward = 1900
        } else if (nstreak == 8){
            nreward = 1800
        } else if (nstreak == 7){
            nreward = 1700
        } else if (nstreak == 6){
            nreward = 1600
        } else if (nstreak == 5){
            nreward = 1500
        } else if (nstreak == 4){
            nreward = 1400
        } else if (nstreak == 3){
            nreward = 1300
        } else if (nstreak == 2){
            nreward = 1200
        } else if (nstreak == 1){
            nreward = 1100
        } else {
            nreward = 1000
        }

        if(dstreakn >= 14){
            reward = 2500
        } else if (dstreakn == 13){
            reward = 2400
        } else if (dstreakn == 13){
            reward = 2300
        } else if (dstreakn == 12){
            reward = 2200
        } else if (dstreakn == 11){
            reward = 2100
        } else if (dstreakn == 10){
            reward = 2000
        } else if (dstreakn == 9){
            reward = 1900
        } else if (dstreakn == 8){
            reward = 1800
        } else if (dstreakn == 7){
            reward = 1700
        } else if (dstreakn == 6){
            reward = 1600
        } else if (dstreakn == 5){
            reward = 1500
        } else if (dstreakn == 4){
            reward = 1400
        } else if (dstreakn == 3){
            reward = 1300
        } else if (dstreakn == 2){
            reward = 1200
        } else if (dstreakn == 1){
            reward = 1100
        } else {
            reward = 1000
        }
		if(!args.length){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${message.author.tag}'s Timely Rewards`)
				.setDescription(`Here are ${message.author.tag}'s timely rewards and cooldowns! <a:stonks:841143767532699679>

				**STREAKS**
				The higher the streak, the better the reward!

				**DAILY REWARD**
				Claim a waifu's small donation every **24 HOURS**
				<:cooldown:861941900025397269> ${dailyc}
				<:Streak:861943255218651147> **x${dstreakn}** ${cd}
				<:NextReward:861944551451263006> ${client.config.emoji.coin} ${client.comma(nreward)}

				**WEEKLY REWARD**
				Claim a waifu's donation every **7 DAYS**
				<:cooldown:861941900025397269> ${wdatac}
				<:NextReward:861944551451263006> ${client.config.emoji.coin} 5,000

				**MONTHLY REWARD**
				Claim a waifu's large donation every **4 WEEKS**
				<:cooldown:861941900025397269> ${mdatac}
				<:NextReward:861944551451263006> ${client.config.emoji.coin} 20,000
				`)]
			})
		}
		data = Number(data);
		let arg = args[0].toLowerCase()
		let data2 = await client.db.get(`dlc${message.author.id}`)
		let daily2c = client.cooldown(message.createdTimestamp, data2);
		let dailycds = client.cooldown(message.createdTimestamp, cd)
		if (daily2c && (arg == "daily")) {
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`You must wait ${daily2c} before collecting your daily reward!`)]
				});
		
		} else if(!daily2c && (arg == "daily")){
				let bal = await client.db.get('bal' + message.author.id) || 0;
				bal = Number(bal);
				await client.db.set('dlc' + message.author.id, (message.createdTimestamp + ms('1d')) - client.config.epoch)
				if(!cooldown){
					await client.db.delete(`dstreakn`)
					dstreakn = 0
					await client.db.set('dstreak' + message.author.id, (message.createdTimestamp + ms('30h')) - client.config.epoch)
				} else {
					await client.db.set('dstreak' + message.author.id, (message.createdTimestamp + ms('30h')) - client.config.epoch)
				}
				dstreakn = Number(dstreakn)
				let ndstreakn = dstreakn + 1
				if(dailycds){
					ndstreakn = 1;
				}
				await client.db.set(`dstreakn${message.author.id}`, ndstreakn)

				await client.db.set('bal' + message.author.id, bal + reward);
				try {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setThumbnail(dailypic.url)
						.setDescription(`**DAILY REWARD CLAIMED!**\n${message.author.tag} goes to a waifu and collects their daily reward of ${client.config.emoji.coin} ${client.comma(reward)} and is now on a <:Streak:861943255218651147> **x${ndstreakn}** streak! Come back tomorow to continue your streak!`)
						.setColor(message.author.color)]
					});
				} catch(error){
					if(error == "DiscordAPIError: Request entity too large"){
						return message.reply(`An internal error occurred whilst attempting to grab a photo of the waifus who gave you your timely reward... but they still gave you your reward!`)
					}
				}
		};
		let wdata2 = await client.db.get(`wlc${message.author.id}`)
		let weekly2c = client.cooldown(message.createdTimestamp, wdata2);
			if (weekly2c && (arg == "weekly")) {
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`You must wait ${weekly2c} before collecting your weekly reward!`)]
				});
		
		} else if(!weekly2c && (arg == "weekly")){
				let bal = await client.db.get('bal' + message.author.id) || 0;
				bal = Number(bal);
				await client.db.set('wlc' + message.author.id, (message.createdTimestamp + 604800000) - client.config.epoch)
				let reward;
				reward = Number(reward)
				reward = 5000
				await client.db.set('bal' + message.author.id, bal + reward);
				try {
					message.channel.send({
						embeds: [new MessageEmbed()
						.setThumbnail(dailypic.url)
						.setDescription(`**WEEKLY REWARD CLAIMED!**\n${message.author.tag} gets a hot waifu to give them their weekly reward of ${client.config.emoji.coin} ${client.comma(reward)}!`)
						.setColor(message.author.color)]
					});
				} catch(error){
					if(error == "DiscordAPIError: Request entity too large"){
						return message.reply(`An internal error occurred whilst attempting to grab a photo of the waifus who gave you your timely reward... but they still gave you your reward!`)
					}
				}
		};
		let mdata2 = await client.db.get(`mlc${message.author.id}`)
		let monthly2c = client.cooldown(message.createdTimestamp, mdata2);
		if (monthly2c && (arg == "monthly")) {
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`You must wait ${monthly2c} before collecting your monthly reward!`)]
				});
		
		} else if(!monthly2c && (arg == "monthly")){
				let bal = await client.db.get('bal' + message.author.id) || 0;
				bal = Number(bal);
				await client.db.set('mlc' + message.author.id, (message.createdTimestamp + 2419000000) - client.config.epoch)
				let reward;
				reward = Number(reward)
				reward = 20000
				await client.db.set('bal' + message.author.id, bal + reward);
				try {
					message.channel.send({
						embeds: [new MessageEmbed()
						.setThumbnail(dailypic.url)
						.setDescription(`**MONTHLY REWARD CLAIMED!**\n${message.author.tag} gets their favorite waifu to give them their monthly reward of ${client.config.emoji.coin} ${client.comma(reward)}!`)
						.setColor(message.author.color)]
					});
				} catch(error){
					if(error == "DiscordAPIError: Request entity too large"){
						return message.reply(`An internal error occurred whilst attempting to grab a photo of the waifus who gave you your timely reward... but they still gave you your reward!`)
					}
				}
		};

		// LIMITED TIME ITEMS
		if((arg == "tot")){
			if(message.author.id !== client.config.owner){ return message.channel.send(`It is not spooky enough for you to do this command... Try again later!`)}
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.loading} ${message.author.tag} knocks on Weebchan's door...`)]
			})
			await delay(5000)
			let tricked = 5
			let rng = Math.floor(Math.random() * 250)
			console.log(rng)
			if(rng > 1){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`**RARE DROP!**
					
					Weebchan has placed a ${client.config.emoji.CANDYCORN_TALISMAN} into ${message.author.tag}'s candy bag!
					`)
					.setFooter(`ITEM ID: CANDYCORN_TALISMAN`)
					.setThumbnail(`https://i.gyazo.com/f4d6270e9e2b6cc3393a3a8b03b8d277.png`)]
				})
			}
			if(tricked >= 51){
				// TRICKED
				let bal = await client.db.get(`bal${message.author.id}`) || "";
				let 

			} else {
				message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Weebchan decides to be nice to ${message.author.tag} and puts ${client.config.emoji.coin} TIMELY_LIMITED_TOT_REWARD_COINS in their candy bag!`)]
				})
			}
		}
		if(message.author.id == client.config.owner && (arg == "resetcds")){
			await client.db.delete(`dlc${message.author.id}`)
			await client.db.delete(`wlc${message.author.id}`)
			await client.db.delete(`mlc${message.author.id}`)
			return message.channel.send({embeds: [new MessageEmbed().setColor(message.author.color).setDescription(`${client.config.emoji.tick} Successfully reset ${message.author.tag}'s timely cooldowns`)]})
		}
	},
};