const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = {
	name: 'drink',
	aliases: ['drink', 'consume', "dose"],
	description: 'Drink a consumable',
	category: 'ecn',	
	async run(client, message, args) {
		if (!args.length) return message.channel.send(`The different types of consumables are: \`dark\`, \`haste\``)
		let dose = args[0].toLowerCase();
		if (dose.startsWith("dark")) {
			let cd = await client.db.get("dose0" + message.author.id);
				if (cd) {
					let time = client.cooldown(message.createdTimestamp, cd);
					if (time) {
						return message.channel.send(`You should wait ${time} before consuming another ${client.config.emoji.chill}`);
					};
				};
			let x = await client.db.get(`chillpills${message.author.id}`) || 0;
			if (Number(x) == 0) {
				return message.channel.send(`${client.config.emoji.chill} You don't have any potions of darkness!`)
			};
			await client.db.set(`chillpills${message.author.id}`, Number(x - 1));
			await client.db.delete(`strokec${message.author.id}`);		
			await client.db.delete(`sentc${message.author.id}`);
			await client.db.delete("robc" + message.author.id);
			await client.db.delete(`fdc${message.author.id}`);
			await client.db.delete(`dprvc${message.author.id}`);
			await client.db.delete(`dose1${message.author.id}`)
			await client.db.delete(`plasmac${message.author.id}`)


			message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has consumed 1 ${client.config.emoji.chill}; most of your cooldowns have been cleared!`)
			})
			await client.db.set(`dose0${message.author.id}`, (message.createdTimestamp + ms("6h")) - client.config.epoch, ms("6h"));
		}
		if (dose.startsWith("sake")) {
			let cst = await client.db.get(`cst${message.author.id}`)
			cst = cst.split(`;`)
			if(!cst.includes(`DEVELOPER_RING`)){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setDescription(`${client.config.emoji.err} You need the **DEVELOPER_RING** in order to drink <:Sake:819097578376659014>!`)]
				})
			}
			let cd = await client.db.get("dose0" + message.author.id);
				if (cd) {
					let time = client.cooldown(message.createdTimestamp, cd);
					if (time) {
						return message.channel.send(`You should wait ${time} before drinking another <:Sake:819097578376659014>`);
					};
				};
			let x = await client.db.get(`sake${message.author.id}`) || 0;
			if (Number(x) == 0) {
				return message.channel.send(`${client.config.emoji.chill} You don't have any <:Sake:819097578376659014> to drink!`)
			};
			await client.db.set(`chillpills${message.author.id}`, Number(x - 1));
			await client.db.delete(`strokec${message.author.id}`);		
			await client.db.delete(`sentc${message.author.id}`);
			await client.db.delete("robc" + message.author.id);
			await client.db.delete(`fdc${message.author.id}`);
			await client.db.delete(`dprvc${message.author.id}`);
			await client.db.delete(`dose1${message.author.id}`)
			await client.db.delete(`plasmac${message.author.id}`)


			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has consumed 1 <:Sake:819097578376659014>; most of your cooldowns have been cleared!`)]
			})
		}
		if (dose.startsWith("haste")) {
			let cd = await client.db.get("dose1" + message.author.id);
				if (cd) {
					let time = client.cooldown(message.createdTimestamp, cd);
					if (time) {
						return message.channel.send(`You should wait ${time} before consuming another ${client.config.emoji.phaste}`);
					};
				};
			let x = await client.db.get(`phaste${message.author.id}`) || 0;
			if (Number(x) == 0) {
				return message.channel.send(`${client.config.emoji.phaste} You don't have any potions of haste! Try buying one from` + " `;shop`")
			};
			await client.db.set(`phaste${message.author.id}`, Number(x - 1));

			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has drunk 1 ${client.config.emoji.phaste}; Their mining cooldown has been reduced for 5 minutes!`)]
			})
			await client.db.set(`dose1${message.author.id}`, (message.createdTimestamp + ms("30m")) - client.config.epoch, ms("30m"));
			await client.db.set(`dose1d${message.author.id}`, (message.createdTimestamp + ms("5m")) - client.config.epoch, ms("5m"));
		}
	}
}