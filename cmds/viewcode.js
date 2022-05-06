const delay = require("delay")
const { MessageEmbed } = require("discord.js")
const nhentai = require(`nhentai`)
const napi = new nhentai.API()
const nh = require('nhentai-js');

module.exports = {
	name: "viewcode",
	aliases: ["viewcode"],
	category: "nsfw",
	description: 'View information about a doujin code',
	async run(client, message, args) {
        if(!message.channel.nsfw){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Explicit Content!`)
                .setColor(client.config.colors.red)
                .setDescription(`Sorry! I'm not allowed to show you this content outside of an NSFW channel since it is probably lewd!`)
                .setThumbnail(client.config.thumbnail.lewd)]
            })
        }
        let ncode = args[0]
        if(ncode == 228922){
            return message.reply(`Just.... dont look at that code.. trust me... I'm doing you a favor...`)
        }

        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Missing Sauce Code!`)
                .setColor(client.config.colors.red)
                .setDescription(`Maybe try giving me a sauce code to evaulate...`)
                .setThumbnail(client.config.thumbnail.question)]

            })
        }
        if(isNaN(args[0]) || ncode.length >= 8){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Invalid Sauce Code!`)
                .setColor(client.config.colors.red)
                .setDescription(`Are you sure you really know what sauce codes are... Sad...`)
                .setThumbnail(client.config.thumbnail.error)]
            })
        }
        const msg = await message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(client.config.colors.red)
            .setTitle(`Weebchan is Thinking!`)
            .setThumbnail(client.config.thumbnail.question)
            .setDescription(`I'm checking this doujin code... please wait!`)]
        }).then(async sent => {
            var id = sent.id
            console.log(id)
            const channel = client.channels.cache.get(message.channel.id);
            const msgid = channel.messages.cache.get(id);
            if(nh.exists(`${args[0]}`)){
                try {
                    const dou = await nh.getDoujin(`${args[0]}`)
                } catch {
                    return msgid.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setThumbnail(client.config.thumbnail.error)
                        .setTitle(`Validation Failed!`)
                        .setDescription(`I couldn't find any information for the code "${args[0]}" Try a different code!`)]
                    })
                }
            }
            await delay(1000)
            napi.fetchDoujin(ncode).then(doujin => {
                try { // Validates that the URL page is a valid page
                    let title = doujin.titles.pretty
                    let cover = doujin.cover.url
                    let tags = doujin.tags.all.map(tag => tag.name).join(`, `)
                    msgid.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setTitle(`[${args[0]}] ${title}`)
                        .setURL(`https://nhentai.to/g/${args[0]}`)
                        .setDescription(`Here's the information I found for the code!`)
                        .setThumbnail(cover)
                        .addField(`TAGS`, tags)]
                    })
                } catch(err) {
                    msgid.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(err)]
                    })
                }
            })
          })
    }
}