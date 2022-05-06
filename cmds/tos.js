const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "tos",
	aliases: ['tosrules', 'tos', 'termsofservice', "eula"],
	description: 'Displays Weebchan Terms of Service',
	category: 'info',
	async run(client, message, args) {
		const em = new MessageEmbed()
    .setTitle("Weebchan Terms of Service - IN PROGRESS")
    .setColor(message.author.color)
    .setDescription(
      `
	**NOTE:** Breaking any rule on our Terms of Service may result in a severe punishment such as a data wipe, or a blacklist.

    **1.** - **MACROING** - Macroing to level up waifus, fish, or anything else
	**2.** - **ABUSING BUGS/EXPLOITS** - Abusing any bugs/exploits as well as not reporting them when you find them is not allowed.
	**3.** - **ALT BOOSTING** - Do not farm on alternate accounts and boost your main account. Includes using accounts to store values.
	**4.** - **DROP STORING** - Using \`;drop\` to store values is not allowed. 
      `
    )
    .addField("QUESTIONS?", 'Join our support server via' + " `;hub`")
		message.channel.send({ embeds: [em]})
	}
}