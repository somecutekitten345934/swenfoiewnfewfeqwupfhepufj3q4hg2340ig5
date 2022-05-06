const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const ms = require(`ms`);

module.exports = {
    name: "bumps",
    aliases: ["bumplb"],
    description: "Check Weebineers' Bump Leaderboard!",
    usage: 'test',
    async run(client, message, args) {
        if(message.guild.id !== "742257076637794344") {return;}
        let cst = await client.db.get(`cst${message.author.id}`) || ""
        cst = cst.split(`;`)
        if(!cst.includes(`PRIVACY_ACCEPTED`)){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Privacy Policy Not Accepted!`)
                .setDescription(`You have not accepted Weebchan's Privacy opt-in and are unable to view leaderboards, get tracked for bumps, use the leveling system, etc. See \`${message.guild.prefix}privacy\` for more information`)]
            })
        }
        let data = await client.db.get('bumpcd' + message.author.id);
		let cooldown = client.cooldown(message.createdTimestamp, data);
        if(cooldown){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setTitle(`Cooldown!`)
				.setDescription(`I refuse to let you check the **Weebineers Bump** leaderboard right now! I just checked it! Ask me in about **${cooldown}**`)
				.setThumbnail(client.config.thumbnail.pout)]
			});
        }
        let sts = (message.createdTimestamp + ms(`5m`)) - client.config.epoch;
        await client.db.set('bumpcd' + message.author.id, sts);
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
                let user = await client.db.get("bumps" + i) || `0;0`
                user = user.split(`;`)
                let lvl = user[0]
                let xp = user[1]
                let botcheck = await client.usr(i.toString()).catch((x) => {});
                if(botcheck.bot){
                } else {
                    lb.push({
                        ID: i,
                        SUCCESS: user[0],
                        FAILS: user[1]
                    })
                }
            }
        }
        let arr = [];
        lb = lb.sort(function(a, b){return b.SUCCESS-a.SUCCESS})
        for(var i in lb){
            lb[i].number = Number(i) + 1;
        }
            
        lb.forEach(e => {
            if(e.number == 1){
                arr.push(`:first_place: **#${e.number}** <@${e.ID}>\n**Successful:** ${e.SUCCESS} - **Fails:** ${e.FAILS} - :trophy: **Score:** ${e.SUCCESS - e.FAILS}`); 
            }else if(e.number == 2){
                arr.push(`:second_place: **#${e.number}** <@${e.ID}>\n**Successful:** ${e.SUCCESS} - **Fails:** ${e.FAILS} - :trophy: **Score:** ${e.SUCCESS - e.FAILS}`); 
            }else if(e.number == 3){
                arr.push(`:third_place: **#${e.number}** <@${e.ID}>\n**Successful:** ${e.SUCCESS} - **Fails:** ${e.FAILS} - :trophy: **Score:** ${e.SUCCESS - e.FAILS}`); 
            } else {
                arr.push(`:white_small_square: **#${e.number}** <@${e.ID}>\n**Successful:** ${e.SUCCESS} - **Fails:** ${e.FAILS} - :trophy: **Score:** ${e.SUCCESS - e.FAILS}`); 
            }
        })
        await delay(3000)
        msg.edit({ embeds: [new MessageEmbed()
            .setTitle(`Weebineers Bump Leaderboard`)
            .setDescription(`Here are the top 10 members who have bumped the most! Bump the server via \`!d bump\` in <#912807978414010448>\n\n:warning: **Disboard Leaderboards will be deprecated on **MARCH 31st**\n****__Leaderboard:__**\n${arr.slice(0, 10).join(`\n`)}`)
            .setThumbnail(client.config.thumbnail.amaze)
            .setFooter(`WARNING: Leaderboards may not be accurate if leaderboard players havent spoken recently!`)]})
    }
};