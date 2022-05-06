const { MessageEmbed, MessageAttachment } = require("discord.js")

module.exports = {
	name: "nekoify",
	aliases: ["nekolang", `catgirl`],
    category: `fun`,
	description: 'Translate text into the catgirl language! NYAA~!',
	async run(client, message, args) {
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.red)
                .setThumbnail(client.config.thumbnail.question)
                .setTitle(`Invalid Arguments`)
                .setDescription(`Please provide me with something to translate into the catgirl language nyaa~!`)]
            })
        }
            let text = args.slice(0).join(' ');
            var newtext = text
            // CAPS
            .replace(/(?<![A-Za-z])Hello(?![A-Za-z])/g, 'nyaday')
            .replace(/(?<![A-Za-z])Pain(?![A-Za-z])/g, 'nyouchy')
            .replace(/(?<![A-Z])Hi(?![A-Za-z])/g, 'nyaday')

            .replace(/My/g, 'Myu')
            .replace(/Mu/g, 'Myu')
            .replace(/Na/g, 'Nya')
            .replace(/The/g, 'Nye')
            .replace(/Now/, `Maow`)
            .replace(/You/, `Nyu`)

            
            // NO CAPS
            .replace(/hello/g, 'nyaday')
            .replace(/now/, `maow`)
            .replace(/the/g, 'nye')

            .replace(/my/g, 'mya')
            .replace(/mu/g, 'myu')
            .replace(/ma/g, `mya`)
            .replace(/na/g, 'nya')
            .replace(/you/, `nyu`)

            .replace(/!/g, ` nyaa~!`)
            message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Catgirl Translation Success!`)
                .setColor(client.config.colors.green)
                .setDescription(`"${newtext}"`)
                .setFooter(`Requested by ${message.author.tag}`)
                .setThumbnail(client.config.thumbnail.thumbsup)
                .setTimestamp()]
            })
    }
}