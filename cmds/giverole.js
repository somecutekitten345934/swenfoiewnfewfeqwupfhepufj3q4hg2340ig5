const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'giverole',
	aliases: ['giverole', 'gr'],
	description: "Assigns an assignable role to the mentioned user, only useable by the bot owner.",
	category: 'own',
	cst: "ggr",
	async run(client, message, args) {
		if (args.length < 2) return message.channel.send("You must specify a role<keyword> and member for this command to work!");
		"~giverole <user> <keyword> <hoist>"
		let usr = await client.usr(args[0]).catch((x) => {})
		if (!usr) return message.channel.send("Whoops! I can't find that user");

		let Name = `${usr.tag}'s New Custom Role`;
		let roles = await client.db.get('cstmrl' + usr.id);
				roles = roles ? roles.split(";") : [];
				roles = client.listToMatrix(roles, 2);
		let kw = args[1].toLowerCase();
		let kws = roles.map((x) => x[0]);
		if (kws.includes(kw)) return message.channel.send("That user already has a role by that keyword.");
		if(!args[2]) args[2] = "";
		let hoist = args[2].includes("-h");
		const role = await message.guild.roles.create({
			data: {
				name: Name,
				position: 9,
				color: "#000000",
				mentionable: false,
				hoist: hoist == true ? true : false,
				permissions: 0,
			},
			reason: `Creating an assignable role for ${usr.tag} (${usr.id}), with keyword "${kw}"`
		});
		args[1] = args[1].toLowerCase();
		roles.push([kw, role.id]);
		roles = roles.map((f) => Array.from(f).join(";"));
		await client.db.set('cstmrl' + usr.id, roles.join(";"));
		message.channel.send({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.tick} ${usr.tag} now has an assignable role (ID ${role.id})`)
		});
	}
};