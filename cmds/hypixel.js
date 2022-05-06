const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const { varianceTransformDependencies, string } = require('mathjs'); // math stuff
const hypixel = new Hypixel.Client('e5173f0f-00fc-4a05-99b7-840e796d1f84'); // api key for hypixel
const { Utils } = require('hypixel-api-reborn');
const delay = require('delay'); // delay module

module.exports = {
	name: 'hypixel',
	aliases: ['hypixel'],
	description: 'Shows basic Hypixel related information about the player',
	async run(client, message, args) {
        if(!args.length){
            return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid Arguments!`)
				.setDescription(`I'm not really sure who you're trying to check the stats of... give me an IGN!`)
				.setThumbnail(client.config.thumbnail.question)]
			});
        }
        const link = await message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.config.colors.green)
            .setTitle(`Weebchan is thinking...`)
            .setDescription(`I'm thinking... give me a moment!`)
            .setThumbnail(client.config.thumbnail.question)]
        })
        try{
            if(args[0].startsWith(`<`)){
                throw(`Error: [hypixel-api-reborn] Player does not exist.`)
            }
            let uuid = await hypixel.getPlayer(args[0]);
            // Basic User Information
                const player = await hypixel.getPlayer(`${args[0]}`, { guild: true});
                if(player == null){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(client.config.colors.red)
                        .setTitle(`Invalid User!`)
                        .setDescription(`This player doesn't exist... sorry!`)
                        .setThumbnail(client.config.thumbnail.question)]
                    });
                }
                let level = player.level; 
                let rank = player.rank; 
                let online = player.isOnline; 
                let karma = player.karma;
                let pluscolor = player.plusColor
                let guild = player.guild
                let guildtag = player.guild.tag
                let timestamp = player.lastLoginTimestamp
                var tag;
    
                timestamp = Number(timestamp)
                let ftimestamp = timestamp + 7884000000
                let present = new Date()
        
                var fdate = new Date(ftimestamp);
                let ffordate = ((fdate.getMonth()+1)+
                "/"+fdate.getDate()+
                "/"+fdate.getFullYear())
        
                var date = new Date(timestamp);
                let fordate = ((date.getMonth()+1)+
                "/"+date.getDate()+
                "/"+date.getFullYear()+
                " "+date.getHours()+
                ":"+date.getMinutes()+
                ":"+date.getSeconds())
    
            if(guild == null){
                tag = ":red_circle: No Guild Found"
            } else {
                if(!guildtag){
                    guildtag = ``
                }
                tag = `${guild} [${guildtag}]`
            }
    
            if (rank == `Admin`){
                rank = "ADMIN"
            };
            if (rank == `Moderator`){
                rank = "MOD"
            };
            if (rank == `Helper`){
                rank = "HELPER"
            };
            if(rank == `YouTube`){
                rank = "YOUTUBE"
            };
            if (rank == `MVP++`){
                rank = "MVP++"
            };
            if (rank == `MVP+`){
                rank = "MVP+"
            };
            if (rank == `MVP`){
                rank = "MVP";
            };
            if (rank == `VIP+`){
                rank = "VIP+";
            };
            if (rank == `VIP`){
                rank = "VIP"
            };
            if (rank == `Default`){
                rank = "NO RANK"
            }
            
            // rank color for MVP+ or MVP++
            if (pluscolor == `null`){
                pluscolor = "N/A";
            }
            
            if(!guild){
                guild = "No Guild Found!"
            }
            if(online == false){
                online = `:red_circle: Offline`
            }
            if(online == true){
                online = (`:green_circle: Online`);
            }
            await delay(1000)
            link.edit({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setTitle(`${args[0]}'s Hypixel Stats`)
                .setDescription(`Here is the basic information for ${args[0]}
                
                **Rank**: [${rank}]
                **Guild:** ${tag}
                **Network Level:** ${level}
                **Karma:** ${client.comma(karma)}
    
                **Status:** ${online}
                **Last Login:** ${fordate}
                `)
                .setThumbnail(`https://mc-heads.net/head/${uuid}/left`)
                .setTimestamp()]
            })
            return;
        } catch(err){
            if(err == "Error: [hypixel-api-reborn] Invalid API Key! For help join our Discord Server https://discord.gg/NSEBNMM"){
                return link.edit({
                    embeds: [new MessageEmbed()
                    .setTitle(`An Error Occurred!`)
                    .setColor(client.config.colors.red)
                    .setDescription(`My **Hypixel.net API Key** seems to be invalid or missing!\nContact __SemiMute#6630__ to get this issue fixed!`)
                    .setThumbnail(client.config.thumbnail.error)]
                })
            } else {
                link.edit({
                    embeds: [new MessageEmbed()
                        .setTitle(`An Error Occurred!`)
                        .setColor(client.config.colors.red)
                        .setDescription(`I encountered an error whilst attempting to grab data for this player`)
                        .setThumbnail(client.config.thumbnail.error)] 
                })
            }
        }
    }
}