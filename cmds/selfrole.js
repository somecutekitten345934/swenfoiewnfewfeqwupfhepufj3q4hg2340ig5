const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "selfrole",
    aliases: ["selfrole"],
    description: "Give/Take a selfrole from yourself",
    async run(client, message, args) {
		if(message.guild.id == "742257076637794344"){
			let guildMember = message.guild.members.cache.get(message.author.id);
			if(!args[0]){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setDescription(`You must give me a valid selfrole you would like to give yourself!\n
					**YEAR ROUND**
					:white_small_square: <@&795121273566134292> - \`weeb\`
					*Do you watch anime all day long? This is the role for you*
					
					**LIMITED EDITION**
					:white_small_square: Come back later for something special!`)]
				})
			}
			if(args[0].toLowerCase() == "weeb"){
				let role = message.guild.roles.cache.get(`795121273566134292`);
				if (guildMember.roles.cache.has(role.id)) {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} already has the ${role.name} role, so nothing has changed!`)]
					});
				};
				if (!guildMember.roles.cache.has(role.id)) {
					await guildMember.roles.add(role.id);
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has received the ${role.name} role`)]
					});
				};
			}
		}
        if(message.guild.id !== client.config.supportServer){ return;}
        if(!args[0]){
            return message.channel.send(`Valid self roles: \`giveaways\`, \`news\`, \`status\`, \`testchan\``)
        }
        if(args[0].toLowerCase() == "giveaways"){
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${message.author.tag} is not a member of this server?? How???`);
            let role = message.guild.roles.cache.get(`808123310810333214`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has lost the ${role.name} role`)]
				});
			};
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has received the ${role.name} role`)]
				});
			};
        }
		if(args[0].toLowerCase() == "testchan"){
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${message.author.tag} is not a member of this server?? How???`);
            let role = message.guild.roles.cache.get(`938609586817093733`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} will no longer get pinged when Testchan has new changelogs`)]
				});
			};
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} will now get pinged whenever Testchan has new changelogs!`)]
				});
			};
        }
        if(args[0].toLowerCase() == "news"){
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${message.author.tag} is not a member of this server?? How???`);
            let role = message.guild.roles.cache.get(`808123279923347476`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has lost the ${role.name} role`)]
				});
			};
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} will now get pinged for news and updates with the **${role.name}** role`)]
				});
			};
        }
        if(args[0].toLowerCase() == "status"){
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (!guildMember) return message.channel.send(`${client.config.emoji.err} ${message.author.tag} is not a member of this server?? How???`);
            let role = message.guild.roles.cache.get(`840768288522895380`);
			if (guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.remove(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has lost the ${role.name} role`)]
				});
			};
			if (!guildMember.roles.cache.has(role.id)) {
				await guildMember.roles.add(role.id);
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} will now get pinged whenever Weebchan has issues in <#808142925107560460>!`)]
				});
			};
        }
    }
}