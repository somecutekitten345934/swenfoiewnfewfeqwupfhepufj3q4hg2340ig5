const { MessageEmbed } = require("discord.js")
const { inspect } = require("util");
const ms = require("ms")

module.exports = {
	name: 'execute',
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	cst: "administrator132465798",
	category: 'own',
	async run(client, message, args) {
		if(!args.length){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Invalid Usage!`)
				.setColor(client.config.colors.red)
				.setDescription(`${client.config.emoji.err} You must provide a user to execute a command as`)]
			})
		}
		const user = await client.usr(args[0]).catch((r) => {});
	let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if ([client.config.owner, "501710994293129216"].includes(user.id) && (![client.config.owner, "501710994293129216"].includes(message.author.id)) && cst.includes(`blckw`)) {
			cst.push(`blacklisted`);
			cst = cst.filter(x => ![`administrator132465798`].includes(x)).join(";");
			await client.db.set("cst" + message.author.id, cst);
			client.users.cache.get(client.config.owner).send(`${message.author.tag} (${message.author.id}) has tried to execute the ${args[1]} command on you.\nTheir message is as follows: ${message.content}`)
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(`#f56c6c`)
				.setTitle(`NOPE!`)
				.setDescription(`Your account has been blacklisted for attempting to execute commands as this person. Message SemiMute#6630 to discuss why you were trying to do commands as him.\n\n **NOTE**: All execute attempts have been sent to their dms!`)
				.setTimestamp()]
			})
		}
		if ([client.config.owner, "501710994293129216"].includes(user.id) && (![client.config.owner, "501710994293129216"].includes(message.author.id))) {
			cst.push(`blckw`)
			await client.db.set("cst" + message.author.id, cst.join(";"));
			client.users.cache.get(client.config.owner).send(`${message.author.tag} (${message.author.id}) has tried to execute the ${args[1]} command on you.\nTheir message is as follows: ${message.content}`)
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(`#f56c6c`)
				.setTitle(`WARNING!`)
				.setDescription(`Your account has been marked by the system for attempting to execute commands as SemiMute#6630! Another attempt will result in an account blacklist!\n\n **NOTE**: All execute attempts have been sent to their dms!`)
				.setTimestamp()]
			})
		}
		if (args.length < 1) return message.channel.send("You must specify a user and a command to execute as the user")
		if (!user) return message.channel.send("I can't find that user.");
		if (user.bot && (!cst.includes("botexecute"))) return message.channel.send("You can't use any commands while you're a bot! (99999999 minutes left)");
			if (!args[1]) return msg.edit("You must supply a valid command name/alias");

		const arg = args[1].toLowerCase();
		if(arg.includes("eval")){
			return message.channel.send(`${client.config.emoji.err} Using eval in an execute command is not permitted. This is for security reasons.`)
		}
		if(arg.includes("evaluate")){
			return message.channel.send(`${client.config.emoji.err} Using eval in an execute command is not permitted. This is for security reasons.`)
		}
		if(arg.includes("exec") || arg.includes("execute") && message.author.id !== client.config.owner){
			return message.channel.send(`${client.config.emoji.err} Using execute in an execute command is not permitted. This is for security reasons.`)
		}
		const Message = Object.assign({}, message, {
			author: user,
			content: message.guild.prefix + args.slice(1).join(" "),
			channel: message.channel,
			member: message.guild.members.cache.get(user.id),
			guild: message.guild,
		});
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(client.config.colors.green)
			.setTitle(`Command Execution Success!`)
			.setDescription(`Executing command **"${message.guild.prefix + args.slice(1).join(" ")}"** as user **${user.tag}**`)
			.setThumbnail(client.config.thumbnail.thumbsup)]
		})
		client.emit("messageCreate", message, { author: user, content: message.guild.prefix + args.slice(1).join(" ") });
	},
};