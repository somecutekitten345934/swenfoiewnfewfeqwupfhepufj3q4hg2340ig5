const { MessageEmbed, Message } = require('discord.js');

module.exports = {
	name: 'giftbox',
	aliases: ['giftme'],
	category: 'ecn',	
	description: 'Claim certain gifts from Weebchan!',
	async run(client, message, args) {
        let cst = await client.db.get(`cst${message.author.id}`) || ""
        cst = cst.split(`;`)
        const indx = Object.values(client.config.items).findIndex((c) => c.NAME == "BIRTHDAY_CAKE_1")
        const vitem = Object.values(client.config.items)[indx];
        if(!args.length){
            return message.reply({
                embeds: [new MessageEmbed()
                .setTitle(`${message.author.tag}'s Giftbox`)
                .setDescription(`Here are all the current gifts available!
                
                **LIMITED:**
                :white_small_square: ${vitem.EMOJI} **BIRTHDAY SUPRISE** \`${message.guild.prefix}giftbox bday\`
                Access to obtain this item will be removed <t:1644627600:R>
                `)]
            })
        }
        if(args[0].toLowerCase() == "bday"){
            if(Date.now() >= "1644627600000"){
                return message.reply(`This gift has expired! Better luck next time!`)
            }
            if(cst.includes(`BIRTHDAY_CAKE_1`)){
                return message.reply(`You already have a slice of Weebchan's first birthday cake! You cant get another!`)
            } else {
                cst.push(`BIRTHDAY_CAKE_1`)
                await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setDescription(`Weebchan has handed you a slice of their first birthday cake!
                    
                    The following items have been added to your waifus inventory:
                    + ${vitem.EMOJI} **${vitem.NAME_PROPER}** \`${vitem.NAME}\`
                    (( *${vitem.DESCRIPTION}* ))
                    `)
                    .setThumbnail(client.config.thumbnail.amaze)]
                })
            }
        } else {
            return message.reply(`Invalid gift name!`)
        }
    }
}