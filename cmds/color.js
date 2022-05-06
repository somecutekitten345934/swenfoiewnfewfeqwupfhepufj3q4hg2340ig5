const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'color',
	category: 'custom',	
	aliases: ['color', 'color', 'setcolor', 'setcolor', 'set-color', 'set-color'],
	description: "Changes your color prefrence (custom color on embeds) you must have the colorist role in the main server",
	usage: "<hexCode>",
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		function checkAvailability(arr, val) {
			return arr.some(function(arrVal) {
				return val == arrVal
			})
		}
		let trainee = checkAvailability(cst, 'trainee')
		let adventurer = checkAvailability(cst, 'adventurer')
		if(args[0] == "random"){
			if(cst.includes(`RAINBOW_TALISMAN`)){
				await client.db.set(`clr${message.author.id}`, "RANDOM;0")
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.tick} ${message.author.tag} has activated their ${client.config.emoji.rainbow} talisman and their colors are now random!`)]
				})
			} else {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.err} You must obtain the ${client.config.emoji.rainbow} talisman in order to set your color as RANDOM! Purchase one from \`${message.guild.prefix}shop\``)]
				})
			}
		}
		if(args[0] == "clear"){
			await client.db.delete(`clr${message.author.tag}`)
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} ${message.author.tag} has cleared their color preferences!`)]
			})
		}
		if(args[0] == "normal"){
			if(trainee == false){
				if(adventurer == false){
					return message.channel.send(`${client.config.emoji.err} You do not have permission to use this sub command!`)
				}
			}
			let normal = await client.db.get(`clrb${message.author.id}`) || `${client.config.defaultHexColor};0`
			await client.db.set(`clr${message.author.id}`, `${normal}`)
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} ${message.author.tag} has restored their color preferences to: \`${normal}\``)]
			})
		}


		if (!args.length) {
			const clrs = await client.db.get("clr" + message.author.id) || `${client.config.defaultHexColor};0`
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(
					`${message.author.tag}'s Color Preferences`
				)
				.setDescription(
					`Every time you use a command, each color is cycled through sequentially. The last value is where the bot is currently at in your cycle.\nSub commands: \`random, normal, clear\` \n\n\`\`\`js\n${client.inspect(clrs.split(";"))}\`\`\``
				)]
			});
		};
			if(adventurer == false){
				return message.channel.send(`${client.config.emoji.err} You do not have permission set your own colors!`)
			}
		const colors = args
			.map((arg) => {
				const color = `#${arg.replace(/#+/g, '').slice(0, 6)}`;
				if (/^#([a-f\d]{6}|[a-f\d]{3})$/i.test(color)) {
					return color;
				}
				return false;
			});		
			
		if (colors.includes(false)) {
			return message.channel.send("One of your provided hex color codes is not valid, please check all values and try again. To add more than one color, simply separate each one by spaces. If you're still having trouble, feel free to contact `" + client.users.cache.get(client.config.owner).tag + "`");
		}

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has set their color preferences to \`${client.inspect(colors)}\`. Use \`${message.guild.prefix}color\` to view a list of all your currently set colors.`)]
		})
		colors.push("0");
		await client.db.set("clr" + message.author.id, colors.join(";"))
		await client.db.set("clrb" + message.author.id, colors.join(";"))
	},
}