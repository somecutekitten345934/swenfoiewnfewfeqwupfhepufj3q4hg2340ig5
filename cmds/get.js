const Discord = require('discord.js');

module.exports = {
	name: 'get',
	aliases: ['get', 'getv'],
	description: 'gets a value from the database and returns it. (also shows its data type and how it is formatted by the interpreter)',
	usage: '<user> <key>',
	category: 'own',
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if ((!cst.includes("get"))) {
			let key = (args[0] || "").toLowerCase();
			let terms = ["bal", "fish", "chillpills", "v", "xp", "xplvl", "petname", "perms", "nick", "cmds", "crdt", "ores", "chnl"];
			if (!terms.includes(key)) return message.channel.send(`The keys whose values you can get are: ${client.list(terms)}`);
			let get = key == "fish" ? "fsh" : key;
			let value = await client.db.get(get + message.author.id) || "null";
			message.channel.send(get == "fsh" ? value : client.noExponents(value))
		} else {
			if (args.length < 2) return message.channel.send("You must specify a user and a key")
			let user = await client.usr(args[0]);
			if (!user) return message.channel.send("You must specify a user for this command to work!")
			let key = args.slice(1).join(' ');
			if(!key) return message.channel.send("You must provide a `<key>`; refer to <#726059916791644291> for further details")
			let x = await client.db.get(key + user.id)
			if (!x) return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setDescription(`That value does not exist`)]
			});
			let ot = typeof x;
			if (typeof x == "object") x = "```json\n" + JSON.stringify(x) + "\n```"
			if (x.toString().length <= 2048 && (!cst.includes("tgt"))) {
				message.channel.send({
					embeds: [new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(x.toString())
					.setFooter(ot.toString())
					.setTimestamp()]
				})
			} else {
				let gcode = await client.db.get("gcode" + message.author.id);
				if (gcode) {
					message.channel.send(x.toString(), { split: { char: "" }, code: gcode });				
				} else {
					message.channel.send(x.toString(), { split: { char: "" } });
				}
			};
	}
		/*		message.channel.send({
			embeds: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`\`\`\`js\n${require("util").inspect(x, { depth: 1000000000 })}\n\`\`\``)
		})
		*/
	},
}