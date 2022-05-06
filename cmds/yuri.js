const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const hmtai = require(`hmtai`)


module.exports = {
    name: "yuri",
    aliases: ["yuri"],
    description: 'What about cute Les?~ **NSFW CHANNEL ONLY**',
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
            const image = hmtai.nsfw.yuri()
            let user = await client.usr(args[0]).catch((x) => {});
            if (!user) user = { tag: "themself" };
            try {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setTitle(message.author.tag + " has requested yuri for " + user.tag + "!")
                    .setImage(image)]
                });
            } catch(error){
                if(error == "DiscordAPIError: Request entity too large"){
                    return message.reply(`An internal error occurred whilst attempting to grab that image...`)
                }
            }
    }
};