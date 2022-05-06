const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'role',
	aliases: ['role'],
	category: 'custom',
	description: "adds/removes a role from someone only if you own an assignable role :D",
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`)
		cst = cst.split(`;`)
		if(message.guild.id == client.config.guildserver){
			if (args.length < 2) return message.channel.send("You must provide a valid role keyword followed by the target user!")
			let roles = await client.db.get('cstmrlw' + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any custom roles. To create one they cost ${client.config.emoji.coin} 7,500,000 (Weebchan Currency). Contact SemiMute#6630 to purchase!`);
	
			roles = client.listToMatrix(roles.split(";"), 2);
			let key = args[0].toLowerCase();
			let kw = roles.map((x) => x[0]);
			if (!kw.includes(key)) {
				return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
			};
	
			let role = roles.find((x) => x[0] == key);
				role = message.guild.roles.cache.get(role[1]);
			let usr = await client.usr(args[1]).catch((x) => {})
			if (!usr) return message.channel.send("You didn't specify a user??!!")
	
			let guildMember = message.guild.members.cache.get(usr.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${usr.tag} is not a member of this server`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has lost the ${role.name} role`)]
				});
			};
		
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received the ${role.name} role`)]
				});
			};
		} else if(message.guild.id == client.config.supportServer){
			if (args.length < 2) return message.channel.send("You must provide a valid role keyword followed by the target user!")
			let roles = await client.db.get('cstmrl' + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any custom roles.`);
	
			roles = client.listToMatrix(roles.split(";"), 2);
			let key = args[0].toLowerCase();
			let kw = roles.map((x) => x[0]);
			if (!kw.includes(key)) {
				return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
			};
	
			let role = roles.find((x) => x[0] == key);
				role = message.guild.roles.cache.get(role[1]);
			let usr = await client.usr(args[1]).catch((x) => {})
			if (!usr) return message.channel.send("You didn't specify a user??!!")
	
			let guildMember = message.guild.members.cache.get(usr.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${usr.tag} is not a member of this server`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has lost the ${role.name} role`)]
				});
			};
		
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received the ${role.name} role`)]
				});
			};
		} else {
			return message.channel.send("This command only works in the support server as a result of how role information is manipulated.");
		}
	
	},
};