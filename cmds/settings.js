const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "settings",
    aliases: ["setting"],
    description: "User Settings",
    category: "custom",
    async run(client, message, args) {
        let settings = await client.db.get(`settings${message.author.id}`) || "";
        settings = settings.split(`;`)

        let lvlnotif;

        if(!settings.includes(`lvlnotif`)){
            lvlnotif = `${client.config.emoji.tick} Leveling up messages are enabled!`
        }
        if(settings.includes(`lvlnotif`)){
            lvlnotif = `${client.config.emoji.err} Leveling up messages are disabled!`
        }
        
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`${message.author.tag}'s Weebchan Settings`)
                .setDescription(`Here are your weebchan settings! You can toggle these settings on or off, some may have a cooldown to prevent abuse!

                :white_small_square: **Level Up Notifications** \`${message.guild.prefix}settings lvlnotif\`
                **STATUS:** ${lvlnotif}
                
                **DEBUGGER:** settings${message.author.id}\n${settings}`)]
            })
        }

        let arg = args[0].toLowerCase()
        
        if(arg == `lvlnotif`){
            if(settings.includes(`lvlnotif`)){
                let setting = await client.db.get(`settings${message.author.id}`)
                if(!setting){
                    settings = settings.filter(x => ![`lvlnotif`].includes(x)).join(";");
                }
                settings = settings.filter(x => ![`lvlnotif`].includes(x)).join(";");
                await client.db.set(`settings${message.author.id}`, settings)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setDescription(`${client.config.emoji.tick} Successfully re-enabled setting **Level Up Notifications**!\n*You will now recieve level up notifications when you get enough experience!*`)]
                })
            }
            if(!settings.includes(`lvlnotif`)){
                settings.push(`lvlnotif`)
                let setting = await client.db.get(`settings${message.author.id}`)
                if(!setting){
                    await client.db.set(`settings${message.author.id}`, `lvlnotif`)
                } else {
                    await client.db.set(`settings${message.author.id}`, settings.join(`;`))
                }
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setDescription(`${client.config.emoji.tick} Successfully disabled setting **Level Up Notifications**!\n*You will no longer recieve level up notifications when you get enough experience!*`)]
                })
            }
        }
    }
}