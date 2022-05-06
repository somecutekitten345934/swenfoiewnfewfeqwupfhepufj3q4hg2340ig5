const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "donate",
	aliases: ['donate', 'donator'],
	description: 'Displays information on how to donate',
	category: 'info',
	async run(client, message, args) {
		const em = [new MessageEmbed()
    .setTitle("Donation Guide")
    .setColor(message.author.color)
		.addField("Pricing", `
Note that all payments must be in USD, so take care when paying in other currencies. 
**IF YOUR PAYMENT IS NOT IN USD, THEN IT WILL BE IGNORED AND IS NOT ELIGIBLE FOR A REFUND.**

To view pricing for different items, use the \`${message.guild.prefix}perks\` command.

`)
	.addField("PATREON", `
These steps are for if you are subscribing to our patreon for bot perks
**Step 1:** Go to [Weebchan's Patreon page](https://www.patreon.com/SemiMute?fan_landing=true "Click me to visit the Weebchan patreon page") and select "My Memberships"
**Step 2:** Select the desired patreon tier and click "Join $(Amount) Tier" and pay for the desired tier
**Step 3:** Join **Weebchan Haven** via \`${message.guild.prefix}haven\`
**Step 4:** Go to [My Profile Settings > Apps](https://www.patreon.com/settings/apps "Connect your discord") and connect your discord with patreon.
	`)
	.addField(`OTHER PAYMENTS`, `
These steps are for if you are purchasing a one time thing such as an alias.
**Step 1:** Go to [Weebchan's PayPal.me page](https://paypal.me/bortherbot "Click me to visit the Weebchan paypal page") and enter in the desired payment amount, in USD.	
**Step 2:** Be sure to include some details on the notes section, ie. **what** you are buying and for **who**. 
**If you fail to follow this instruction, further actions may be required to verify that this payment was made by you in order to prevent fraud. It also makes our lives harder, as well as yours.**
**Step 3:** DM ${client.users.cache.get(client.config.owner).tag} with evidence of your payment. Once they have verified your payment they will add the appropriate credits to your account until you are ready to setup your aliases.
	`)
    .setDescription(
`

To view a list of blacklistable offences, use the \`${message.guild.prefix}tos\` command.

`
	)]
	message.channel.send({ embeds: [em]})
	}
}