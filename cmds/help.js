const { MessageEmbed, EscapeMarkdown } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'help',
	aliases: ['help', 'helpme', 'cmdhelp', "commands", "cmds"],
	description: "*helps* you?",
	async run(client, message, args) {
		if (args.length) {
			let arg = args[0].toLowerCase()
			if(arg == "econ" || arg == "economy" || arg == "ecn" || arg == "eco"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Economy`)
					.setColor(message.author.color)
					.setDescription(`Become the richest adventuerer on Weebchan by gaining ${client.config.emoji.coin}, Weebchan's currency!`)
					.addField(`${client.config.emoji.coin} Economy Commands`, client.commands.filter((x) => x.category === 'ecn').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "social"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Social`)
					.setColor(message.author.color)
					.setDescription(`Interact with your friends!`)
					.addField(`<:weeblove:875880883805122570> Social Commands`, client.commands.filter((x) => x.category === 'social').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "waifu"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Waifu`)
					.setColor(message.author.color)
					.setDescription(`Train your waifu to be the best!`)
					.addField(`<:weebpat:862132432287039508> Waifu Commands`, client.commands.filter((x) => x.category === 'pet').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "nsfw"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: NSFW`)
					.setColor(message.author.color)
					.setDescription(`Use naughty commands in an NSFW channel :D`)
					.addField(`NSFW Commands`, client.commands.filter((x) => x.category === 'nsfw').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "fun"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Fun`)
					.setColor(message.author.color)
					.setDescription(`Get some entertainment in your life!`)
					.addField(`Fun Commands`, client.commands.filter((x) => x.category === 'fun').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "util" || arg == "utl" || arg == "utility"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Utility`)
					.setColor(message.author.color)
					.setDescription(`Some helpful commands for different situations`)
					.addField(`Utility Commands`, client.commands.filter((x) => x.category === 'utl').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "info"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Info`)
					.setColor(message.author.color)
					.setDescription(`View some information`)
					.addField(`Info Commands`, client.commands.filter((x) => x.category === 'info').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "custom" || arg == "customizations" || arg == "cstm"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Customization`)
					.setColor(message.author.color)
					.setDescription(`Customize your Weebchan experience`)
					.addField(`Customization Commands`, client.commands.filter((x) => x.category === 'custom').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			if(arg == "server"){
				message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Weebchan Help: Server`)
					.setColor(message.author.color)
					.setDescription(`Server sided commands that dont affect the global aspects of the bot`)
					.addField(`Server Commands`, client.commands.filter((x) => x.category === 'server').map((x) => `\`${x.name}\``).join(', '))
					.setFooter(`View specific command info via ${message.guild.prefix}help <command>`)]
				})
				return;
			}
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

			if (!command) return message.channel.send("Please try to include a valid category or specific command!");

			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(message.author.displayAvatarURL())
				.setFooter(`Requested by ${message.author.tag}`)
				.setTitle('Command Help | ' + command.name)
				.setDescription(command.description)
				.addField("Aliases", command.aliases.join(', '))]
			})
		};
	message.channel.send({
		embeds: [new MessageEmbed()
		.setTitle(`${client.user.username}'s Command Help`)
		.setDescription(`**NOTE!**: This bot is in **BETA** and features may be incomplete or buggy!\n\n- To view our **PRIVACY POLICY** do \`${message.guild.prefix}privacy\`\n- To view a specific category or command, do \`${message.guild.prefix}help <category/command>\``)
		.addField(`${client.config.emoji.coin} ECONOMY`, `\`${message.guild.prefix}help economy\``, true)
		.addField(`<:weeblove:875880883805122570> SOCIAL`, `\`${message.guild.prefix}help social\``, true)
		.addField(`<:weebpat:862132432287039508> WAIFU`, `\`${message.guild.prefix}help waifu\``, true)
		.addField(`NSFW`, `\`${message.guild.prefix}help nsfw\``, true)
		.addField(`FUN`, `\`${message.guild.prefix}help fun\``, true)
		.addField(`UTILITY`, `\`${message.guild.prefix}help utility\``, true)
		.addField(`INFO`, `\`${message.guild.prefix}help info\``, true)
		.addField(`CUSTOMIZATIONS`, `\`${message.guild.prefix}help custom\``, true)
		.addField(`SERVER COMMANDS`, `\`${message.guild.prefix}help server\``, true)]
	})
}
}