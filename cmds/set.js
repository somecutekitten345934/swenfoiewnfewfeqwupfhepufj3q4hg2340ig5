const Discord = require('discord.js');

module.exports = {
	name: 'set',
	aliases: ['set', 's'],
	description: 'sets a value with key `<key>` and value `<value>` in the database',
	usage: '<key> <value>',
	cst: "administrator132465798",
	category: 'own',
	async run(client, message, args) {
		if (args.length < 3) return message.channel.send("You must specify a user, key and value.");
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) return message.channel.send("You must specify a user for this command to work!");

		if(user == client.config.owner && message.author.id !== client.config.owner){
			return message.channel.send(`${client.config.emoji.err} You are not permitted to set any data for SemiMute#6630!`)
		}
		let key = args[1];
		let val = args.slice(2).join(" ");
		if(val.includes("botowner999") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may have the \`botowner999\` cst! Modifying your data to include this will result in a blacklist.`)
		}
		if(val.includes("administrator132465798") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may give the` + " `administrator132465798` cst! Modifying your own or other people's cst to include this will not end well!")
		}
		if(val.includes("botdeveloper") && message.author.id != client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Only SemiMute#6630 may give the` + " `botdeveloper` cst! Modifying your own or other people's cst to include this will not end well!")
		}
		if(!key || (!val)) return message.channel.send("You must provide a `<key>` and `<value>`; refer to <#726059916791644291> for further details");
		if (val.startsWith('"') && (val.endsWith('"'))) {
			val = String(val).slice(1, -1);
		} else {
			if (!isNaN(val)) val = Number(val);
			if (val.toString().toLowerCase() == "true") val = true;
			if (val.toString().toLowerCase() == "false") val = false;
			try {
				val = JSON.parse(val);
			} catch (e) {

			};
		};
		await client.db.set(key + user.id, val)
			.catch(async(err) => {
				await client.db.set(key + user.id, val);
				message.channel.send({
					embeds: [new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`There was an error whilst setting this variable with a specific data type — ${key + user.id}. This operation has been re-attempted.`)]
					.setThumbnail(client.config.thumbnail.error)
				})
			})
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Success!`)
			.setDescription(`Well, I've set **${key}${user.id}** as **${typeof val == "object" ? JSON.stringify(val) : client.inspect(val)}** with type \`${typeof val}\`... woopie?`)
			.setThumbnail(client.config.thumbnail.thumbsup)]
		}).catch((x) => {
			message.channel.send(`Successfully set ${key}${user.id} (value too large to display) with type \`${typeof val}\``)
		})
		if (typeof val == "boolean") {
			 message.channel.send("Due to algebraic operations performed by computers on booleans, it's not possible to set values as false within its primitive data type. If this is done, then the value becomes null.");
		};
		let vval = client.trim(val, 1024)
		client.channels.cache.get(client.config.channels.set)
			.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setTimestamp()
				.setFooter(`${message.author.tag} | ${message.author.id}`)
				.setTitle(`Value Updated`)
				.addField("Key", key.toString(), true)
				.addField("New Value", client.trim(val, 1024).toString(), true)
				.addField("\u200b", "\u200b", true)
				.addField("Target User", `${user.tag} | ${user.id}`)
				.addField("Data Type", `\`${typeof val}\``, true)
				.setThumbnail(message.author.displayAvatarURL())]
			})
	},
}