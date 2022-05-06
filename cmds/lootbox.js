const { MessageEmbed } = require("discord.js");
const delay = require(`delay`);
const ms = require(`ms`);

module.exports = {
	name: "lootbox",
	aliases: [ 'lb' ],
	description: "View and open your Weebineers Lootboxes",
	category: 'ecn',
	async run(client, message, args) {
        let data = await client.db.get("pet" + message.author.id);
		if (!data) return message.channel.send(`${client.config.emoji.err} Lootboxes sometimes give waifu buffs! You must have a waifu in order to use lootboxes... \`${message.guild.prefix}tame\` to tame your own!`)
			data = data.split(";");
			let hp = Number(data[1])
			let en = Number(data[2]);
			let endur = Number(data[6]);
			let lvl = Number(data[0]);
			let xp = Number(data[3]);
			let str = Number(data[7]);
			let intel = Number(data[5]);
			let affec = Number(data[8])
			let consumed = Math.round((60 / (Math.log(endur + 9))));
			let rand = Math.floor(Math.random() * 100);

		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let selected;
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				selected = display;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				selected = "default";
				display = "waifu";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}
        let lootbox = await client.db.get(`lootbox${message.author.id}`) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
        lootbox = lootbox.split(";")

        let solar = "<:SolarChest:844055985379475476>"
        let summer = "<:SummerBox:844411450940325929>"
        let load = "<a:ChestOpen:846201298687885382>"
        let patreon = "PATREON_LOOTBOX_EMOJI"

        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setTitle(`${message.author.tag}'s Lootboxes`)
                .setDescription(`

??? **Patreon** - [ x${client.comma(lootbox[0])} Left ] \`${message.guild.prefix}lootbox open patreon\`
Recieve special rewards for being a patron!

**SPECIAL LOOTBOXES**
These will only be available for a limited time!
${summer} **Summer Lootbox** - [ x${client.comma(lootbox[5])} Left ] \`${message.guild.prefix}lootbox open summer\`
Recieve a chance to obtain some of the summer exclusive items
                `)]
            })
        }
        if(args[0] == "open"){
            let cd = await client.db.get(`lootboxopen${message.channel.id}`)
            if(cd == "true"){
                return message.channel.send(`${client.config.emoji.err} A lootbox is currently being opened in this channel already! Try again after!`)
            }
            if(args[1] == "solar"){
                if(lootbox[0] <= 0){
                    return message.channel.send(`${client.config.emoji.err} You may not open a ${solar} as you do not currently own any!`)
                } else {
                    nlb = lootbox[0] - 1;
                    lootbox[0] = nlb
                    await client.db.set(`lootbox${message.author.id}`, lootbox.join(`;`))

                    var loot = [] || [" NO BONUS LOOT! :("];
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 1){
                        rant = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
                        loot.push(`\n:white_small_square: 『**UNOBTAINABLE**』${client.config.emoji.sadge} __Random Dev Item__ **x${rant}**`)
                    }
                    msg = await message.channel.send({ embeds: new MessageEmbed().setColor(message.author.color).setDescription(`${load} ${message.author.tag} is opening a lootbox...`)})
                    await delay(1000)
                    msg.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`**${message.author.tag}** discovered some mysterious loot from their lootbox!\n\n:white_small_square: 『**GUARANTEED!**』${client.config.emoji.coin} 25,000${loot.join("")}!`)
                        .setFooter(`${message.guild.prefix}lootbox to view your lootbox inventory!`)
                        .setThumbnail(`https://cdn.discordapp.com/emojis/844055985379475476.png?v=1`)]
                    })
                    return;
                }
            }
            if(args[1] == "patreon"){
                if(lootbox[0] <= 0){
                    return message.channel.send(`${client.config.emoji.err} You may not open a PATREON_LOOTBOX_EMOJI as you do not currently own any!`)
                } else {
                    let cst = await client.db.get(`cst${message.author.id}`)
                    cst = cst.split(`;`)
                    nlb = lootbox[0] - 1;
                    lootbox[0] = nlb
                    await client.db.set(`lootbox${message.author.id}`, lootbox.join(`;`))

                    var loot = [] || [" NO BONUS LOOT! :("];
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 25){
                        rant = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
                        let lhealth = await client.db.get(`lhealth${message.author.id}`)
                        nlhealth = lhealth + rant
                        await client.db.set(`lhealth${message.author.id}`, nlhealth)
                        loot.push(`\n:white_small_square: 『**COMMON!**』${client.config.emoji.lhealth} __Potion of Lesser Health__ **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 50){
                        rant = 1;
                        let health = await client.db.get(`health${message.author.id}`)
                        nhealth = health + rant
                        await client.db.set(`health${message.author.id}`, nhealth)
                        loot.push(`\n:white_small_square: 『**UNCOMMON!**』${client.config.emoji.health}  __Potion of Health__ **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 50){
                        let ores = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
                        ores = ores.split(`;`)
                        rant = Math.floor(Math.random() * (25 - 10 + 1) ) + 10;
                        let t1 = ores[0];
                        t1 = Number(t1)
                        t1 = t1 + rant;
                        ores[0] = t1;
                        await client.db.set(`ores${message.author.id}`, ores.join(`;`))
                        loot.push(`\n:white_small_square: 『**UNCOMMON!**』${client.config.emoji.t1ore} **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let ghealth = await client.db.get(`ghealth${message.author.id}`)
                        nghealth = ghealth + rant
                        await client.db.set(`lhealth${message.author.id}`, nghealth)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.ghealth} __Greater Potion of Health__ **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = Math.floor(Math.random() * (15 - 5 + 1) ) + 5;
                        let ores = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
                        ores = ores.split(`;`)
                        let t2 = ores[1];
                        t2 = Number(t2)
                        t2 = t2 + rant;
                        ores[1] = t2;
                        await client.db.set(`ores${message.author.id}`, ores.join(`;`))
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.t2ore} **x${rant}**`)
                    }
                    // Potion of Haste
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let phaste = await client.db.get(`phaste${message.author.id}`)
                        nphaste = phaste + rant
                        await client.db.set(`phaste${message.author.id}`, nphaste)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.phaste} __Potion of Haste__ **x${rant}**`)
                    }
                    // Potion of Mystery
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let pmystery = await client.db.get(`pmystery${message.author.id}`)
                        npmystery = pmystery + rant
                        await client.db.set(`lhealth${message.author.id}`, npmystery)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.pmystery} __Potion of Mystery__ **x${rant}**`)
                    }
                    // T3 Ore
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 88){
                        let ores = await client.db.get(`ores${message.author.id}`) || "0;0;0;0;0;0";
                        ores = ores.split(`;`)
                        rant = Math.floor(Math.random() * (10 - 3 + 1) ) + 3;
                        let t3 = ores[2];
                        t3 = Number(t3)
                        t3 = t3 + rant;
                        ores[2] = t3;
                        await client.db.set(`ores${message.author.id}`, ores.join(`;`))
                        loot.push(`\n:white_small_square: 『**MYTHIC!**』${client.config.emoji.t3ore} **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    await client.db.set(`lootboxopen${message.channel.id}`, "true")                  
                    msg = await message.channel.send({ embeds: new MessageEmbed().setColor(message.author.color).setDescription(`${load} ${message.author.tag} is opening a patreon lootbox...`)})
                    await delay(3000)
                    msg.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`**${message.author.tag}** discovered some mysterious loot from their lootbox!\n${loot.join("")}`)
                        .setFooter(`${message.guild.prefix}lootbox to view your lootbox inventory!`)
                        .setThumbnail(`https://cdn.discordapp.com/emojis/844411450940325929.png?v=1`)]
                    })
                    await client.db.delete(`lootboxopen${message.channel.id}`)
                    return;
                }
            }
            if(args[1] == "summer"){
                if(lootbox[5] <= 0){
                    return message.channel.send(`${client.config.emoji.err} You may not open a ${summer} as you do not currently own any!`)
                } else {
                    let cst = await client.db.get(`cst${message.author.id}`)
                    cst = cst.split(`;`)
                    let bal = await client.db.get(`bal${message.author.id}`)
                    bal = Number(bal)

                    nbal = bal + 25000
                    await client.db.set(`bal${message.author.id}`, nbal)
                    nlb = lootbox[5] - 1;
                    lootbox[5] = nlb
                    await client.db.set(`lootbox${message.author.id}`, lootbox.join(`;`))

                    var loot = [] || [" NO BONUS LOOT! :("];
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 25){
                        rant = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
                        let lhealth = await client.db.get(`lhealth${message.author.id}`)
                        let nlhealth = lhealth + rant
                        await client.db.set(`lhealth${message.author.id}`, nlhealth)
                        loot.push(`\n:white_small_square: 『**COMMON!**』${client.config.emoji.lhealth} __Potion of Lesser Health__ **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 50){
                        rant = 1;
                        let health = await client.db.get(`health${message.author.id}`)
                        let nhealth = health + rant
                        await client.db.set(`health${message.author.id}`, nhealth)
                        loot.push(`\n:white_small_square: 『**UNCOMMON!**』${client.config.emoji.health}  __Potion of Health__ **x${rant}**`)
                    }
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let ghealth = await client.db.get(`ghealth${message.author.id}`)
                        let nghealth = ghealth + rant
                        await client.db.set(`lhealth${message.author.id}`, nghealth)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.ghealth} __Greater Potion of Health__ **x${rant}**`)
                    }
                    // Potion of Haste
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let phaste = await client.db.get(`phaste${message.author.id}`)
                        let nphaste = phaste + rant
                        await client.db.set(`phaste${message.author.id}`, nphaste)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.phaste} __Potion of Haste__ **x${rant}**`)
                    }
                    // Potion of Mystery
                    prand = Math.floor(Math.random() * 100)
                    if(prand > 75){
                        rant = 1;
                        let pmystery = await client.db.get(`pmystery${message.author.id}`)
                        let npmystery = pmystery + rant
                        await client.db.set(`lhealth${message.author.id}`, npmystery)
                        loot.push(`\n:white_small_square: 『**RARE!**』${client.config.emoji.pmystery} __Potion of Mystery__ **x${rant}**`)
                    }
                    prand = (Math.random() * 100)
                    if(prand > 98){
                        if(cst.includes(`BEACHBALL_TALISMAN`)){
                            loot.push(`\n:small_orange_diamond:  『**LEGENDARY!**』((**DUPLICATE!**)) ${client.config.emoji.BEACHBALL_TALISMAN} __Beachball Talisman__ **TALISMAN**`)
                        } else {
                            rant = Math.floor(Math.random() * (4 - 1 + 1) ) + 1;
                            cst.push(`BEACHBALL_TALISMAN`)
                            await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                            loot.push(`\n:small_orange_diamond:  『**LEGENDARY!**』${client.config.emoji.BEACHBALL_TALISMAN} __Beachball Talisman__ **TALISMAN**`)
                        }
                    }
                    prand = Math.floor(Math.random() * 100)
                    await client.db.set(`lootboxopen${message.channel.id}`, "true")                    
                    msg = await message.channel.send({ embeds: new MessageEmbed().setColor(message.author.color).setDescription(`${load} ${message.author.tag} is opening a lootbox...`)})
                    await delay(3000)
                    msg.edit({
                        embeds: [new MessageEmbed()
                        .setColor(message.author.color)
                        .setDescription(`**${message.author.tag}** discovered some mysterious loot from their lootbox!\n\n:white_small_square: 『**GUARANTEED!**』${client.config.emoji.coin} 25,000${loot.join("")}!`)
                        .setFooter(`${message.guild.prefix}lootbox to view your lootbox inventory!`)
                        .setThumbnail(`https://cdn.discordapp.com/emojis/844411450940325929.png?v=1`)]
                    })
                    await client.db.delete(`lootboxopen${message.channel.id}`)
                    return;
                }
            } else {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} Invalid lootbox type "${args[1]}"! Try \`${message.guild.prefix}lootbox\` to view the available boxes!`)]
                })
            }
        }
    }
}