const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "templatewaifudungeons",
	aliases: ['twd', 'twaifudungeon'],
	description: 'Displays your TEMPLATE waifu dungeon',
	cst: "botdeveloper",
	async run(client, message, args) {


	let p = await client.db.get("pet" + message.author.id);
	let petname = await client.db.get("petname" + message.author.id) || "waifu";
	if (!p) return message.channel.send(`You don't own a ${petname}! Tame one by \`${message.guild.prefix}tame\``)
		p = p.split(";");
	level = p[0]

		const em = new MessageEmbed()
    .setTitle(`${message.author.tag}'s ${petname} TEMPLATE Dungeons **__NOT OUT YET__**`)
    .setColor(message.author.color)
    .setDescription(
	`This is the main help page for navigating the TEMPLATE difficulty dungeons

	Since your ${petname} is level **__${level}__**, you can start **DIFFICULTY TYPE** dungeons! The higher the difficulty, the higher the reward, but a much higher fail chance!
	`
	)
	.addField("CURRENT ACTIVE DUNGEON",
`
	\`${message.guild.prefix}waifudungeon status\` - View the status of your waifus current dungeon
	\`${message.guild.prefix}waifudungeon notify\` - Notify you in dms how your waifu is fairing on its dungeon!
	\`${message.guild.prefix}waifudungeon cancel\` - Cancels your active dungeon but takes :battery: each time.
		
	`
		)
	.addField("TEMPLATE DUNGEON COMMANDS",
	`
	\`${message.guild.prefix}waifudungeon status\` - View the status of your waifus current dungeon
	\`${message.guild.prefix}waifudungeon notify\` - Notify you in dms how your waifu is fairing on its dungeon!
	\`${message.guild.prefix}waifudungeon cancel\` - Cancels your active dungeon but takes :battery: each time.
	`
		)
	.addField("TEMPLATE ",
`
    ${client.config.emoji.err} - __DUNGEON NAME__ - On Cooldown: 12h 13m
	${client.config.emoji.tick} - __DUNGEON NAME__ - Available! start via \`${message.guild.prefix}waifudungeon start DUNGEON NAME\`
	`
		)
	.setFooter(`Requested by ${message.author.tag}`)	
	    message.channel.send(em)
	}
}