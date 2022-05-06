const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'ownerhelp',
	aliases: ['ohelp', 'ahelp', "ocmds", "ahp"],
	description: "*When admins have issues and cant seem to remember what commands owners have",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (message.content.toLowerCase().endsWith('-cmds')) {
			//;eval "1234567890".match(/.{1,5}/g);
		/*	var count = 1;
			const string = client.commands.map(x => `${count++}. \`${x.name}\`: ${x.description}`).join('\n');
			let embeds = []
			const map = string.match(/[^]{1,2048}/g);
			for (const x in map) {
				embeds.push(new MessageEmbed().setColor(message.author.color).setTitle("Commands Map").setDescription(map[x]))
			};
			return new rm.menu(message.channel, message.author.id, embeds, ms('10m'))*/

		};
		if (args.length) {
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

			if (!command) return message.channel.send("Please try to include a valid command name/alias!");

			return message.channel.send({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(message.author.displayAvatarURL())
				.setFooter(`Requested by ${message.author.tag}`)
				.setTitle('Administrator Command Help | ' + command.name)
				.setDescription(command.description)
				.addField("Aliases", command.aliases.join(', '))
			})
		};

	message.channel.send({
		embed: new MessageEmbed()
		.setTitle("Administrator Command Help")
		.setColor(message.author.color)
		.setDescription(`Hai Hai`)		
		.addField("Administrator", client.commands.filter((x) => x.category === 'own').map((x) => `\`${x.name}\``).join(', '))
		.addField("Developer", client.commands.filter((x) => x.category === 'botdeveloper').map((x) => `\`${x.name}\``).join(', '))
		.addField("SEMIMUTE ONLY", client.commands.filter((x) => x.category === 'botowner999').map((x) => `\`${x.name}\``).join(', '))
		.setFooter(`Giving yourself permissions outside of your own role/rank will result in a full demotion/datawipe`)
	})
	}
}