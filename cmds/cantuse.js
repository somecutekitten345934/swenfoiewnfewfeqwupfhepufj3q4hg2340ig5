const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "cantuse",
	aliases: ['cantuse'],
	category: 'btsf',
	description: 'See the people who cannot use a certain command',
	dev: true,
	async run(client, message, args) {
		if(!args.length) return message.channel.send("You must include a command name/alias in order for this command to work")
	const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
	if (!command) return message.channel.send("A command with that name or alias was not found.");
		const msg = await message.channel.send(`Fetching Users...`);
		Promise.all(
				client.users.cache.map(async x => [ x, await client.db.get(`cmds.${command.name}${x.id}`) ])
			).then((x) => {
				msg.edit(`Filtering Results...`);
				return x.filter(a => a[1]);
			})	
					.then((x) => {
						if(!x.length) return msg.edit("No users have been blacklisted from using this command.")
						var counter = 1;
					msg.edit('', { embeds: new MessageEmbed().setColor(message.author.color).setDescription(x.map(a => `${counter++}. ${a[0].tag} (${a[0].id})`).join('\n')).setTitle("Users who have been blacklisted from using  ~" + command.name + ":").setFooter(`In ${Date.now() - msg.createdAt} MS`) });
					})
						.catch(console.error);

	}
}