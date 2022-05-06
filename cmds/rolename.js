const Discord = require('discord.js');

module.exports = {
	name: 'rolename',
	aliases: ["rolename", 'rolename','rn'],
	category: 'custom',
	description: "Change the name of your assignable role!",
	async run(client, message, args) {
		if(message.guild.id == client.config.guildserver){
			if (args.length < 2) {
				return message.channel.send("You must specify a valid role keyword and a new role name under the format of `" + message.guild.prefix + "rolename <keyword> <new name>`");		
			};
			let roles = await client.db.get("cstmrlw" + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any custom roles. `);
	
			roles = client.listToMatrix(roles.split(";"), 2);
			let key = args[0].toLowerCase();
			let kw = roles.map((x) => x[0]);
			if (!kw.includes(key)) {
				return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
			};
			let role = roles.find((x) => x[0] == key);
	
			let name = args.slice(1).join(' ').slice(0, 100);
			if (!name) return message.channel.send("You must specify a new role name in order for this command to work! (max rolename length is 500 chars)")
	
			let Role = message.guild.roles.cache.get(role[1]);
			let rname = Role.name;
			if (!Role) return message.channel.send(`${client.config.emoji.err} I cannot find your custom role!`);
			let arg2 = args[1].toLowerCase()
			if(arg2 == "dj"){
				return message.channel.send(`${client.config.emoji.err} That role name is not allowed!`)
			}
			Role.setName(name);
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setDescription(`Successfully renamed the ${rname} role to "${name}"`)
				.setColor(message.author.color)]
			});
		} else if(message.guild.id == client.config.supportServer){
			if (args.length < 2) {
				return message.channel.send("You must specify a valid role keyword and a new role name under the format of `" + message.guild.prefix + "rolename <keyword> <new name>`");		
			};
			let roles = await client.db.get("cstmrl" + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any custom roles. `);
	
			roles = client.listToMatrix(roles.split(";"), 2);
			let key = args[0].toLowerCase();
			let kw = roles.map((x) => x[0]);
			if (!kw.includes(key)) {
				return message.channel.send("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
			};
			let role = roles.find((x) => x[0] == key);
	
			let name = args.slice(1).join(' ').slice(0, 100);
			if (!name) return message.channel.send("You must specify a new role name in order for this command to work! (max rolename length is 500 chars)")
	
			let Role = message.guild.roles.cache.get(role[1]);
			let rname = Role.name;
			if (!Role) return message.channel.send(`${client.config.emoji.err} I cannot find your custom role!`);
			let arg2 = args[1].toLowerCase()
			if(arg2 == "dj"){
				return message.channel.send(`${client.config.emoji.err} That role name is not allowed!`)
			}
			Role.setName(name);
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setDescription(`Successfully renamed the ${rname} role to "${name}"`)
				.setColor(message.author.color)]
			});
		} else {
			return message.channel.send("This command only works in the support server as a result of how role information is manipulated.");	
		}
	},
};