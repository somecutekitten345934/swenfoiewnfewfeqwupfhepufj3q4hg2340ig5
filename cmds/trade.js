const { MessageEmbed } = require('discord.js');
const delay = require('delay');

module.exports = {
	name: 'trade',
	aliases: ['trade', 'tr'],
	disabled: true,
	description: 'trades an item with another user',
	async run(client, message, args) {
		return message.reply(`This system is currently not available. Sorry!`)
		function identifyKey(item, id) {
			item = item.toString();
			id = id.toString();
			if (item.startsWith('ch')) {
				return {
					name: client.config.emoji.chill + ' chill pills',
					key: `chillpills${id}`
				}
			};
		}
		let time = 30000;//30s
		let timeout = "You did not respond in time; the command has been cancelled."
		let filter = m => m.author.id == message.author.id;
		message.channel.send("Please enter the name of the item you wish to trade, accompanied with the amount. Example: `chillpills 100`");
		const initialData = await message.channel.awaitMessages(filter, {
			max: 1,
			time: time,
			errors: ['time']
		}).catch(() => { return message.channel.send(timeout) });

		const initialDataArray = initialData.first().content.split(/ +/);
		const item = initialDataArray[0].toLowerCase();
		const amt = Number(initialDataArray[1]);
		if (!item || (isNaN(amt))) return message.channel.send("You did not specify a valid input; a valid input would be something like `chillpills 100`");
		const user1 = {
			user: message.author,
			data: {
				trading: {
					item: {
						name: item,
						amt: amt,
					},
				}
			}
		} 

		message.channel.send(`item=${item}\namt=${amt}`)

		user1.data.trading.item.key = identifyKey(user1.data.trading.item.name.toLowerCase(), user1.user.id).key;
		user1.data.trading.item.OFFICIAL_NAME = identifyKey(user1.data.trading.item.name.toLowerCase(), user1.user.id).name;

		await message.channel.send("Please mention a user who you'd like to trade with!");

		const userIdentified = await message.channel.awaitMessages(filter, { max: 1, time: time, errors: ['time'] }).catch(() => { return message.channel.send(timeout) });
		const mem = message.guild.member(await client.usr(userIdentified.first().content.toLowerCase()));
		if (!mem) return message.channel.send("You did not mention a valid user!");
		
		message.channel.send("User Identified: " + mem.user.tag)
		
		message.channel.send(`Hey ${mem}, ${message.author.tag} wants to trade ${amt} ${user1.data.trading.item.OFFICIAL_NAME} with you!\nWhat do you want to trade with them? Please respond with a valid item name followed by the amount!`);
		let filter2 = m => m.author.id == mem.user.id;
		const user2init = await message.channel.awaitMessages(filter2, { max: 1, time: time, errors: ['time'] }).catch(() => { return message.channel.send(timeout) });

		const user2initArr = user2init.first().content.split(/ +/);
		const user2Item = user2initArr[0].toLowerCase();
		const user2Amt = Number(user2initArr[1]);
		if ((!user2Item) || (isNaN(user2Amt))) return message.channel.send("You did not specify a valid input; a valid input would be something like `chillpills 100`");

		const user2 = {
			user: mem.user,
			data: {
				trading: {
					item: {
						name: user2Item,
						amt: user2Amt,
					},
				}
			}
		}; 
		
		user2.data.trading.item.key = identifyKey(user2.data.trading.item.name.toLowerCase(), user2.user.id).key;
		user2.data.trading.item.OFFICIAL_NAME = identifyKey(user2.data.trading.item.name.toLowerCase(), user2.user.id).name;
		message.channel.send(`user 2 is trading:\n\nitem=${user2.data.trading.item.name}\namt=${user2.data.trading.item.amt}`);

		message.channel.send("Are you willing to participate in this trade? (`y` / `n`)", {
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.addField(`${message.author.tag} is trading:`, `${user1.data.trading.item.OFFICIAL_NAME} - ${user1.data.trading.item.amt}`, true)
			.addField(`${user2.user.tag} is trading:`, `${user2.data.trading.item.OFFICIAL_NAME} - ${user2.data.trading.item.amt}`, true)
		});
		const user1Acc = await message.channel.awaitMessages(filter, {
			max: 1,
			time: time,
			errors: ['time']
		}).catch(() => { return message.channel.send(timeout) });
		let content = user1Acc.first().content;
		if (!content.toLowerCase().startsWith('y') || (!user1Acc.size)) {
			return message.channel.send('ight boss, canceled the trade.');
		};
		// user2 accept-trade
		message.channel.send(`${user2.user} Are you willing to participate in this trade? (\`y\` / \`n\`)`, {
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.addField(`${message.author.tag} is trading:`, `${user1.data.trading.item.OFFICIAL_NAME} - ${user1.data.trading.item.amt}`, true)
			.addField(`${user2.user.tag} is trading:`, `${user2.data.trading.item.OFFICIAL_NAME} - ${user2.data.trading.item.amt}`, true)
		})
		const user2Acc = await message.channel.awaitMessages(filter2, {
			max: 1,
			time: time,
			errors: ['time']
		}).catch(() => { return message.channel.send(timeout) });
		let content2 = user2Acc.first().content;
		if (!content2.toLowerCase().startsWith('y') || (!user2Acc.size)) {
			return message.channel.send('ight boss, canceled the trade.');
		};
		const msg = await message.channel.send("Arranging the final preperations...")
		await delay(2000)
		msg.edit("**[REMOVING]** User 1's trade...");
		const ms = Date.now();
		 user1.data.trading.item.hasEnough = false;
		 let amountOfItem = await client.db.get(user1.data.trading.item.key) || 0;
		 	amountOfItem = Number(amountOfItem)
		 if ((amountOfItem - user1.data.trading.item.amt) < 0) {
			 user1.data.trading.item.hasEnough = false;
			 return msg.edit(`${client.config.emoji.red} ${message.author} does not have enough ${user1.data.trading.item.OFFICIAL_NAME} to make this trade!`);
		 } else {
			 user1.data.trading.item.hasEnough = true;
		 };
		 msg.edit("**[REMOVED]** User 1's trade\nNow started removing User 2's trade!");
		 let newAmountOfItemForUser1 = Number(amountOfItem - user1.data.trading.item.amt);
		 await client.db.set(user1.data.trading.item.key, newAmountOfItemForUser1);
		//remove what user2 had traded from user 2
		/**
		 * 2 users; they both make a trade; what user 1 traded is removed from user1 and added to user2; what user2 traded is removed from user2 and added to user1.
		 */
			//remove items from both users.
		 user2.data.trading.item.hasEnough = false;
		 let amountOfItem2 = await client.db.get(user2.data.trading.item.key) || 0;
		 	amountOfItem2 = Number(amountOfItem2)
		 if ((amountOfItem2 - user2.data.trading.item.amt) < 0) {
			 user2.data.trading.item.hasEnough = false;
				let amountOfItemToReturn = await client.db.get(user1.data.trading.item.key) || 0;
						amountOfItemToReturn = Number(amountOfItemToReturn) + user1.data.trading.item.amt;
				await client.db.set(user1.data.trading.item.key, amountOfItemToReturn);
			 return message.channel.send(`${user2.user} does not have enough ${user2.data.trading.item.OFFICIAL_NAME} to make this trade; ${identifyKey(user1.data.trading.item.name, user1.user.id).name} have been returned to you!`);
		 } else {
			 user2.data.trading.item.hasEnough = true;
		 };
		 let newAmountOfItemForUser2 = Number(amountOfItem2 - user2.data.trading.item.amt);
		 await client.db.set(user2.data.trading.item.key, newAmountOfItemForUser2);
		 msg.edit("**[REMOVED]** Both users' trades; now adding items...");

		//add item to both users;
		//give to user1.
		let user1old = await client.db.get(identifyKey(user2.data.trading.item.name, user1.user.id).key) || 0;
			user1old = Number(user1old);
		let user1gained = Number(user1old + user2.data.trading.item.amt);
		await client.db.set(identifyKey(user2.data.trading.item.name, user1.user.id).key, user1gained)	
		 msg.edit("**[ADDED]** User 1's gained items; now adding user 2's...");
		 //give to user2
		let User2old = await client.db.get(identifyKey(user1.data.trading.item.name, user2.user.id).key) || 0;
			User2old = Number(User2old);
		let user2gained = Number(User2old + user2.data.trading.item.amt);
		await client.db.set(identifyKey(user1.data.trading.item.name, user2.user.id).key, user2gained)	
		
		const emb = new MessageEmbed()
		.setColor(message.author.color)
		.addField(`${user1.user.tag} Lost`, `${user1.data.trading.item.OFFICIAL_NAME} ${user1.data.trading.item.amt}`, true)
		.addField(`${user2.user.tag} Lost`, `${user2.data.trading.item.OFFICIAL_NAME} ${user2.data.trading.item.amt}`, true)
		.addField('\u200b', '\u200b', false)
		.addField(`${user1.user.tag} Gained`, `${user2.data.trading.item.OFFICIAL_NAME} ${user2.data.trading.item.amt}`, true)
		.addField(`${user2.user.tag} Gained`, `${user1.data.trading.item.OFFICIAL_NAME} ${user1.data.trading.item.amt}`, true)

		 msg.edit("**[SUCCESS]** Trade completed in " + eval(Date.now() - ms) + " MS");		
		 message.channel.send({ embed: emb }) 
	}
}