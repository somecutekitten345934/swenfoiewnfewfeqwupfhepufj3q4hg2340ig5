const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'claimperk',
	aliases: ['patreonperks', 'claimperks'],
	category: 'ecn',	
	description: 'Claim your Patreon subscription perks',
	async run(client, message, args) {
		let cd = await client.db.get(`patreonc${message.author.id}`)
        let cst = await client.db.get(`cst${message.author.id}`) || "";
        let lb = await client.db.get(`lootbox${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
        let bal = await client.db.get(`bal${message.author.id}`)
        bal = Number(bal)
        lb = lb.split(`;`)
        let patron = lb[0]
        // 15k monthly, 5 lootboxes monthly, a badge
        // 20k monthly, 7 looboxes (idk what rarities we have in mind, but maybe a variety of LBs), badge ofc, and the cst that allows you to spam cmds
        // 30k monthly, 12 lbs (variety of LBs with one of a rare ones), badge, able to change the color of your embeds
        let cdc = client.cooldown(message.createdTimestamp, cd);
        if(cdc){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} Sorry! You can claim your patreon rewards in ${cdc}`)]
            })
        }
        if(cst.includes(`sensei`)){
            let nbal = bal + 30000;
            await client.db.set(`bal${message.author.id}`, nbal)
            patron = Number(patron)
            lb[0] = patron + 12;
            await client.db.set(`lootbox${message.author.id}`, lb.join(`;`))
            await client.db.set('patreonc' + message.author.id, (message.createdTimestamp + 2678000000) - client.config.epoch)
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`
                **THANKS FOR BEING A PATREON!**
                Thank you for being a **SENSEI** tier patreon! Here are your supporter rewards!

                :white_small_square: ${client.config.emoji.coin} 30,000
                :white_small_square: x12 PATREON_LOOTBOX_EMOJI
                :white_small_square: Other rewards like \`;color\` setting are automatically given
                `)
                .setFooter(`As long as you are a patron, you can use this command monthly!`)]
            })
            
        } else if(cst.includes(`adventurer`)){
            let nbal = bal + 20000;
            await client.db.set(`bal${message.author.id}`, nbal)
            patron = Number(patron)
            lb[0] = patron + 7;
            await client.db.set(`lootbox${message.author.id}`, lb.join(`;`))
            await client.db.set('patreonc' + message.author.id, (message.createdTimestamp + 2678000000) - client.config.epoch)
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`
                **THANKS FOR BEING A PATREON!**
                Thank you for being a **ADVENTURER** tier patreon! Here are your supporter rewards!

                :white_small_square: ${client.config.emoji.coin} 20,000
                :white_small_square: x7 PATREON_LOOTBOX_EMOJI
                :white_small_square: Other rewards like \`;color\` setting are automatically given
                `)
                .setFooter(`As long as you are a patron, you can use this command monthly!`)]
            })
            
        } else if(cst.includes(`trainee`)){
            let nbal = bal + 15000;
            await client.db.set(`bal${message.author.id}`, nbal)
            patron = Number(patron)
            lb[0] = patron + 5;
            await client.db.set(`lootbox${message.author.id}`, lb.join(`;`))
            await client.db.set('patreonc' + message.author.id, (message.createdTimestamp + 2678000000) - client.config.epoch)
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`
                **THANKS FOR BEING A PATREON!**
                Thank you for being a **TRAINEE** tier patreon! Here are your supporter rewards!

                :white_small_square: ${client.config.emoji.coin} 15,000
                :white_small_square: x5 PATREON_LOOTBOX_EMOJI
                `)
                .setFooter(`As long as you are a patron, you can use this command monthly!`)]
            })
 
        } else {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} You do not currently have a subscription to Weebchan's Patreon!`)]
            })
        }
	}
}