const { MessageEmbed } = require('discord.js');
const { arg } = require('mathjs');

module.exports = {
	name: 'maintenance',
	aliases: ['maintenance', 'mm'],
	description: 'Disable the bot globally',
	category: 'botdeveloper',
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if (!cst.includes(`botdeveloper`)) 
			return message.channel.send(`${client.config.emoji.err} Did you actually think that you would be allowed to use this command? Nice one...`);
		if(!args.length) {
			return message.channel.send(`You must provide the following values: \`enable\` or \`disable\``)
		}
		let reason = args.slice(1).join(' ');
		if (!reason) reason = "Developers did not specify a reason for the maintenance!";
		let mm = await client.db.get(`maintenance509798534204096513`)
		if(args[0] == `enable`){
			if(mm !== `enabled`){
				await client.db.set(`maintenance509798534204096513`, `enabled`)
				await client.db.set(`maintenancereason509798534204096513`, reason)
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.tick} Successfully enabled maintenance mode for the reason of \`${reason}\`. Only Bot Developers may use the bot at this time until maintenance is disabled!`)]
				})
			} else {
				return message.channel.send(`${client.config.emoji.err} Maintenance is already enabled! Disable it before trying to enable it.`)
			}
		}
		if(args[0] == `disable`){
			if(mm !== `disabled`){
				await client.db.set(`maintenance509798534204096513`, `disabled`)
				await client.db.set(`maintenancereason509798534204096513`, reason)
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.tick} Successfully disabled maintenance mode. Users are now able to use the bot once again.`)]
				})
			} else {
				return message.channel.send(`${client.config.emoji.err} Maintenance is not currently active. Try enabling maintenance before trying to disable it.`)
			}
		}
	},
};