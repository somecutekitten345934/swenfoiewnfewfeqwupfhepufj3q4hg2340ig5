const { MessageEmbed } = require('discord.js');
require('keyv');
const ms = require('ms');
const delay = require('delay');

module.exports = {
	name: 'pay',
	aliases: ['pay'],
	category: 'ecn',
	description: 'Pay someone else Weebchan Coins\n\nTo pay someone your entire balance, use `all`',
	usage: 'pay <user> <amount>',
	async run(client, message, args) {
		let data = await client.db.get(`cst${message.author.id}`) || ""
		data = data.split(`;`)

		let pet = await client.db.get(`pet${message.author.id}`) || "1;10000;100;0;1;1;1;1;0;1"
		pet = pet.split(`;`)
		let level = pet[0]
		let history = await client.db.get(`payhist${message.author.id}`) || `${message.author.id};0`
		history = history.split(`;`)
		client.usr = async function (str) {
			str = str.toString();
			if (!str) return;
			let usr;
			try {
				usr = await client.users.fetch(client.getID(str))
			} catch (err) {
				usr = await client.users.fetch(str).catch((x) => {})
			};	
			return usr;
		}
        let cmds = await client.db.get(`cmds${message.author.id}`)
		let rand = Math.floor(Math.random() * (1500 - 250 + 1)) + 250;
		if(level < 14 && !data.includes(`administrator132465798`)){
			return message.channel.send({ embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(client.config.thumbnail.pout)
				.setTitle(`System Locked!`)
				.setDescription(`I'm sorry, but you are not allowed to use the payment system quite yet! Continue to use Weebchan to be able to unlock it later!`)
			]})
		}
		/**
		 * Tells the `user` they don't have enough money t pay someone else.
		 */
		function notEnough() {
			return message.channel.send({ embeds: [new MessageEmbed().setColor(message.author.color).setDescription(`You don't have enough ${client.config.emoji.coin} in your bank!`)]})
		}
		let authorBal = await client.db.get('bal' + message.author.id) || 0;
			authorBal = Number(authorBal)
		if (!args.length) return message.channel.send("You must tell me who to transfer money to!");
			let usr = await client.usr(args[0]).catch((x) => {})
			if(!usr){
				return message.channel.send(`Sorry, but thats an invalid user!`)
			}
			let tpet = await client.db.get(`pet${usr.id}`) || "1;10000;100;0;1;1;1;1;0;1"
			if (usr.bot == true) {
				tpet = "9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999";			};
			tpet = tpet.split(`;`)
			let tlevel = tpet[0]
			if(tlevel < 6){
				return message.channel.send({ embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setThumbnail(client.config.thumbnail.pout)
					.setTitle(`System Locked!`)
					.setDescription(`I'm sorry, but ${usr.tag} is too new to receive payments! Tell them to continue to use Weebchan to be able to unlock it later!`)
				]})
			}
			if(usr == "861209428066172939"){
					return message.reply(`Why would I want your coins? Pay someone else!`)
				}
			if (!usr) return message.channel.send("Whoops! I can't find that user");
			if (message.author.id == usr.id) return message.channel.send(`You can't pay yourself!`);
			if (!args[1]) return message.channel.send(`You must specify the amount of ${client.config.emoji.coin} you wish to pay ${usr.username}`);
		let amt = args[1].toLowerCase();
		if (amt.toString().startsWith('all')) amt = authorBal;
    if (amt.toString().startsWith('half')) amt = authorBal / 2;
		amt = Number(amt);
		amt = Math.trunc(amt);
		if (amt < 1) return message.channel.send("You must enter a positive number.");
		//console.log(amt, typeof Number(amt)) // => 10, Number
		if (isNaN(amt) && (!amt.startsWith('all') ||!amt.startsWith('half'))) return message.channel.send("You must provide a valid number! (or just `all`|`half`)")
		if (authorBal < 0 || (!authorBal) || (Number(authorBal - amt) < 0)) return notEnough();
		const amountLeft = Number(Number(authorBal) - Number(amt));
		if (amountLeft < 0) return notEnough();
		if(usr.id == history[0] && history[0] !== message.author.id){
			let blck = Math.random() * (10 - 7) + 7
			history[1] = Number(history[1])
			history[1] = history[1] + 1
			if(history[1] >= blck){
				await client.db.set(`blckr${message.author.id}`, "[WEEBCHAN ANTICHEAT]: Account under investigation for suspicious activity")
				data.push(`blacklisted`)
				const member = client.users.cache.get(client.config.owner)
				member.send(`${message.author.tag} (${message.author.id}) has been flagged for suspicious activity and has been temporarily blacklisted until investigation\nTheir last message is as follows: ${message.content}`)
				await client.db.set(`cst${message.author.id}`, data.join(`;`))
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`WEEBCHAN CHEAT DETECTION`)
					.setThumbnail(client.config.thumbnail.banhammer)
					.setDescription(`Your account has been flagged for suspicious activity and will not be able to be used until further investigations take place. You will receive a DM from a bot administrator once the investigation has concluded.`)]
				})
			}
			await client.db.set(`payhist${message.author.id}`, history.join(`;`))
		} else {
			await client.db.set(`payhist${message.author.id}`, `${usr.id};1`)
		}
		 await client.db.set('bal' + message.author.id, amountLeft);
		let oldBal = await client.db.get('bal' + usr.id) || 0;
			oldBal = Number(oldBal)
		const newBal = Number(oldBal + amt);
		await client.db.set('bal' + usr.id, newBal)

		// BELOW - If bot gets paid any currency, removes it

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has paid ${client.config.emoji.coin} ${message.author.com == 1 ? amt : client.comma(amt)} into ${usr.tag}'s account`)]
		})
		if(amt > 100000){
			const channel = client.channels.cache.get(client.config.channels.transactions);
			channel.send(`[**PAY**] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> **(${message.author.tag}) [${message.author.id}]**: ${message.content}`)	
		}
		if (!usr) usr = await client.users.fetch("509798534204096513");{
			return await client.db.set("bal" + "509798534204096513", "0");
		}


	},
}