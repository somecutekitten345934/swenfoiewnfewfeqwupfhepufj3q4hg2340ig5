const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const { varianceTransformDependencies, string } = require('mathjs'); // math stuff
const hypixel = new Hypixel.Client('142d5d69-9b3c-4c34-80e4-63adebd7b54b'); // api key for hypixel
const { Utils } = require('hypixel-api-reborn');
const delay = require('delay'); // delay module
const ms = require('ms');

module.exports = {
	name: 'verify',
	aliases: ['verify'],
	description: 'links weeb bot and hypixel user',
	async run(client, message, args) {
        let guild = client.guilds.cache.get(client.config.guildserver);
        var memberRole = guild.roles.cache.get("828479150771535882"); // Verified Role Cache
		let mem = guild.members.cache.get(message.author.id);
		if (!mem) return message.channel.send(`Looks like you're not in the guild server. Why not join? :D https://discord.gg/weebineers`);

        let puuid = await client.db.get(`uuid${message.author.id}`)
        if(!args.length){
            return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Invalid Arguments!`)
				.setDescription(`I'm not really sure who you're trying to link with... give me an IGN! Additionally, you can do \`${message.guild.prefix}verify recheck\` and \`${message.guild.prefix}verify unlink\``)
				.setThumbnail(client.config.thumbnail.question)]
			});
        }
        if(args[0] == "recheck"){
            const msg = await message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Weebchan is thinking...`)
                .setDescription(`I'm checking for your linked account data... please wait!`)
                .setThumbnail(client.config.thumbnail.question)]
            })
            await delay(2000)
            let data = await client.db.get(`uuid${message.author.id}`)
            if(!data){
                return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Link Not Found!`)
                    .setDescription(`I wasn't able to find out your linked account UUID. Try linking your account via \`${message.guild.prefix}verify <ign>\``)
                    .setThumbnail(client.config.thumbnail.error)]
                })
            }
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (guildMember.roles.cache.has(`828479150771535882`)) {
				return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Recheck Successful!`)
                    .setDescription(`I was able to find that you already have the verified role so nothing has changed!`)
                    .setThumbnail(client.config.thumbnail.thumbsup)]
                })
			};
		
			if (!guildMember.roles.cache.has(`828479150771535882`)) {
				await guildMember.roles.add(`828479150771535882`);
				return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Recheck Successful!`)
                    .setDescription(`I was able to find that you are in fact verified, but didn't have the <@&828479150771535882> role but now you have it!`)
                    .setThumbnail(client.config.thumbnail.thumbsup)]
                })
			};
        }
        if(args[0] == "unlink"){
            const msg = await message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Weebchan is thinking...`)
                .setDescription(`I'm checking for your linked account data... please wait!`)
                .setThumbnail(client.config.thumbnail.question)]
            })
            await delay(1000)
            let data = await client.db.get(`uuid${message.author.id}`)
            if(!data){
                return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Link Not Found!`)
                    .setDescription(`I wasn't able to find any linked data.. Seems you're not verified! Try linking your account via \`${message.guild.prefix}verify <ign>\``)
                    .setThumbnail(client.config.thumbnail.error)]
                })
            }
            let guildMember = message.guild.members.cache.get(message.author.id);
			if (guildMember.roles.cache.has(`828479150771535882`)) {
                await guildMember.roles.remove(`828479150771535882`);
                await client.db.delete(`uuid${message.author.id}`)
				return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Unlink Successful!`)
                    .setDescription(`I have removed your verified role as you are no longer linked!\n\n**WARNING:** Some channels may be locked for you now that you are no longer verified!`)
                    .setThumbnail(client.config.thumbnail.thumbsup)]
                })
			};
		
			if (!guildMember.roles.cache.has(`828479150771535882`)) {
				await client.db.delete(`uuid${message.author.id}`)
				return msg.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Unlink Successful!`)
                    .setDescription(`I have removed your link with me, but for some reason you didnt have the role...`)
                    .setThumbnail(client.config.thumbnail.thumbsup)]
                })
			};
        }
        const link = await message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.config.colors.green)
            .setTitle(`Weebchan is thinking...`)
            .setDescription(`I'm thinking... give me a moment!`)
            .setThumbnail(client.config.thumbnail.question)]
        })
        try {
            let uuid = await hypixel.getPlayer(args[0]).then(player => player.uuid).catch()
            let discord = await hypixel.getPlayer(`${args[0]}`).then(player => player.socialMedia.find(x=>x.name==="Discord").link)
            let nign = await Utils.toIGN(uuid);
            await delay(1000)
            if(puuid){
                return link.edit({
                    embeds: [new MessageEmbed()
                    .setTitle(`Account Already Linked!`)
                    .setColor(client.config.colors.red)
                    .setDescription(`This discord account is already linked to the account **${nign}** so I can't really let you link twice... maybe try doing \`${message.guild.prefix}verify unlink\``)
                    .setThumbnail(client.config.thumbnail.question)]
                })
            }
            if(!puuid){
                if(message.author.tag == discord){
                    client.db.set(`uuid${message.author.id}`, uuid)
                    mem.roles.add(memberRole) 
                    return link.edit({
                    embeds: [new MessageEmbed()
                    .setColor(client.config.colors.green)
                    .setTitle(`Link Successful!`)
                    .setDescription(`I have linked the account "**${args[0]}**" (**${uuid}**) to ${message.author.tag}. You are now have the <@&828479150771535882> role!`)
                    .setThumbnail(client.config.thumbnail.thumbsup)]
                })
                } else {
                    return link.edit({
                        embeds: [new MessageEmbed()
                        .setColor(client.config.colors.red)
                        .setTitle(`Link Unsuccessful`)
                        .setDescription(`Sorry ${message.author.tag} but the discord account linked to that account shows as ${discord}.. If this account is yours, update it on Hypixel.net's SocialMedia section`)
                        .setThumbnail(client.config.thumbnail.error)]
                    })
                }
            }
        } catch (err){
            console.log(`WEEBCHAN ERROR: ${err}`)
                if(err == "Error: [hypixel-api-reborn] Invalid API Key! For help join our Discord Server https://discord.gg/NSEBNMM"){
                    return link.edit({
                        embeds: [new MessageEmbed()
                        .setTitle(`An Error Occurred!`)
                        .setColor(client.config.colors.red)
                        .setDescription(`My **Hypixel.net API Key** seems to be invalid or missing!\nContact __SemiMute#6630__ to get this issue fixed!`)
                        .setThumbnail(client.config.thumbnail.error)]
                    })
                }
                if(err == "Error: [hypixel-api-reborn] Player does not exist."){
                    return link.edit({
                        embeds: [new MessageEmbed()
                        .setTitle(`An Error Occurred!`)
                        .setColor(client.config.colors.red)
                        .setDescription(`I don't recognise the username "${args[0]}".. Maybe you typed it incorrectly?`)
                        .setThumbnail(client.config.thumbnail.error)]
                    })
                }
                return link.edit({
                    embeds: [new MessageEmbed()
                    .setColor()
                    .setTitle(`An Error Occurred!`)
                    .setDescription(`Woopsies! I ran into an error grabbing the right information for "${args[0]}". \nYou may be experiencing this error due to the account does not exist, never logged into hypixel, or the user does not have their discord linked in their social media on Hypixel.`)
                    .addField(`ERROR`, `${err}`)
                    .setThumbnail(client.config.thumbnail.error)]
                })
            }
        }
    }