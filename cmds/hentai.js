const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const { NekoBot } = require("nekobot-api")
const api = new NekoBot();


module.exports = {
    name: "4k",
    aliases: ["4k"],
    description: 'Get a random **NSFW** 4k image ;3 **NSFW CHANNEL ONLY**',
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
            const image = await api.get("hentai");
            let user = await client.usr(args[0]).catch((x) => {});
            if (!user) user = { tag: "themself" };
            try {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setTitle(message.author.tag + " has requested hentai for " + user.tag + "!")
                    .setImage(image)]
                });
            } catch(error){
                if(error == "DiscordAPIError: Request entity too large"){
                    return message.reply(`An internal error occurred whilst attempting to grab that image...`)
                }
            }
    }
};