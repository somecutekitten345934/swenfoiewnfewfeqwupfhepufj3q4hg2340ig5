const Discord = require('discord.js');

module.exports = {
	name: 'take',
	aliases: ['take'],
	description: 'removes permissions to users.',
	category: 'own',
	cst: "take",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.channel.send(`You must follow the following format: \`${message.guild.prefix}take <user> <...upgrade | "role name">\``);
		};
		const permission = args.slice(1).join(' ');
		const usr = await client.usr(args[0]).catch((x) => {});

		if(args[1] == "blckw" && (!["501710994293129216", client.config.owner].includes(message.author.id))) {
			return message.channel.send(`${client.config.emoji.err} Modifying this CST is not permitted. Further tampering with this CST will result in a datawipe! This includes using` + " `;set`!")
		}
		if(usr == client.config.owner && (message.author.id != client.config.owner)){
			return message.channel.send(`${client.config.emoji.err} You are not permitted to remove any CSTs from SemiMute#6630! Tampering further with their data will result in you being blacklisted.`)
		}
		if (!usr) return message.channel.send("Try running the command again, this time actually ping a user llolololololl");

		if (!isNaN(args[1])) {
			let bal = await client.db.get("bal" + usr.id) || "0";
				bal = Number(bal);
			let amt = Number(args[1]);
				bal -= amt;
			await client.db.set("bal" + usr.id, bal);
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.coin} ${client.comma(amt)} have been removed from ${usr.tag}'s account`)]			
			});			
		};

		let cst = await client.db.get("cst" + usr.id);
			cst = cst ? cst.split(";") : [];
		const mem = await client.guilds.cache.get(client.config.supportServer).members.fetch(usr.id).catch((err) => {});
		let role = client.guilds.cache.get(client.config.supportServer).roles.cache.find((r) => r.name.toLowerCase() == permission.toLowerCase());
		if (mem && (role)) {
			mem.roles.remove(role.id);
		} else if (role) {
			for (f of cst) {
				if (client.guilds.cache.get(client.config.supportServer).roles.cache.get(f) && (f == role.id)) {
					cst = cst.filter((x) => x != f);
				};
			};
		};
		cst = cst.filter(x => ![permission].includes(x)).join(";");
		await client.db.set("cst" + usr.id, cst);
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setDescription(`${usr.tag} has lost ${permission}`)
			.setColor(message.author.color)]
		});
	},
};