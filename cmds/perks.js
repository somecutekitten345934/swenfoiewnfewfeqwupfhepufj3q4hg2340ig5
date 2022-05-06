const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'perks',
	aliases: ['perks', 'perk', 'donateinfo'],
	description: "View bot's purchasable permissions with their according prices.",
	category: 'info',
	async run(client, message, args) {
		const embed = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle("Donation Information")
		.setDescription(
			`
			Here's a list of things which you may purchase listed with their corresponding prices in bold. If you're confused on a command or have any further enquiries, please PM \`${client.users.cache.get(client.config.owner).tag}\`.			
			`
		)
		.addField("Pricing", `Please note that all currency is in dollars (USD).`)		
		.addField("Purchasable Services", 
`

**1x Custom Role** - $5.00 USD

You can purchase "custom roles". These roles will be created and held within our [support server](${client.config.ssInvite}), each user is able to own a total of 4 roles; each role will have its own "keyword" which the bot will use in order to recognise the role you wish to use. As a result of this, only one keyword can be linked to a single role instantaneously. 

**1x Waifu Alias** - $10.00 USD

You can also purchase "waifu aliases". Purchase one by contacting SemiMute#6630. All emotes on servers MUST share a server with the bot or they will not work!

`	
		)
		.addField("Custom Role Commands", 
		    `
		- \`${message.guild.prefix}roles\` - shows you a list of roles you own, with their keywords (in case you forget);
    - \`${message.guild.prefix}role <role keyword> <user>\` - Used to assign the role, if the user already has the role then the bot will remove it;
		- \`${message.guild.prefix}rolename <role keyword> <new name>\` - Edits the name of your owned role with said \`<role keyword>\`;
		- \`${message.guild.prefix}rolecolor <role keyword> <new color>\` - Edits the colour of your role; must be a **hex** colour code. For help choosing one, click [here](https://htmlcolorcodes.com/);
		- \`${message.guild.prefix}rolemembers <role name or ID>\` - Shows a list of all the members who have a certain role (You must own the role) - make sure you specify a valid ID or name;
		- \`${message.guild.prefix}editrolekw <old role keyword> <new role keyword>\` - Edits the keyword of a role, changing it to what you have specified.
`
		)
		.addField("Additional Notes", 
	 `
	 Join our support server by clicking the link > [here](${client.config.ssInvite}).
	 `);
		message.channel.send({ embeds: [embed] })
	}
};