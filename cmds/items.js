const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js');

module.exports = {
	name: 'items',
	"aliases": ["i", "inventory", "stuff", "items"],
	category: 'ecn',
	description: "See what items another user has",
	async run(client, message, args) {
		let user = await client.usr(args[0] || message.author.id);
		if (!user) user = message.author;
		let f = await client.db.get("fsh" + user.id) || "0;0;0;0;0;0";
				f = f.split(";");
		let o = await client.db.get("ores" + user.id) || "0;0;0;0;0;0";
				o = o.split(";");
		let cp = await client.db.get(`chillpills${user.id}`) || "0";
		let haste = await client.db.get(`phaste${user.id}`) || "0";
		let lhealth = await client.db.get(`lhealth${user.id}`) || "0";
		let health = await client.db.get(`health${user.id}`) || "0";
		let ghealth = await client.db.get(`ghealth${user.id}`) || "0";
		let pmystery = await client.db.get(`pmystery${user.id}`) || "0";
		let dream = await client.db.get(`dcatcher${user.id}`) || "0";
		var modifiers = await client.db.get(`modifiers${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0"
		modifiers = modifiers.split(`;`)

		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Items`)
			.setDescription(`Fish in a pond to catch fish, mine for ores, and buy shop items!`)
			.addField(
				"Fish",
				`
:white_small_square: :dolphin: ${client.comma(client.noExponents(f[0]))}
:white_small_square: :shark: ${client.comma(client.noExponents(f[1]))}
:white_small_square: :blowfish: ${client.comma(client.noExponents(f[2]))}
:white_small_square: :tropical_fish: ${client.comma(client.noExponents(f[3]))}
:white_small_square: :fish: ${client.comma(client.noExponents(f[4]))}
`, true
			)
			.addField("Ores", `
:white_small_square: ${client.config.emoji.t1ore} ${client.comma(client.noExponents(o[0]))}
:white_small_square: ${client.config.emoji.t2ore} ${client.comma(client.noExponents(o[1]))}
:white_small_square: ${client.config.emoji.t3ore} ${client.comma(client.noExponents(o[2]))}
:white_small_square: ${client.config.emoji.t4ore} ${client.comma(client.noExponents(o[3]))}
:white_small_square: ${client.config.emoji.t5ore} ${client.comma(client.noExponents(o[4]))}

			`, true)
			.addField("Potions", `
:white_small_square: ${client.config.emoji.chill} ${client.comma(cp)}
:white_small_square: ${client.config.emoji.pmystery} ${client.comma(pmystery)}
:white_small_square: ${client.config.emoji.DREAM_CATCHER_POTION} ${client.comma(dream)}
:white_small_square: ${client.config.emoji.phaste} ${client.comma(haste)}
:white_small_square: ${client.config.emoji.lhealth} ${client.comma(lhealth)}
:white_small_square: ${client.config.emoji.health} ${client.comma(health)}
:white_small_square: ${client.config.emoji.ghealth} ${client.comma(ghealth)}


	`, true
			)
			.addField("Consumables", `
:white_small_square: ${client.config.emoji.STAT_MODIFIER_ONE} ${client.comma(modifiers[0])}
:white_small_square: ${client.config.emoji.STAT_MODIFIER_ALL} ${client.comma(modifiers[1])}
	`, true
			)]
		})
	}
}