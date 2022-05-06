const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ptransfer',
	aliases: ['ptransfer', "transferitm"],
	description: "Transfers one of your owned items to another user; 2 hours' cooldown",
	category: 'utl',
	disabled: true,
	async run(client, message, args) {
		return message.channel.reply(`This system will be reintroduced in the future :)`)
		if (args.length < 2) return message.channel.send(`Please use the following format: \`${message.guild.prefix}transferitm <user> <item>\``);
		const user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send("You must mention a user!")
		let cst = await client.db.get("cst" + message.author.id);
		let userCst = await client.db.get("cst" + user.id);
		cst = cst ? cst.split(";") : [];
		userCst = userCst ? userCst.split(";") : [];
		const item = args[1].toLowerCase();
		let res = client.config.ditems.findIndex((i) => item.startsWith(i.split(";")[0]));
		if (res < 0) return message.channel.send(`The different types of ditems which you can transfer are: ${client.list(client.config.ditems.map((i) => i.split(";")[1]))}`)		

		const name = client.config.ditems[res].split(";")[1];
		const role = client.config.ditems[res].split(";")[2];
		const ss = await client.guilds.cache.get(client.config.supportServer).members.fetch(user.id).catch((x) => {})
		const authorSS = await client.guilds.cache.get(client.config.supportServer).members.fetch(message.author.id).catch((x) => {});		

		if (!cst.includes(name)) return message.channel.send(`You don't currently possess a ${name} on this account; you cannot transfer it to others.`);
		if (userCst.includes(name)) return message.channel.send(`That user already has ${name}.`);
		cst = cst.filter((e) => ![name].includes(e));
		userCst.push(name);
		await client.db.set("cst" + message.author.id, cst.join(";"));
		await client.db.set("cst" + user.id, userCst.join(";"));
		authorSS.roles.remove(role)
			.catch((x) => {})
		if (ss) {
			ss.roles.add(role)
				.catch((x) => {})
		};
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully transferred "${name}" to ${user.tag}`)
		});
	},	
};