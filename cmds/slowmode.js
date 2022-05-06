const Discord = require('discord.js');

module.exports = {
	name: "slowmode",
	aliases: ["slow", 'slowmode'],
	category: 'own',
	cst: "moderator",
	usage: 'slowmode <number of seconds>',
	description: 'Sert slowmode for the current channel, minimum 1 second and maximum 21600 seconds (6 hours)',
async run(client, message, args) {
		let msg = await message.channel.send(`One moment please...`)
		if (!message.member.permissions.has('MANAGE_CHANNELS')) {
			return msg.edit("You do not have permission to use this command!")
		} else {
			if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
				return msg.edit("I do not have permissions to set slowmode for this channel! Please check my role permissions!")
			} else {
				let count = args[0];
				if (!count) {
					return msg.edit("You need to provide a number for slowmode!");
				} else {
					let newCount = Number(count);
					if (isNaN(newCount)) {
						return msg.edit("Please give an actual number noob")
					} else {
						message.channel.setRateLimitPerUser(newCount)
							.catch((err) => {
								return msg.edit("Sorry, there was an error")
							})
						if(newCount == '0' || newCount == 0) {
							return msg.edit(`${client.config.emoji.tick} Slowmode has been disabled for ${message.channel}`)
						} 
						return msg.edit(client.config.emoji.tick + " I have set slowmode for `" + newCount + "` seconds!")
					};
				};
			};
		};
	},
}