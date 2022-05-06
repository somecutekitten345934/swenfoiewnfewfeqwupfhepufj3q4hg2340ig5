const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const { NekoBot } = require("nekobot-api")
const api = new NekoBot();


module.exports = {
    name: "hkitsune",
    aliases: ["hentaikitsune"],
    description: 'Get a random **NSFW** kitsune **NSFW CHANNEL ONLY**',
    category: "nsfw",
    usage: 'test',
    async run(client, message, args) {
        if(!message.channel.nsfw){
            return message.channel.send({
                embed: new MessageEmbed()
                .setTitle(`Explicit Content!`)
                .setColor(client.config.colors.red)
                .setDescription(`Sorry! I'm not allowed to show you this content outside of an NSFW channel since it is probably lewd!`)
                .setThumbnail(client.config.thumbnail.lewd)
            })
        }
            const image = await api.get("hkitsune");
            let user = await client.usr(args[0]).catch((x) => {});
            if (!user) user = { tag: "themself" };
            let ghneko = await client.db.get("ghkitsune" + 509798534204096513) || 0;
            let owner = client.config.owner
    
            ghneko = Number(ghneko);
            ghneko += 1;
            await client.db.set("ghkitsune" + 509798534204096513, ghneko)
    
            let hneko = await client.db.get("hkitsune" + message.author.id) || 0;
    
            hneko = Number(hneko);
        hneko += 1;
            await client.db.set("hkitsune" + message.author.id, hneko)
    
            try {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setTitle(message.author.tag + " has requested horny kitsune for " + user.tag + "!")
                    .setDescription(`${message.author.tag} requested a total of ${hneko} kistune!`)
                    .setImage(image)
                    .setFooter(`Everyone on the bot collectively has requested ${ghneko} kistune`)]
                });
            } catch(error){
                if(error == "DiscordAPIError: Request entity too large"){
                    return message.reply(`An internal error occurred whilst attempting to grab that waifu...`)
                }
            }
    }
};