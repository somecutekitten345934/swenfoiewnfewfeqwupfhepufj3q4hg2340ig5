const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const { varianceTransformDependencies, string, compositionDependencies } = require('mathjs'); // math stuff
const hypixel = new Hypixel.Client('e5173f0f-00fc-4a05-99b7-840e796d1f84'); // api key for hypixel
const { Utils } = require('hypixel-api-reborn');
const delay = require('delay'); // delay module
const { isValidObjectId } = require('mongoose');

module.exports = {
    name: "huserinfo",
    aliases: ["hui"],
    description: "Gets a players information!",
    usage: 'test',
    async run(client, message, args) {
		if(!args.length){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid User!`)
				.setDescription(`I'm not really sure who you want to check... give me a username!`)
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
		try {
			if(args[0].startsWith(`<`)){
				throw(`Error: [hypixel-api-reborn] Player does not exist.`)
			}
			let uuid = await hypixel.getPlayer(args[0]);
			let player = await hypixel.getPlayer(`${args[0]}`, { guild: true});
			if(player == null){
				return link.edit({
					embeds: [new MessageEmbed()
					.setColor(client.config.colors.red)
					.setTitle(`Invalid User!`)
					.setDescription(`This player doesn't exist... sorry!`)
					.setThumbnail(client.config.thumbnail.question)]
				});
			}
			let guildname = player.guild.name
			if(!player.guild.name){
				return link.edit({
					embeds: [new MessageEmbed()
					.setDescription(`Showing guild player information for ${args[0]}
					
					**Guild Name:** N/A
					**Rank:** None
					**GEXP:** NaN
					**Join Date:** Not Joined
					
					Player is not in a guild and could not determine requirements
					`)
					.setThumbnail(`https://mc-heads.net/head/${uuid}/left`)]
				 })
			}
			let rank = player.guild.members.find(member => member.uuid === player.uuid).rank
			let gexp = player.guild.members.find(member => member.uuid === player.uuid).weeklyExperience
			let timestamp = player.guild.members.find(member => member.uuid === player.uuid).joinedAtTimestamp
	
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
			"/"+date.getFullYear())
	
			const firstDateIsPastDayComparedToSecond = (firstDate, secondDate) => {
				if (firstDate.setHours(0,0,0,0) - secondDate.setHours(0,0,0,0) >= 0) { //first date is in future, or it is today
				  return false
				}
			  
				return true
			  }
			let thing = firstDateIsPastDayComparedToSecond( fdate, present )
			let tem;
			let egexp;
	
			if(!thing){
				tem = `:red_circle: Meets Requirement on ${ffordate}`
			} else {
				tem = `:green_circle: Meets Requirement`
			}
			if(gexp < 200000){
				egexp = `:red_circle: Needs ${client.comma(200_000 - gexp)} GEXP`
			} else {
				egexp = `:green_circle: Meets Requirement`
			}
			let vetrank;
			if(guildname !== "Weebineers"){
				vetrank = "*Veteran requirements hidden due to player not in Weebineers*"
			} else {
				vetrank = "*Veteran requirements hidden due to player not in Weebineers*"
				vetrank = `
				__**Veteran Requirements**__
				**200,000 GEXP:** ${egexp}
				**3 Months in Guild:** ${tem}`
			}
			 return link.edit({
				embeds: [new MessageEmbed()
				.setDescription(`Showing guild player information for ${args[0]}
				
				**Guild Name:** ${guildname}
				**Rank:** ${rank}
				**GEXP:** ${client.comma(gexp)}
				**Join Date:** ${fordate}
				
				${vetrank}
				`)
				.setThumbnail(`https://mc-heads.net/head/${uuid}/left`)]
			 })
		} catch(err) {
			console.log(err.stack)
			if(err == "Error: [hypixel-api-reborn] Invalid API Key! For help join our Discord Server https://discord.gg/NSEBNMM"){
                return link.edit({
                    embeds: [new MessageEmbed()
                    .setTitle(`An Error Occurred!`)
                    .setColor(client.config.colors.red)
                    .setDescription(`My **Hypixel.net API Key** seems to be invalid or missing!\nContact __SemiMute#6630__ to get this issue fixed!`)
                    .setThumbnail(client.config.thumbnail.error)]
                })
            } else if (err == `TypeError: Cannot read property 'name' of null`){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(client.config.colors.red)
					.setTitle(`Invalid Guild!`)
					.setDescription(`The player **${args[0]}** is not in a hypixel guild, so no guild related information can be shown about them!`)
					.setThumbnail(client.config.thumbnail.question)]
				});
			} else if (err == "Error: [hypixel-api-reborn] Player does not exist."){
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(client.config.colors.red)
					.setTitle(`Invalid User!`)
					.setDescription(`The player "${args[0]}" doesn't exist... sorry!`)
					.setThumbnail(client.config.thumbnail.question)]
				});
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