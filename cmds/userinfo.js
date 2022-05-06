const Discord = require("discord.js");
const moment = require("moment");

module.exports = { 
	name: "userinfo",
	aliases: ["user", "who", "whois", 'userinfo', "ui"],
	usage: 'userinfo <user>',
	category: "utl",
	description: 'See some basic user information',
	async run(client, message, args) {
		await client.guilds.cache.forEach(async(x) => await x.members.fetch(message.author.id).catch((x) => {}))
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(' ');
			return newStr;
		};
		function date(_date = Date.now()) {
			return moment(_date).format('MMMM Do YYYY, h:mm:ss A');
		}
		function getPerms(user) {
			str = user.permissions.toArray().map(x => x.toString()).join(', ');
			var i = 0;
			for(i; i < str.length; i++) {
				str = format(str);
			};
			if(str.includes(`Administrator`)){
				str = "Server Administrator"
			}
			return str;
		};
		if (!args.length) args = [message.author.id];
		var user = await client.usr(args[0]).catch((x) => {});
		var member = await message.guild.members.fetch(user.id)
			.catch((err) => {});
		let flags = Object.keys(Discord.UserFlags.FLAGS).map(x => {
        if (user.flags.has(x)) {
            return format(x);
        } else {
            return 'false';
        };
    }).join(", ").replace(/false, /g,'').replace(", false",'');
		if (!member) {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription("This user is not a member of this server thus very limited information can be displayed.")
				.setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png' }))
				.setAuthor({ name: user.tag.toString(), url: user.displayAvatarURL({ dynamic: true, format: "png" })})
				.addField("Joined Discord At", date(user.createdTimestamp), true)
				.addField("Bot", user.bot.toString(), true)]
			})
		} else { //is member
		const roles = member.roles.cache.map(x => x.toString());
		var rls = "";
		roles.forEach((a) => {
			if (`${rls}${a}`.length > 1024) {
				return null;
			} else {
				rls = `${rls} ${a}`;
			}
			if(member.roles.cache.size >= 50){
				rls = "Weebchan can't show that many roles!"
			}
		});

			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png' }))
				.setAuthor({ name: user.tag.toString(), url: user.displayAvatarURL({ dynamic: true, format: "png" })})
				.addField("Display Name", member.displayName.toString(), true)
				.addField("Joined Discord At", date(user.createdTimestamp), true)
				.addField("Joined Server At", date(member.joinedTimestamp), true)
				.addField("Bot", user.bot.toString(), true)
				.addField("Highest Role", member.roles.highest.toString(), true)
				.addField(`Roles [${member.roles.cache.size}]`, rls)
				.addField("Permissions", getPerms(member))]
			})
		};
	},
};