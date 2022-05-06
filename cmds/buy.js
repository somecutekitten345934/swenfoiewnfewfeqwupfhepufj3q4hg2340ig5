const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'buy',
	aliases: ['buy', 'purchase'],
	description: "Buy something from the overpriced shop",
	category: 'ecn',
	usage: '<item>',
	async run(client, message, args) {
		if (isNaN(args[0])) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		let t = parseInt(args[0]);
		if (!isNaN(args[1])) {
			if (Number(args[1]) <= 0) args[1] = 1;
		};
		let things = [
			{ number: 101, price: 750 },
			{ number: 102, price: 9_999 },
			{ number: 103, price: 7_500 },
			{ number: 201, price: 10000 },
			{ number: 202, price: 2500 },
			{ number: 301, price: 75_000},
			{ number: 350, price: 750},
			{ number: 401, price: 45_000},
			{ number: 501, price: 1000 },
			{ number: 502, price: 1_000},
			{ number: 601, price: 5000 },
			{ number: 602, price: 35000 },
			{ number: 701, price: 5_000 },
			{ number: 702, price: 5_000},
			{ number: 801, price: 1250 },
			{ number: 802, price: 2500},
			{ number: 803, price: 3750}
		];
		let valid = things.map(({ number }) => number);
		if (!t || (!valid.includes(t))) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		let bal = await client.db.get('bal' + message.author.id) || 0;
		if (!bal || (bal == 0)) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);
		if (bal - things[valid.indexOf(t)].price < 0) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if (t == 101) {
			//fishing rod
			let owns = cst.includes("BASIC_FISHING_ROD")
			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.t1rod}`) }
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
			cst.push("BASIC_FISHING_ROD")
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.t1rod} !`)]
			})
		} else if (t == 102) {
			let owns = cst.includes("pickaxe");
			if (owns) return message.channel.send(`${client.config.emoji.err} You already have a :pick: pickaxe!`);
			cst.push("pickaxe");
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought a :pick: pickaxe! | \`${message.guild.prefix}mine\``)]
			})
		} else if (t == 103) {
			let owns = cst.includes("slrprmt");
			if (owns) return message.channel.send(`${client.config.emoji.err} You already have a Seller's Permit!`);
			cst.push("slrprmt");
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought a ${client.config.emoji.permit} Seller's Permit!`)]
			})
		} else if (t == 401) {
			let owns = cst.includes("wingsdarkness1")
			if (owns) return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.darkness} !`);
			cst.push("wingsdarkness1")
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.darkness} !`)]
			})
		} else if (t == 501) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many potions you want to buy must be a number");
			let x = await client.db.get(`chillpills${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} potions of darkness!`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`chillpills${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.chill} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 502) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many potions you want to buy must be a number");
			let x = await client.db.get(`phaste${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} potions of haste!`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`phaste${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.phaste} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 701) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many potions you want to buy must be a number");
			let x = await client.db.get(`pmystery${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} potions of darkness!`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`pmystery${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.pmystery} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 702) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send(`The quantity of how many ${client.config.emoji.DREAM_CATCHER_POTION} you want to buy must be a number`);
			let x = await client.db.get(`dcatcher${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} ${client.config.emoji.DREAM_CATCHER_POTION}`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`dcatcher${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.DREAM_CATCHER_POTION} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 801) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many lesser potions of health you want to buy must be a number");
			let x = await client.db.get(`lhealth${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} lesser potions of health`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`lhealth${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.lhealth} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 802) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many potions of health you want to buy must be a number");
			let x = await client.db.get(`health${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} potions of health`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`health${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.health} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})
		} else if (t == 803) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send("The quantity of how many greater potions of health you want to buy must be a number");
			let x = await client.db.get(`ghealth${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${amt} greater potions of health`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`ghealth${message.author.id}`, parseInt(x + amt));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.ghealth} ${message.author.com == 1 ? amt : client.comma(amt)}!`)]
			})		
		} else if (t == 201) {
			let owns = cst.includes("bvault")
			if (owns) return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.vault} Bank Vault!`);
			cst.push("bvault")
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.vault} Bank Vault!`)]
			})
		} else if (t == 202) {
			let owns = cst.includes(`RAINBOW_TALISMAN`);
			if (owns) return message.channel.send(`${client.config.emoji.err} You already have a ${client.config.emoji.rainbow} talisman!`);
			
			await client.db.set('bal' + message.author.id, Number(bal - things[valid.indexOf(t)].price))
			cst.push("RAINBOW_TALISMAN")
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought a ${client.config.emoji.rainbow} talisman!`)]
			})
		} else if (t == 301) {
			let owns = cst.includes("plasmacannon")
			if (owns) return message.channel.send(`${client.config.emoji.err} You already own a ${client.config.emoji.plasmacannon} !`);
			cst.push("plasmacannon")
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.plasmacannon} !`)]
			})
		} else if (t == 350) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send(`The quantity of how many ${client.config.emoji.plasmaammo} you want to buy must be a number`);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${client.config.emoji.plasmaammo} x${amt}`);
			let ammo = await client.db.get(`ammo${message.author.id}`) || "0;0;0;0;0;0;0;0";
			ammo = ammo.split(";");
			let plasma = Number(ammo[0])

			let nplasma = plasma + amt;
			ammo[0] = nplasma
			
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`ammo${message.author.id}`, ammo.join(`;`))
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought ${client.config.emoji.plasmaammo} x${amt}`)]
			})
		} else if (t == 601) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send(`The quantity of how many ${client.config.emoji.STAT_MODIFIER_ONE} you want to buy must be a number`);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${client.config.emoji.STAT_MODIFIER_ONE} x${amt}`);
			let mod = await client.db.get(`modifiers${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0";
			mod = mod.split(";");
			let t1 = Number(mod[0])

			let nt1 = t1 + amt;
			mod[0] = nt1
			
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`modifiers${message.author.id}`, mod.join(`;`))
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought ${client.config.emoji.STAT_MODIFIER_ONE} x${amt}`)]
			})
		} else if (t == 602) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.channel.send(`The quantity of how many ${client.config.emoji.STAT_MODIFIER_ALL} you want to buy must be a number`);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.channel.send(`You don't have enough money to purchase ${client.config.emoji.STAT_MODIFIER_ALL} x${amt}`);
			let mod = await client.db.get(`modifiers${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0";
			mod = mod.split(";");
			let t1 = Number(mod[1])

			let nt1 = t1 + amt;
			mod[1] = nt1
			
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`modifiers${message.author.id}`, mod.join(`;`))
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought ${client.config.emoji.STAT_MODIFIER_ALL} x${amt}`)]
			})
		}
	},
};