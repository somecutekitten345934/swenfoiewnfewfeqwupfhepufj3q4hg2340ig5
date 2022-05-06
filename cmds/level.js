const { MessageEmbed, MessageAttachment } = require('discord.js');
const yuricanvas = require("yuri-canvas");
const ms = require(`ms`);
const delay = require(`delay`);
const { rank } = require('yuri-canvas');

module.exports = {
	name: "level",
	aliases: ['level', 'xp', "lvl"],
	category: 'social',
	description: "View your or someone else's level card for that server",
	async run(client, message, args) {
		let setting = await client.db.get(`gdst${message.guild.id}`) || ""
        setting = setting.split(`;`)
        if(setting.includes(`xpd`)){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`System Disabled!`)
                .setDescription(`Sorry, but an administrator of ${message.guild.name} disabled the leveling system in this guild! Ask them to enable it via \`${message.guild.prefix}guildsettings xp\``)
                .setThumbnail(client.config.thumbnail.question)]
            })
        }
		let cd = await client.db.get(`levelc${message.author.id}`)
		if(cd){
			let data = client.cooldown(message.createdTimestamp, cd);
			if(data){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setTitle(`Cooldown!`)
					.setDescription(`I refuse to let you check your level card! I just checked it! Ask me in about **${data}**`)
					.setThumbnail(client.config.thumbnail.cooldown)]
				});
			}
		}

		let msg = await message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Weebchan is Thinking!`)
			.setDescription(`${client.config.emoji.loading} Please give me a moment while I calculate and generate you level card!`)
			.setThumbnail(client.config.thumbnail.question)]
		})
		let sts = (message.createdTimestamp + ms(`1m`)) - client.config.epoch;
        await client.db.set('levelc' + message.author.id, sts);
		var id = msg.id;
		if (!args.length) args = [message.author.id];
		var member = await client.usr(args[0]).catch((x) => {});
		if (!member) user = message.author;
		let data = await client.db.get("exp" + member.id) || `${message.guild.id};0;1;1`;
				data = data.split(";f;");
		const indx = data.findIndex((f) => f.split(";")[0] == message.guild.id);
		var lvl = isNaN(data[indx].split(";")[2]) ? 0 : Number(data[indx].split(";")[2]) || 1;
		var xp = isNaN(data[indx].split(";")[3]) ? 0 : Number(data[indx].split(";")[3]);
		let xpcalc = (5 * (lvl ^ 2) + (50 * lvl) * 10);
		if(xp == "0"){
			xp = 1;
		}
		let serverlvls = await client.db.get(`memberList${message.guild.id}`) || ""
		if(serverlvls.startsWith(`;`)){
			var nlvl = serverlvls.substring(1);
			await client.db.set(`memberList${message.guild.id}`, nlvl)
			await client.db.delete(`levelc${message.author.id}`)
			return msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`An Error Occurred!`)
				.setDescription(`This servers' member cached data was incorrectly formatted and has been corrected. Try the command again!`)
				.setThumbnail(client.config.thumbnail.error)]
			})
		}
        let image = await yuricanvas.rank({ 
            username: `${member.username}`, 
            discrim: `${member.discriminator}`,
            level: lvl,
            neededXP: xpcalc, 
            currentXP: xp, 
            avatarURL: member.displayAvatarURL({ format: "png" }),
            color: "white", 
            background: "https://i.gyazo.com/da45f9f2164ab6242707bbf8068ee363.png"
        });
        let attachment = new MessageAttachment(image, "rank.png");
		const channel = client.channels.cache.get(message.channel.id);
		const msgid = channel.messages.cache.get(id);
		msgid.delete()
		message.channel.send({files: [attachment]})
		return;
	}
	
}