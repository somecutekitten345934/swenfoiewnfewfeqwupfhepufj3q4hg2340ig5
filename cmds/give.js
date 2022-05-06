const Discord = require('discord.js');
const { detDependencies } = require('mathjs');

module.exports = {
	name: 'give',
	aliases: ['give', 'gv'],
	description: 'add permissions to users.',
	category: 'own',
	cst: "give",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.channel.send(`You must follow the following format: \`${message.guild.prefix}give <user> <...upgrade | "role name">\``);
		};
		const permission = args.slice(1).join(' ');
		const usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) return message.channel.send("Try running the command again, this time actually ping a user llolololololl");

		if(permission.includes("botowner999") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may have the \`botowner999\` cst! Modifying your data to include this will result in a blacklist.`)
		}
		if(permission.includes("administrator132465798") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may give the` + " `administrator132465798` cst! Modifying your own or other people's cst to include this will not end well!")
		}
		if(permission.includes("botdeveloper") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may give the` + " `botdeveloper` cst! Modifying your own or other people's cst to include this will not end well!")
		}
		if(args[1] == "milk"){
			let milk = await client.db.get(`milk${usr.id}`) || 0;
			milk = Number(milk)
			let give = args[2]
			let petaliases = await client.db.get(`petaliases${usr.id}`) || ""
			if(!petaliases.includes(`Neko`)) { return message.channel.send(`${client.config.emoji.err} ${usr.tag} does not have access to the Neko alias!`)}
			if(isNaN(give)){
				return message.channel.send(`${client.config.emoji.err} "${args[2]}" is not a valid number!`)
			}
			let nmilk = milk + give
			await client.db.set(`milk${usr.id}`, nmilk)
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`:milk: ${client.comma(give)} have been added to ${usr.tag}'s fridge for their neko!`)]					
			});	
		}
		if (!isNaN(args[1])) {
			let bal = await client.db.get("bal" + usr.id) || "0";
					bal = Number(bal);
			let amt = Number(args[1]);
			bal += amt;
			await client.db.set("bal" + usr.id, bal);
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.coin} ${client.comma(amt)} have been added to ${usr.tag}'s account`)]					
			});			
		};

		let val = args.slice(1).join(" ");
		let cst = await client.db.get("cst" + usr.id);
				cst = cst ? cst.split(";") : [];
		const mem = await client.guilds.cache.get(client.config.supportServer).members.fetch(usr.id).catch((err) => {});
		let role = client.guilds.cache.get(client.config.supportServer).roles.cache.find((f) => f.name.toLowerCase() == val.toLowerCase());
		if (role) {
			if (!mem) {
				let incl = false;
				for (f of cst) {
					if (incl == true) return;
					if (client.guilds.cache.get(client.config.supportServer).roles.cache.get(f)) {
						if (f == val.toLowerCase()) incl = true;
					};
				};
				if (incl == false) cst.push(role.id);
			} else {
				mem.roles.add(role.id);
			};
		};
		if(cst.includes(val)){
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} already has the ${val} cst so nothing changed`)]
			});
		}
		cst.push(val);
		await client.db.set("cst" + usr.id, cst.join(";"))
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag} has received ${val}`)]
		});
	},
};