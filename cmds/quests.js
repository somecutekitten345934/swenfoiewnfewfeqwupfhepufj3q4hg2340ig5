const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "quests",
	aliases: ['quest'],
	description: 'you have found secret command NYA!',
	async run(client, message, args) {
	if(message.author.id !== client.config.owner){
		return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.red)
			.setDescription(`Weebchan doesn't have any quests for your waifu quite yet... Check back later!`)]
		})
	}

	let p = await client.db.get("pet" + message.author.id);
	let petname = await client.db.get("petname" + message.author.id) || "waifu";
	if (!p) return message.channel.send(`You don't own a ${petname}! Tame one with \`${message.guild.prefix}tame\``)
		p = p.split(";");
	level = p[0]

		const em = new MessageEmbed()
    .setTitle(`${message.author.tag}'s ${petname} dungeons **__DEPRICATED__**`)
    .setColor(message.author.color)
    .setDescription(
	`This is the main help page for navigating your dungeons!

	Since your ${petname} is level **__${level}__**, you can start **DIFFICULTY TYPE** dungeons! The higher the difficulty, the higher the reward, but a much higher fail chance!
	`
	)
	.addField("DUNGEON NAVIGATION",
`
	\`${message.guild.prefix}waifudungeon status\` - View the status of your waifus current dungeon
	\`${message.guild.prefix}waifudungeon notify\` - Notify you in dms how your waifu is fairing on its dungeon!
	\`${message.guild.prefix}waifudungeon cancel\` - Cancels your active dungeon but takes :battery: each time.
	\`${message.guild.prefix}waifudungeon leaderboards\` - Views the leaderboards for who has dungeoned the most!
		
	`
		)
	.addField("DUNGEON DIFFICULTIES",
`
    Send your ${petname} on a dungeon giving you experience, inventory items, and more! Each difficulty gets more and more diffult.
    **NOTE:** Whilst dungeoning your ${petname}, you will __NOT__ be able to use \`${message.guild.prefix}train!\`

	**LVL 5+**\`${message.guild.prefix}waifudungeon beginner\` - View beginner level dungeons for your waifu! 
	**LVL 25**\`${message.guild.prefix}waifudungeon easy\` - View easy level dungeons for your waifu! 
	**LVL 15+** \`${message.guild.prefix}waifudungeon inter\` - View intermediate level dungeons for your waifu! 	
	**LVL 30+** \`${message.guild.prefix}waifudungeon hard\` - View hard level dungeons for your waifu! 
	**LVL 45+** \`${message.guild.prefix}waifudungeon advanced\` - View advanced level dungeons for your waifu! 
	**LVL 75+** \`${message.guild.prefix}waifudungeon master\` - View master level dungeons for your waifu! 
	**LVL 100+** \`${message.guild.prefix}waifudungeon expert\` - View expert level dungeons for your waifu! 
	`
		)
	.setFooter(`Redungeoned by ${message.author.tag}`)	
	    message.channel.send(em)
	}
}