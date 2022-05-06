const { MessageEmbed, Message } = require('discord.js');

module.exports = {
	name: 'forge',
	aliases: ['forgeupgrade'],
	category: 'ecn',
	description: 'Upgrade different tool types via the forge.',
	async run(client, message, args) {
		let bal = await client.db.get('bal' + message.author.id) || "0";
        bal = Number(bal)
        let emoji = client.config.emoji
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");

		let o = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
				o = o.split(";"); 
        iron = o[0]
        silver = o[1]
        gold = o[2]
        meteorite = o[3]
        ruby = o[4]

        if(!args.length) return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`${client.config.emoji.err} You must specify what item you wish to upgrade! Valid items are: \`pickaxe\`, \`darkness\`.`)
            .setTimestamp()]
        })
        if(args[0] == `darkness` && cst.includes(`wingsdarkness1`)){
            if(cst.includes(`wingsdarkness2`)){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} Your ${client.config.emoji.darkness2} is already at the maximum upgrade!`)
                    .setTimestamp()]
                })
            }
            let dcost = Number(85_000)
            if(bal < dcost){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} You do not have enough ${emoji.coin} to complete this transaction. You need at least ${emoji.coin} 85,000 in order to upgrade your wings of darkness.`)
                    .setTimestamp()]
                })
            }
            if(args[1] == "confirm"){
                nbal = bal - dcost
                await client.db.set(`bal${message.author.id}`, nbal)
                cst.push(`wingsdarkness2`)
                await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.tick} Successfully reforged your ${client.config.emoji.darkness} to a ${client.config.emoji.darkness2}`)
                    .setTimestamp()]
                })
            }
            else {
                return message.channel.send(`${client.config.emoji.err} You must confirm your enhancement purchase! Try \`${message.guild.prefix}forge darkness confirm\``)
            }
        }
        if(args[0] == "pickaxe"){
            if(cst.includes(`t5pickaxe`)){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`The blacksmiths at the forge do not currently know how to upgrade your ${client.config.emoji.t5pickaxe} any further...`)
                    .setTimestamp()]
                })
            }
            if (cst.includes(`t4pickaxe`)){
                let t4oc = Number(4_000) 
                let t4c = Number(750_000)
                if(meteorite < t4oc){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.t4ore} to forge your pickaxe upgrade! You need at least ${emoji.t4ore} ${client.comma(t4oc)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(bal < t4c){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.coin} to forge your pickaxe upgrade! You need at least ${emoji.coin} ${client.comma(t4c)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(args[1] == "confirm"){
                    cst.push(`t5pickaxe`)
                    let t4nc = bal - t4c
                    let t4noc = meteorite - t4oc
                    o[3] = t4noc
                    await client.db.set(`ores${message.author.id}`, o.join(`;`))
                    await client.db.set(`bal${message.author.id}`, t4nc)
                    await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.tick} You have successfully forged the maximum upgrade for your ${emoji.t5pickaxe}`)
                        .setTimestamp()]
                    })
                } else {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.err} Please confirm that you want to forge your ${emoji.t4pickaxe} to the next upgrade by doing \`${message.guild.prefix}forge pickaxe confirm\``)
                        .setTimestamp()]
                    }) 
                }
            }
            if (cst.includes(`t3pickaxe`)){
                let t3oc = Number(5_000) 
                let t3c = Number(562_500)
                if(gold < t3oc){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.t3ore} to forge your pickaxe upgrade! You need at least ${emoji.t3ore} ${client.comma(t3oc)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(bal < t3c){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.coin} to forge your pickaxe upgrade! You need at least ${emoji.coin} ${client.comma(t3c)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(args[1] == "confirm"){
                    cst.push(`t4pickaxe`)
                    let t3nc = bal - t3c
                    let t3noc = gold - t3oc
                    o[2] = t3noc
                    await client.db.set(`ores${message.author.id}`, o.join(`;`))
                    await client.db.set(`bal${message.author.id}`, t3nc)
                    await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.tick} You have successfully forged the your pickaxe from a ${emoji.t3pickaxe} to a ${emoji.t4pickaxe}`)
                        .setTimestamp()]
                    })
                } else {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.err} Please confirm that you want to forge your ${emoji.t3pickaxe} to the next upgrade by doing \`${message.guild.prefix}forge pickaxe confirm\``)
                        .setTimestamp()]
                    }) 
                }
            }
            if (cst.includes(`t2pickaxe`)){
                let t2oc = Number(6_000) 
                let t2c = Number(375_000)
                if(silver < t2oc){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.t2ore} to forge your pickaxe upgrade! You need at least ${emoji.t2ore} ${client.comma(t2oc)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(bal < t2c){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.coin} to forge your pickaxe upgrade! You need at least ${emoji.coin} ${client.comma(t2c)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(args[1] == "confirm"){
                    cst.push(`t3pickaxe`)
                    let t2nc = bal - t2c
                    let t2noc = silver - t2oc
                    o[1] = t2noc
                    await client.db.set(`ores${message.author.id}`, o.join(`;`))
                    await client.db.set(`bal${message.author.id}`, t2nc)
                    await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.tick} You have successfully forged the your pickaxe from a ${emoji.t3pickaxe} to a ${emoji.t4pickaxe}`)
                        .setTimestamp()]
                    })
                } else {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.err} Please confirm that you want to forge your ${emoji.t3pickaxe} to the next upgrade by doing \`${message.guild.prefix}forge pickaxe confirm\``)
                        .setTimestamp()]
                    }) 
                }
            }
            if (cst.includes(`pickaxe`)){
                let t1oc = Number(7_000) 
                let t1c = Number(187_000)
                if(iron < t1oc){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.t1ore} to forge your pickaxe upgrade! You need at least ${emoji.t1ore} ${client.comma(t1oc)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(bal < t1c){
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`You do not have enough ${emoji.coin} to forge your pickaxe upgrade! You need at least ${emoji.coin} ${client.comma(t1c)} in order to forge the next upgrade.`)
                        .setTimestamp()]
                    })
                }
                if(args[1] == "confirm"){
                    cst.push(`t2pickaxe`)
                    let t1nc = bal - t1c
                    let t1noc = iron - t1oc
                    o[0] = t1noc
                    await client.db.set(`ores${message.author.id}`, o.join(`;`))
                    await client.db.set(`bal${message.author.id}`, t1nc)
                    await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.tick} You have successfully forged the your pickaxe from a ${emoji.t1pickaxe} to a ${emoji.t2pickaxe}`)
                        .setTimestamp()]
                    })
                } else {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`${emoji.err} Please confirm that you want to forge your ${emoji.t3pickaxe} to the next upgrade by doing \`${message.guild.prefix}forge pickaxe confirm\``)
                        .setTimestamp()]
                    }) 
                }
            }
        }
    }
}