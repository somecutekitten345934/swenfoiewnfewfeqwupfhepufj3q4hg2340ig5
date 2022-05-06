const { MessageEmbed } = require(`discord.js`);
const ms = require('ms');

module.exports = {
	name: 'timeout',
	aliases: ['timeout'],
	description: 'Times a user out',
	category: 'mod',
	async run(client, message, args) {
		let cst = await client.db.get(`cst${message.author.id}`) || "";
		cst = cst.split(`;`)
		let logs = await client.db.get(`logs${message.guild.id}`)
		if(!message.member.permissions.has(`MANAGE_MESSAGES`)){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Insufficient Permissions!`)
				.setThumbnail(client.config.thumbnail.question)
				.setDescription(`I can't really let you mute people since you dont have the special \`MANAGE_MESSAGES\` permission.. Sorry!`)]
			})
		}
		if(!logs){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Setting Not Defined!`)
				.setThumbnail(client.config.thumbnail.question)
				.setDescription(`Sorry, but I don't really know how to send you moderation logs if there's no logs channel setup!`)]
			})
		}
			let usr = await client.usr(args[0]).catch((f) => {});
			if(!usr) return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid User!`)
				.setDescription(`I'm not really sure who you want me to timeout... give me a user!`)
				.setThumbnail(client.config.thumbnail.question)]
			});
			let member = message.guild.members.cache.get(usr.id);
			if (!member) 			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`User Not In Server!`)
				.setThumbnail(client.config.thumbnail.question)
				.setDescription(`How am I supposed to mute someone who's not in ${message.guild.name}??`)]
			})
	
			let amt = Number(args[1]);
			let time = args[1]
			if (!time || isNaN(ms(time))) {
				return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(client.config.colors.red)
                        .setTitle(`Invalid Time Format`)
                        .setThumbnail(client.config.thumbnail.error)
                        .setDescription(`Please provide a valid format for your mute!\nExample: \`1h = 1 Hour, 1m = 1 Minute\``)]
                })
			}
			let times = ms(ms(time), { long: true })
			let reason = args.slice(2).join(' ');
			if (!reason) reason = "Staff Member didn't specify a reason.";
	
			if(args[1] === "0"){
				times = "**PERMANENT**"
			}
			let mutes = await client.db.get(`timeouts` + message.guild.id + member.id) || []
			mutes.push({
				type: `Timeout`,
				duration: `${times}`,
				date: Date.now(),
				by: message.author.id,
				reason: reason,
				
			})
			await client.db.set(`timeouts` + message.guild.id + member.id, mutes)
            var GuildMember = message.guild.members.cache.get(usr.id);
            GuildMember.timeout(ms(time), reason.toString()).catch((x) => {})

            let logmsg = [new MessageEmbed()
				.setColor("#f56c6c")
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`
				
				**User:** ${member.user.tag} (${member.id})
				**Action Taken:** Timeout
				**Action Length:** ${times}
				**Reason:** ${reason}
				
				`)
				.setTimestamp()]
			let channel = message.channels.cache.get(logs)
			channel.send({embeds: [logmsg] });

			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} ${member.user.tag} has been given a ${times} timeout because of "${reason}" and was sent the following message:`)
				.setThumbnail(client.config.thumbnail.thumbsup)]
			})
			await client.db.set(`mutes` + message.guild.id, true) || []

			let m = [{
				id: usr.id,
				at: Date.now(),
				time: ms(`${args[1]}`),
				ends: Date.now() + ms(args[1])
			}]

			
			let dm = [new MessageEmbed()
			.setTitle(`WEEBCHAN MODERATION`)
			.setThumbnail(client.config.thumbnail.scroll)
			.setDescription(`You have been timed out for **${times}** in **${message.guild.name}**. If you think this is a mistake or you were wrongly punished, please contact __SemiMute#6630__. Spamming dms will result in a ban!`)
			.setColor(client.config.colors.red)
			.addField(`Staff Member`, `${message.author.tag} (${message.author.id})`)
			.addField("Reason", reason.toString())];
            console.log(dm[0].description)
			message.channel.send({ embeds: [dm]});
			member.send({embeds: dm})
	},
}