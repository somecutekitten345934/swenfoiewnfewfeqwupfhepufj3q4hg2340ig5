const Discord = require('discord.js');

module.exports = {
	name: 'roleinfo',
	aliases: ['roleinfo', 'rf'],
	description: 'Displays information about a certain role',
  category: "utl",
  usage: 'roleinfo <@role, id or name>',
	async run(client, message, args) {
    const msg = await message.channel.send(`${client.config.emoji.loading}`);
    if (!args.length) return msg.edit(`You must specify a role for me to find! You can @mention the role, the ID or the name of the role`);
    let role = message.guild.roles.cache.find(x => x.name.toLowerCase() == args.join(' ').toLowerCase()) || message.guild.roles.cache.find(x => x.name.toLowerCase().startsWith(args[0].toLowerCase())) || message.guild.roles.cache.find(x => x.id == args[0]) || (message.mentions.roles.first())
		if (!role) return msg.edit(`${client.config.emoji.err} Unknown Role "${client.trim(args.join(" "), 1888)}"`)
		const members = client.trim(role.members.map(x => x.user.tag.toString()).join(', '), 1024)
		let embed = new Discord.MessageEmbed()
		.setColor(role.color ? role.color : "#000000")
		.setTimestamp()
		.setDescription(role)
		.setTitle("Role Information | " + role.name)
		.addField("❯ Role Name", role.name, true)
		.addField("❯ Mention", `\`<@&${role.id}>\``, true)
		.addField("❯ Created On", role.createdAt.toDateString(), true)
		.addField("❯ Color", role.hexColor ? `${role.hexColor} (${role.color})` : "None", true)
		.addField("❯ Position", role.position, true)
		.addField("❯ Hoisted", role.hoisted ? "Yes" : "No", true)
		.addField(`❯ Members [${role.members.size}]`, members.length ? members : "No one has the " + role + " role", true)
		.setFooter("❯ ID: " + role.id)
		msg.edit({ embeds: [embed] })
			.catch((err) => { });
	},
};