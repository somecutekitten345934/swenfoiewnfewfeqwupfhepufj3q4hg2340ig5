const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'shop',
	aliases: ['s', 'shop'],
	category: 'ecn',
	description: 'View the current shop!',
	async run(client, message, args) {
		let bal = await client.db.get('bal' + message.author.id) || "0";
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		let owns = {
			fishing_rod: cst.includes("BASIC_FISHING_ROD"),
			phone: cst.includes("phone"),
			pickaxe: cst.includes("pickaxe"),
			v: cst.includes("bvault"),
			clr: cst.includes(`RAINBOW_TALISMAN`),
			slrprmt: cst.includes("slrprmt"),
			plasmacannon: cst.includes(`plasmacannon`),
			darkness: cst.includes(`wingsdarkness1`)
		}
		if(!args.length){
			// 700 is the new 500, less than 100 is now 100s
			const shop = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Shop - ${message.author.tag}`)
			.setDescription(`${client.config.emoji.coin} Current Balance - ${client.comma(bal)}\n\nPurchase an item from the store via \`${message.guild.prefix}buy <ID>\``)
			.addField("Tools", `
			[101] ${client.config.emoji.t1rod}${owns.fishing_rod ? ` ${client.config.emoji.tick}  ` : ' '} - Allows you to go fishing \`${message.guild.prefix}fish\` [${client.config.emoji.coin} **750**]
			[102] ${client.config.emoji.t1pickaxe}${owns.pickaxe ? ` ${client.config.emoji.tick}  ` : ' '} - Tier 1 Pickaxe - Allows you to mine iron ore. Upgrade via` + ` \`${message.guild.prefix}forge\` ` + ` [${client.config.emoji.coin} **9,999**]
			[103] ${client.config.emoji.permit}${owns.slrprmt ? ` ${client.config.emoji.tick}  ` : ' '} - Allows you to sell in-game items via \`${message.guild.prefix}sell\`; costs ${client.config.emoji.coin} 7,500
			`)
			.addField("Utilities", `
			[201] ${client.config.emoji.vault}${owns.v ? ` ${client.config.emoji.tick}  ` : ' '} - Bank Vault - Allows you to store money where it's safely hidden away from attackers; \`${message.guild.prefix}vault\` to view your vault; costs ${client.config.emoji.coin} 10,000\n
			[202] ${client.config.emoji.rainbow}${owns.clr ? ` ${client.config.emoji.tick}  ` : ' '} - Set a random color preference whilst using commands; costs ${client.config.emoji.coin} 2,500`)
			.addField(`Weapons & Ammo`, 
			`
			[301] ${client.config.emoji.plasmacannon}${owns.plasmacannon ? ` ${client.config.emoji.tick}  ` : ' '} - Shoot an overpowered cannon using ${client.config.emoji.plasmaammo} [4-10 minute stun] \`${message.guild.prefix}cannon <user>\`; costs ${client.config.emoji.coin} 75,000
			[350] ${client.config.emoji.plasmaammo} - **[x1]** Usable on ENERGY type weapons; costs ${client.config.emoji.coin} 750 each
			`)
			.addField(`Items`,
			`
			[401] ${client.config.emoji.darkness}${owns.darkness ? ` ${client.config.emoji.tick}  ` : ' '} - Increase the amount of ores you find. \`${message.guild.prefix}forge\` to upgrade; costs ${client.config.emoji.coin} 45,000
			`)
			.addField(`Foodstuffs`, 
			`
			[501] ${client.config.emoji.chill} - **[x1]** Removes **MOST** cooldowns, 6 hour cooldown for consuming this item \`${message.guild.prefix}drink dark\`; costs ${client.config.emoji.coin} 1,000 each
			[502] ${client.config.emoji.phaste} - **[x1]** Potion of Haste - Reduces the cooldown between mining \`${message.guild.prefix}drink haste\`; costs ${client.config.emoji.coin} 1,000 each
	
			**NOTE:** For waifu foodstuffs, do \`${message.guild.prefix}waifu shop\`
			`)
			.setFooter(`Showing page 1/2`)
			.setTimestamp()
			message.channel.send({ embeds: [shop]});
		}
		if(args[0] == "2"){
			const shop2 = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Shop - ${message.author.tag}`)
			.setDescription(`${client.config.emoji.coin} Current Balance - ${client.comma(bal)}\n\nPurchase an item from the store via \`${message.guild.prefix}buy <ID>\``)
			.addField("Consumables", `
			[601] ${client.config.emoji.STAT_MODIFIER_ONE} - **[x1]** Allows you to refund your waifus credits by 1; ${client.config.emoji.coin} 5,000
			[602] ${client.config.emoji.STAT_MODIFIER_ALL} - **[x1]** Allows you to refund ALL your waifus credits in a single stat; ${client.config.emoji.coin} 35,000
			`)
			.setFooter(`Showing page 2/2`)
			.setTimestamp()
			message.channel.send({ embeds: [shop2]});
		}
	},
}