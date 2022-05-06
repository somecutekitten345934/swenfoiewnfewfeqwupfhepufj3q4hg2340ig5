const { MessageEmbed, escapeMarkdown, Permissions, UserFlags, ReactionUserManager, MessageActionRow, MessageButton, ButtonInteraction } = require('discord.js');
const short = require(`short-number`);
const ms = require(`ms`)

module.exports = {
	name: 'profile',
	aliases: ['profile', 'prof'],
	category: 'social',
	description: 'shows a user\'s profile',
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let cd = await client.db.get("profilec" + message.author.id);
		cd = Number(cd);
		let scnd = client.cooldown(message.createdTimestamp, cd);
		if (scnd) {
			return message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`Cooldown!`)
				.setDescription(`I refuse to let you view another profile whilst another one is active! Ask me in about **${scnd}**\n\n**TIP:** Close the profile menu by pressing "Close" to remove this cooldown!`)
				.setThumbnail(client.config.thumbnail.cooldown)]
			});
		};
		await client.db.set('profilec' + message.author.id, (message.createdTimestamp + ms(`45s`)) - client.config.epoch)
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		let color = await client.db.get('clr' + usr.id) || client.config.defaultHexColor;
		let cmds = await client.db.get("cmds" + usr.id) || 1;
		let desc = await client.db.get(`petdesc${usr.id}`) || `Your waifu can have a description! Set it via \`${message.guild.prefix}waifu desc\``
		if(desc.includes(`[`) || desc.includes(`]`) || desc.includes(`(`) || desc.includes(`)`)){
			message.channel.send({ embeds: [new MessageEmbed().setTitle(`Illegal Characters!`).setDescription(`This ${display}'s description contains illegal characters, so it has been wiped! Sorry!`)]})
			desc = "Weebchan has wiped this bio due to illegal characters!"
			await client.db.delete(`petdesc${id}`)
		}
		let data = await client.db.get("exp" + usr.id) || `${message.guild.id};0;1;1`;
				data = data.split(";f;");
		const indx = data.findIndex((f) => f.split(";")[0] == message.guild.id);
		let lvl;
		let xp;
		if(indx == -1){
			lvl = 1
			xp = 0
		} else {
			lvl = isNaN(data[indx].split(";")[2]) ? 0 : Number(data[indx].split(";")[2]) || 1;
			xp = isNaN(data[indx].split(";")[3]) ? 0 : Number(data[indx].split(";")[3]);
		}
		let xpcalc = (5 * (lvl ^ 2) + (50 * lvl) * 10);
		let prefix = message.guild.prefix || client.config.prefix;
		let alias = await client.db.get("curralias" + usr.id) || "Waifu";
		let emojis;
		let display;
		if (alias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(alias)) {
				display = aliases[alias].DISPLAY_NAME;
				selected = display;
				emojis = aliases[alias].EMOJIS;
			} else {
				selected = "default";
				display = "Waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}
		let unlockedAliases = await client.db.get(`petaliases${usr.id}`) || ``
		unlockedAliases = unlockedAliases.split(`;`)
		let waifu = await client.db.get(`pet` + usr.id) || "0"
		let bonus = await client.getBonusStats(`${usr.id}`)
		bonus = bonus.split(`;`)
		let INTELB = Number(bonus[0])
		let ENDURB = Number(bonus[1])
		let STRB = Number(bonus[2])
		let AFFECB = Number(bonus[3])
		let DEXB = Number(bonus[4])
		let cst = await client.db.get("cst" + usr.id) || "";
		cst = cst.split(";")
		if(cst.includes(`maxedwaifu`)){
			waifu = client.config.maxedPet
		}
		let collectables = await client.db.get(`COLLECTIBLES${usr.id}`) || "NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE;NONE"
		collectables = collectables.split(`;`)

		let itemarray = []
		for(const i of collectables) {
			itemarray.push({
				NAME: i,
			})
		}
		for(var i in itemarray){
            itemarray[i].number = Number(i) + 1;
        }
        let rarray = []
        for(const i of itemarray){
          	if(cst.includes(i.NAME) || i.NAME == "NONE"){
				let item = client.getItem(`${i.NAME}`)
				if(item.EMOJI == `INVALID` || item.EMOJI == "NONE"){
					item.EMOJI = ``
				}
				if(item.NAME == "NONE"){
					rarray.push(`:white_small_square: Slot **#${i.number}** *Nothing Showcased!*`)
				} else {
					rarray.push(`:white_small_square: Slot **#${i.number}** ${item.EMOJI} **${item.NAME_PROPER}**\n*${item.DESCRIPTION}*`)
				}
        	}
        }
		waifu = waifu.split(";")
		let health = waifu[1];
		let affec = waifu[8];
		let energy = waifu[2];                                     
		let wlevel = waifu[0];
		let waifuxp = waifu[3];
		let cred = waifu[4];
		let intel = waifu[5];
		let endur = waifu[6];
		let str = waifu[7];
		let dex = waifu[9];
		let nextLevel = client.config.reqs[wlevel - 1] || "∞";

		let spouse = await client.db.get(`spouse${usr.id}`);
		let User = client.users.cache.get(spouse) || "UNKNOWN#0000";
		let spouset = User.tag
		if(!spouset){
			spouset = "No Spouse!"
		}
		let bal = await client.db.get(`bal${usr.id}`) || 0
		bal = Number(bal)
		let vault = await client.db.get(`v${usr.id}`) || "0;0"
		vault = vault.split(`;`)
		let vaulta = Number(vault[1])

		
		if (cst.includes(`botowner999`)){
			ranks = `<:owner:817543021208797204> Weebchan's Owner`;
		} else if (cst.includes(`botdeveloper`)){
			ranks = "<:developer:817542567679492118> Weebchan Developer";
		} else if (cst.includes(`administrator132465798`)){
			ranks = "<:staff:817619613113909258> Administrator";
		} else if (cst.includes(`WEEBCHAN_ARTIST_RANK`)){
			ranks = `<:sip:861748374487564339> Weebchan Artist`
		} else if (cst.includes(`srmod`)){
			ranks = "<:staff:817619613113909258> Senior Moderator";
		} else if (cst.includes(`moderator`)){
			ranks = "<:staff:817619613113909258> Moderator";
		} else if (cst.includes(`tmod`)){
			ranks = "<:staff:817619613113909258> Trial Moderator";
		} else if (cst.includes(`gadmin`)){
			ranks = `<:staff:817619613113909258> Guild Administrator`
		} else if (cst.includes(`guildmod`)){
			ranks = `<:staff:817619613113909258> Guild Staff`
		} else if (cst.includes(`sensei`)){
			ranks = `${client.config.emoji.patreon} Sensei`
		} else if (cst.includes(`adventurer`)){
			ranks = `${client.config.emoji.patreon} Adventurer`
		} else if (cst.includes(`trainee`)){
			ranks = `${client.config.emoji.patreon} Trainee`
		} else if (cst.includes(`booster`)){
			ranks = "Server Booster"
		} else if (cst.includes(`CONTENT_TEAM_RANK`)){
			ranks = `${client.config.emoji.bcmd} Content Team`
		} else if (cst.includes(`BETA_TESTER_RANK`)){
			ranks = `${client.config.emoji.bcmd} Beta Tester`
		} else if(cst.includes(`WIKI_CONTRIBUTOR_RANK`)){
			ranks = `Wiki Contributor`
		} else if (cst.includes(`BUG_HUNTER_RANK`)){
			ranks = `${client.config.emoji.BUG_HUNTER_RANK} Bug Hunter`
		} else {
			ranks = "Normal Player";
		};
		/*
		let rolePersist = await client.db.get('persist' + member.id) || `${client.config.roles.memberRole}`;
			rolePersist = rolePersist.split(";");
			client.config.ditems.forEach((i) => {
				if (cst.includes(i.split(";")[1])) {
					newRoles.push(i.split(";")[2]);
				};
			});
			client.config.cstSpecials.forEach((x) => {
				if (cst.includes(x[0])) {
					rolePersist.push(x[1]);
				};
			});
		*/

		let normal = await client.db.get(`arenanormal${usr.id}`) || "0;0"
		normal = normal.split(`;`)
		let bio = await client.db.get('bio' + usr.id) || 'Set a bio using `' + `${prefix}` + "bio`"
		if(bio.includes(`[`) || bio.includes(`]`) || bio.includes(`(`) || bio.includes(`)`)){
			message.channel.send({ embeds: [new MessageEmbed().setTitle(`Illegal Characters!`).setDescription(`This users bio contains illegal characters, so it has been wiped! Sorry!`)]})
			bio = "Weebchan has wiped this bio due to illegal characters!"
			await client.db.delete(`bio${usr.id}`)
		}

		const components = (state) => [
			new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId(`MAIN_PROFILE`)
				.setLabel(`Main Page`)
				.setStyle(`PRIMARY`)
			)
			.addComponents(
				new MessageButton()
				.setCustomId(`WAIFU`)
				.setLabel(`Waifu`)
				.setStyle(`SECONDARY`)
			)
			.addComponents(
				new MessageButton()
				.setCustomId(`COLLECTIBLES`)
				.setLabel(`Collectibles`)
				.setStyle(`SECONDARY`)
			)
			.addComponents(
				new MessageButton()
				.setCustomId(`CLOSE`)
				.setLabel(`Close`)
				.setStyle(`DANGER`)
			)
		]
		const embed = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle(`${usr.tag}'s Weebchan Profile`)
		.setDescription(`"${bio.toString().length ? bio : null}"

		**Rank:** ${ranks}
	
		__**Basic Information**__
		:white_small_square: **Commands Used**: ${message.author.com == 1 ? cmds : client.comma(cmds)}
		:white_small_square: **Spouse**: ${spouset}
		:white_small_square: **Server Level**: ${client.comma(lvl)}
		:white_small_square: **XP**: ${client.comma(xp)} / ${client.comma(xpcalc)}

		__**Economy**__
		:white_small_square: **Balance**: ${short(bal)}
		:white_small_square: **Vault**: ${short(vaulta)}

		`)
		.setThumbnail(usr.displayAvatarURL({ dynamic: true }))

		const msg = await message.channel.send({
			embeds: [embed],
			components: components(false),
		})
		const filter = (interaction) => interaction.user.id === message.author.id;

		const collector = message.channel.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 45000,
		})
		collector.on(`collect`, async (interaction) => {
			const main = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Weebchan Profile`)
			.setDescription(`"${bio.toString().length ? bio : null}"

			**Rank:** ${ranks}
	
			__**Basic Information**__
			:white_small_square: **Commands Used**: ${message.author.com == 1 ? cmds : client.comma(cmds)}
			:white_small_square: **Spouse**: ${spouset}
			:white_small_square: **Server Level**: ${client.comma(lvl)}
			:white_small_square: **XP**: ${client.comma(xp)} / ${client.comma(xpcalc)}
	
			__**Economy**__
			:white_small_square: **Balance**: ${short(bal)}
			:white_small_square: **Vault**: ${short(vaulta)}
	
			`)
			.setThumbnail(usr.displayAvatarURL({ dynamic: true }))

			const collectables = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Weebchan Collectibles`)
			.setDescription(`"${bio.toString().length ? bio : null}"
	
			__**Collectible Showcase**__
			Shows up to **10** items from ${usr.tag}'s collection!

			${rarray.length ? rarray.join(`\n\n`) : `No collectibles showcased yet!`}
	
			`)
			.setThumbnail(usr.displayAvatarURL({ dynamic: true }))

			const waifu = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Weebchan ${alias} [Lvl ${client.comma(wlevel)}]`)
			.setDescription(`"${desc}"
	
			__**Waifu**__
			:white_small_square: **Alias**: ${alias}
			:white_small_square: **Unlocked Aliases:** ${unlockedAliases == `` ? 0 : unlockedAliases.length}

			__**Waifu Mini Stats**__
			:white_small_square: ${emojis[4]} **Int** - ${client.comma(client.noExponents(intel))} ( + ${client.comma(INTELB)} )
			:white_small_square: ${emojis[5]} **Endur** - ${client.comma(client.noExponents(endur))} ( + ${client.comma(ENDURB)} )
			:white_small_square: ${emojis[6]} **Str** - ${client.comma(client.noExponents(str))} ( + ${client.comma(STRB)} )
			:white_small_square: ${emojis[7]} **Affec** - ${client.comma(client.noExponents(affec))} ( + ${client.comma(AFFECB)} )
			:white_small_square: ${emojis[8]} **Dex** - ${client.comma(client.noExponents(dex))} ( + ${client.comma(DEXB)} )

			__**Waifu Inventory**__
			:zap: **Power Level:** ${await client.getPowerLevel(usr.id)} / 100
			:white_small_square: **Fishing Rod:** ???
			:white_small_square: **Pickaxe:** ???
			:white_small_square: **Weapon:** ???
			
			__**Arena Stats**__ (Win/Loss)
			- **Normal:** ${client.comma(normal[0])} / ${client.comma(normal[1])}
			- **Ranked:** Not Coming Soon
			`)
			.setThumbnail(emojis[9])
			const nowaifu = new MessageEmbed()
			.setTitle(`${usr.tag}'s Weebchan ${alias} [Lvl ${client.comma(wlevel)}]`)
			.setDescription(`Failed to load waifu data for user ${usr.tag} due to user not having one tamed!`)
			.setColor(client.config.colors.red)

			if(interaction.customId == `MAIN_PROFILE`){
				interaction.deferUpdate()
				msg.edit({ embeds: [main]})
			}
			if(interaction.customId == "COLLECTIBLES"){
				interaction.deferUpdate()
				msg.edit({ embeds: [collectables]})
			}
			if(interaction.customId == "WAIFU"){
				interaction.deferUpdate()
				if(intel == undefined){
					msg.edit({ embeds: [nowaifu]})
				} else {
					msg.edit({embeds: [waifu]})
				}
			}
			if(interaction.customId == "CLOSE"){
				interaction.reply({ content: `I have ended the interaction menu!`, ephemeral: true})
				collector.stop(`COLLECTOR_FORCE_STOPPED`)
			}
		})
		
		collector.on(`end`, async (interaction, reason) => {
			msg.edit({ components: [] })
			await client.db.delete(`profilec${message.author.id}`)
		})
  },
}