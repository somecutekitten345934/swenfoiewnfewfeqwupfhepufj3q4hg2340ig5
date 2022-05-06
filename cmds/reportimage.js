const { MessageEmbed } = require('discord.js');
const ms = require(`ms`)
const delay = require('delay');

module.exports = {
	name: 'reportimage',
	aliases: ['reportimg'],
	description: "Request an image from our supported image based commands for removal",
	async run(client, message, args) {
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} Invalid usage. To report an image please use the following format:\n \`${message.guild.prefix}reportimage <COMMAND> <ID> <REASON>\``)
                .setFooter(`NOTE: False reporting images, or trolling reports will result in punishments.`)]
            })
        }
        let list = [
            "hwaifu",
            "fuck",
            "hold",
            "cuddle",
            "getwaifu",
            "hug",
            "kiss",
            "neko"
        ]
        const cmd = args[0].toLowerCase();
        if(list.indexOf(cmd) !== -1){
            var fs = require('fs');
            let files = fs.readdirSync(`./Images/${cmd}/`)
            if(!args[1]){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor()
                    .setDescription(`${client.config.emoji.err} Please provide the image ID you wish to report`)]
                })
            }

            if(args[1].length >= 27){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} An image ID will never exceed 24 characters. To view the ID of the image, check the footer!`)]
                })
            }
            if(files.indexOf(args[1]) !== -1){
                let reason = args.slice(2).join(' ')
                if(!reason){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${client.config.emoji.err} You must specify a reason to report this image!`)]
                    })
                } else {
                    let reports = new MessageEmbed()
                    .setColor(`#da0000`)
                    .setDescription(`${message.author.tag} (${message.author.id}) has reported an image!`)
                    .addField(`IMAGE TYPE`, `${cmd}`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .addField(`IMAGE ID`, `${args[1]}`)
                    .addField(`REASON`, `${reason}`)
                    .setTimestamp()
                    await client.channels.cache.get(client.config.channels.reportimg).send({ embeds: [reports] })
                }
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.tick} Successfully reported the image ID \`${args[1]}\` for the reason:\n "\`${reason}\`"`)
                    .setFooter(`WARNING: If you abuse this report system, you may be severely punished!`)]
                })
            } else {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} The image ID "${args[1]}" is not recognised.\n**EXAMPLE ID**: \`pgujszxit9c61.jpg\``)]
                })
            }
        } else{
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} The command "${cmd}" either does not exist, or does not have an image system.`)]
            })
        }
    }
}