const Discord = require('discord.js');

module.exports = {
	name: 'reload',
	aliases: ['r', 'reload'],
	description: 'Reloads a command',
	category: 'botdeveloper',
	usage: 'reload <command name or alias>',
	async run(client, message, args) {
		if(message.author.id !== client.config.owner){ return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.green)
			.setTitle(`Insufficient Permissions!`)
			.setDescription(`Sorry, but I can't let you use this command.. maybe try a different one?`)
			.setThumbnail(client.config.thumbnail.error)]
		}); }
		const msg = await message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.green)
			.setTitle(`Weebchan is thinking...`)
			.setDescription(`Validating input & performing actions...`)
			.setThumbnail(client.config.thumbnail.question)]
		});
		const { commands } = client;
		if (!args.length) return msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Invalid Arugments!`)
			.setDescription(`I can't reload anything if you dont tell me what to reload!`)
			.setThumbnail(client.config.thumbnail.question)]
		});
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return msg.edit({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid Command!`)
				.setDescription(`I dont remember that command... try a valid one!`)
				.setThumbnail(client.config.thumbnail.question)]
			});
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			return msg.edit({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.error)
				.setTitle(`An Error Occurred!`)
				.setDescription(`I encountered an error whilst attempting to reload the **${command.name}** command; \n\n**ERROR:**\`\`\`js\n${error.message}\`\`\``)]
			});
		}
		msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.green)
			.setThumbnail(client.config.thumbnail.thumbsup)
			.setTitle(`Reload Success!`)
			.setDescription(`I have reloaded the command **${command.name}** in **${Date.now() - message.createdAt} MS**`)]
		})
	},
};