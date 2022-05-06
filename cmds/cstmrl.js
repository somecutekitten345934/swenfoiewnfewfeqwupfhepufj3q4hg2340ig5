const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'cstmrl',
    category: 'utl',    
    aliases: ['cstmrl', 'cstmrls', 'roles'],
    description: 'Lists all of your assignable roles along with their keywords and names',
    async run(client, message, args = []) {
		if(message.guild.id == client.config.guildserver){
			if (!args.length) args[0] = message.author.id;
			let usr = await client.usr(args[0]).catch((x) => {});
			if (!usr) usr = message.author; 
			let roles = await client.db.get('cstmrlw' + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any roles in Weebineers! To create one they cost ${client.config.emoji.coin} 7,500,000 (Weebchan Currency). Contact SemiMute#6630 to purchase!`);
			roles = client.listToMatrix(roles.split(";"), 2);
			let resp = roles.map((x) => `    "${x[0]}": "${message.guild.roles.cache.get(x[1]) ? message.guild.roles.cache.get(x[1]).name : "<UNKNOWN ROLE>"}"`).join(',\n');
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${usr.tag}'s Custom Roles (${roles.length} currently owned)`)
				.setDescription(`You may assign roles displayed here to users in Weebineers\n\`${message.guild.prefix}role <role> <user>\` to add/remove a role from a user (support server only)\n\`${message.guild.prefix}rolecolor <role> <color>\` to edit a role's colour\n\`${message.guild.prefix}rolename <role> <new name>\` to edit a role's name\`\`\`\n{\n${resp || "[ NONE lol ]"}\n}\n\`\`\``)
				]})
			return;
		} else if (message.guild.id == client.config.supportServer){
			if (message.guild.id != client.config.supportServer) return message.channel.send("This command only works in Weebineers Haven! Why not join it though? " + client.config.ssInvite);
			if (!args.length) args[0] = message.author.id;
			let usr = await client.usr(args[0]).catch((x) => {});
			if (!usr) usr = message.author; 
			let roles = await client.db.get('cstmrl' + message.author.id);
			if (!roles) return message.channel.send(`${client.config.emoji.err} You do not own any custom roles.`);
			roles = client.listToMatrix(roles.split(";"), 2);
			let resp = roles.map((x) => `    "${x[0]}": "${message.guild.roles.cache.get(x[1]) ? message.guild.roles.cache.get(x[1]).name : "<UNKNOWN ROLE>"}"`).join(',\n');
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${usr.tag}'s Custom Roles (${roles.length} currently owned)`)
				.setDescription(`You may assign roles displayed here to users in the support server\n\`${message.guild.prefix}role <role> <user>\` to add/remove a role from a user (support server only)\n\`${message.guild.prefix}rolecolor <role> <color>\` to edit a role's colour\n\`${message.guild.prefix}rolename <role> <new name>\` to edit a role's name\`\`\`\n{\n${resp || "[ NONE lol ]"}\n}\n\`\`\``)
				]})
		} else {
			return message.channel.send("This command only works in Weebineers Haven! Why not join it though? " + client.config.ssInvite);
		}
	}
}