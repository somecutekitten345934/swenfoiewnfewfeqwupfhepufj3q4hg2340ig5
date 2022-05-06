const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addrole',
	aliases: ['addrole', 'addarole'],
	description: 'Give a user an assignable role; you must supply its ID since it will add a set role to them as-is... kinda hard to explain',
	category: 'own',
	cst: "botowner999",
	async run(client, message, args) {
		if(message.guild.id == client.config.guildserver){
			if (args.length < 3) return message.channel.send("Format: `~addarole <user> <id> <kw>`")
			let user = await client.usr(args[0]).catch((x) => {});
			if (!user) {
				return message.channel.send("User not found");
			};
			const msg = await message.channel.send(`${client.config.emoji.loading} Binding role...`)
			let id = message.guild.roles.cache.find(x => x.id == args[1]);
			if (!id) return message.channel.send('role not found');
			msg.edit(client.config.emoji.loading + "Role found; editing database values...")
			let kw = args[2].toLowerCase();
			let roles = await client.db.get("cstmrlw" + user.id);
					roles = roles ? roles.split(";") : [];
			roles.push(`${kw};${id.id}`);
			await client.db.set("cstmrlw" + user.id, roles.join(";"));
			msg.edit({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully given cstmrlw for [${id.name}] to ${user.tag}`)]
			});
		} else {
			if (args.length < 3) return message.channel.send("Format: `~addarole <user> <id> <kw>`")
			let user = await client.usr(args[0]).catch((x) => {});
			if (!user) {
				return message.channel.send("User not found");
			};
			const msg = await message.channel.send(`${client.config.emoji.loading} Binding role...`)
			let id = message.guild.roles.cache.find(x => x.id == args[1]);
			if (!id) return message.channel.send('role not found');
			msg.edit(client.config.emoji.loading + "Role found; editing database values...")
			let kw = args[2].toLowerCase();
			let roles = await client.db.get("cstmrl" + user.id);
					roles = roles ? roles.split(";") : [];
			roles.push(`${kw};${id.id}`);
			await client.db.set("cstmrl" + user.id, roles.join(";"));
			msg.edit({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully given cstmrl for [${id.name}] to ${user.tag}`)
				.setFooter(`Running ${client.user.username} v${client.config.version}`, client.config.footerIMG)]
			});			
		}
	},
};