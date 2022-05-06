const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const ms = require(`ms`)
const { NekoBot } = require("nekobot-api");
const api = new NekoBot();


module.exports = {
    name: "levellb",
    aliases: ["lvllb", "rank"],
    category: 'social',
    description: "Shows the top 10 members with the highest server level!",
    async run(client, message, args) {
        return message.reply("Deprecated")
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
        let data = await client.db.get('lvllbc' + message.author.id);
		let cooldown = client.cooldown(message.createdTimestamp, data);
        if(cooldown){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Cooldown!`)
				.setDescription(`I refuse to let you check the **Level** leaderboard right now! I just checked it! Ask me in about **${cooldown}**`)
				.setThumbnail(client.config.thumbnail.pout)]
			});
        }
        let sts = (message.createdTimestamp + ms(`5m`)) - client.config.epoch;
        await client.db.set('lvllbc' + message.author.id, sts);
        const msg = await message.channel.send({ embeds: [new MessageEmbed()
        .setDescription(`Weebchan is thinking.. please give her a moment while she calculates the leaderboard!\n**NOTE:** This may take a minute due to it having to cache each user`)
        .setTitle(`Weebchan is Thinking!`)
        .setThumbnail(client.config.thumbnail.question)]})
		let serverlvls = await client.db.get(`memberList${message.guild.id}`) || ""
		if(serverlvls.startsWith(`;`)){
			var nlvl = serverlvls.substring(1);
			await client.db.set(`memberList${message.guild.id}`, nlvl)
			await client.db.delete(`lvllbc${message.author.id}`)
			return msg.edit({
				embeds: [new MessageEmbed()
				.setTitle(`An Error Occurred!`)
				.setDescription(`This servers' member cached data was incorrectly formatted and has been corrected. Try the command again!`)
				.setThumbnail(client.config.thumbnail.error)]
			})
		}
		serverlvls = serverlvls.split(`;`)
        let lb = []
        for(const i of serverlvls){
            let cst = await client.db.get(`cst${i}`) || ""
			if(!cst.includes(`PRIVACY_ACCEPTED`)){

            } else {
                let data = await client.db.get("exp" + i) || `${message.guild.id};0;1;1`;
                data = data.split(";f;");
                const indx = data.findIndex((f) => f.split(";")[0] == message.guild.id);
                let lvl;
                let xp;
                if(indx == -1){
                    lvl = 1;
                    xp = 1;
                } else {
                    lvl = isNaN(data[indx].split(";")[2]) ? 0 : Number(data[indx].split(";")[2]);
                    xp = isNaN(data[indx].split(";")[3]) ? 0 : Number(data[indx].split(";")[3]);
                }
                    if(lvl == 1 && xp == 1){
    
                    } else {                
                        lb.push({
                        ID: i,
                        LEVEL: `${lvl}`,
                        XP: `${xp}`,
                        })
                    }
            }
        }
        let arr = [];
        lb = lb.sort(function(a, b){
            if (a.LEVEL == b.LEVEL) return b.XP - a.XP;
            return b.LEVEL-a.LEVEL
            })
            for(var i in lb){
                        lb[i].number = Number(i) + 1;
            }
            
        lb.forEach(e => {
            if(e.number == 1){
                arr.push(`:first_place: **#${e.number}** <@${e.ID}> - LEVEL: **${e.LEVEL}** with **${e.XP}** XP`); 
            }else if(e.number == 2){
                arr.push(`:second_place: **#${e.number}** <@${e.ID}> - LEVEL: **${e.LEVEL}** with **${e.XP}** XP`); 
            }else if(e.number == 3){
                arr.push(`:third_place: **#${e.number}** <@${e.ID}> - LEVEL: **${e.LEVEL}** with **${e.XP}** XP`); 
            } else {
                arr.push(`:white_small_square: **#${e.number}** <@${e.ID}> - LEVEL: **${e.LEVEL}** with **${e.XP}** XP`); 
            }
        })
        await delay(3000)
        msg.edit({ embeds: [new MessageEmbed()
            .setTitle(`${message.guild.name} Level Leaderboard`)
            .setDescription(`Here are the top 10 members who are most active in ${message.guild.name}!\n\n**__Leaderboard:__**\n${arr.slice(0, 10).join(`\n`)}`)
            .setThumbnail(client.config.thumbnail.amaze)
            .setFooter(`WARNING: Leaderboards may not be accurate if leaderboard players havent spoken recently!`)]})
    }
    
};