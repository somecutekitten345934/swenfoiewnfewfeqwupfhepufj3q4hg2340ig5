const { MessageEmbed, escapeMarkdown, Permissions, UserFlags, Message } = require('discord.js');
const fetch = require('node-fetch');
const delay = require(`delay`);
let ms = require(`ms`);

// Coded by SemiMute for Weebineers
module.exports = {
    name: "arena",
    aliases: ["duel"],
    description: "Duel another player in a mock battle with your waifu!",
    async run(client, message, args) {
        let wl = await client.db.get(`arenanormal${message.author.id}`) || "0;0"
        wl = wl.split(`;`)
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setTitle(`Waifu Arena Duels`)
                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                .setDescription(`
                Challange other players with waifu duels to see whos waifu is the stongest!

                __**ARENA TYPES**__
                :white_small_square: NORMAL - Casual dueling, health is not lost at the end
                Challange someone via \`${message.guild.prefix}arena normal <user>\`

            `)
                .addField(`NORMAL STATS`, `**W/L:** ${wl[0]} / ${wl[1]}`, true)
                .addField(`RANKED STATS`, `COMING SOON`, true)]
            })
        }
        let arg = args[0].toLowerCase()
        if(arg == "normal"){
            let usr;
            try {
                usr = await client.users.fetch(client.getID(args[1]))
            } catch (err) {
                usr = await client.users.fetch(args[1]).catch((x) => {});
            };
            if(usr.bot){
                return message.channel.send(`${client.config.emoji.err} Sorry, but you can't duel a robot.... Try an actual user!`)
            }
            if(!usr) return message.channel.send("You must specify a user who you wish to duel!");
            if (usr.id == message.author.id) return message.channel.send("You can't duel yourself! :-(")

            let mwl = await client.db.get(`arenanormal${message.author.id}`) || "0;0"
            mwl = mwl.split(`;`)
            mwl[0] = Number(mwl[0])
            mwl[1] = Number(mwl[1])

            let twl = await client.db.get(`arenanormal${usr.id}`) || "0;0"
            twl = twl.split(`;`)
            twl[0] = Number(twl[0])
            twl[1] = Number(twl[1])
            let mreqs = await client.db.get(`duelreq${message.author.id}`)
            if(mreqs == "true"){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} You cannot accept any other at this moment while you are requesting to duel someone!`)
                    .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                })
            }
            let reqs = await client.db.get(`duelreq${usr.id}`)
            if(reqs == "true"){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${client.config.emoji.err} ${usr.tag} cannot accept any duels at this moment due to them having an active request!`)
                    .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                })
            }
            function makeid(length) {
                var result           = [];
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                  result.push(characters.charAt(Math.floor(Math.random() * 
             charactersLength)));
               } return result.join('');
            }
            let data = await client.db.get("pet" + message.author.id);
            if(!data) return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} You must own a **[LVL 1] Waifu** in order to use this command! Begin your adventures by taming one with \`${message.guild.prefix}tame\`!`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/509798534204096513/27813c431bf7b41862b9f157285c4c18.png`)]
            })
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
            let cst = await client.db.get(`cst${message.author.id}`)
            if(cst.includes(`maxedwaifu`)){
                data = client.config.maxedPet
            }
            if (!data) return message.channel.send(`In order to duel other peoples waifus, you must have your own! Tame your own via \`${message.guild.prefix}tame\`!`)
            data = data.split(";");
                let hp = Number(data[1]);
                let en = Number(data[2]);
                let endur = Number(data[6]);
                let lvl = Number(data[0]);
                let xp = Number(data[3]);
                let str = Number(data[7]);
                let intel = Number(data[5]);
                let affec = Number(data[8])
    
            const tcurrAlias = await client.db.get("curralias" + usr.id) || "default";
            if (tcurrAlias) {
                const aliases = require('../petaliases.json');
                const names = Object.keys(aliases);
                if (names.includes(tcurrAlias)) {
                    tdisplay = aliases[tcurrAlias].DISPLAY_NAME;
                    tselected = display;
                    temojis = aliases[tcurrAlias].EMOJIS;
                } else {
                    tselected = "default";
                    tdisplay = "waifu";
                    temojis = client.config.defaults.PET_EMOJIS;
                }
            }
            let tdata = await client.db.get("pet" + usr.id);
            let tcst = await client.db.get(`cst${usr.id}`)
            if(tcst.includes(`maxedwaifu`)){
                tdata = client.config.maxedPet
            }
            if (!tdata) return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} ${usr.tag} must own a **[LVL 1] Waifu** in order to partake in a duel command! Tell them to tame their own waifu via \`${message.guild.prefix}tame\`!`)
                .setThumbnail(`https://cdn.discordapp.com/avatars/509798534204096513/27813c431bf7b41862b9f157285c4c18.png`)]
            })
                tdata = tdata.split(";");
                let thp = Number(tdata[1]);
                let ten = Number(tdata[2]);
                let tendur = Number(tdata[6]);
                let tlvl = Number(tdata[0]);
                let txp = Number(tdata[3]);
                let tstr = Number(tdata[7]);
                let tintel = Number(tdata[5]);
                let taffec = Number(tdata[8])
            let filter = m => m.author.id === usr.id;
            await client.db.set(`duelreq${usr.id}`, "true")
            await client.db.set(`duelreq${message.author.id}`, "true")
            message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`**${message.author.tag}** is using their **[LVL ${lvl}] ${display}** to challange **${usr.tag}'s** **[LVL ${tlvl}] ${tdisplay}** a duel!\n\n${usr.tag} has 60 seconds to accept. Type \`accept\` to accept!`)
                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
            });
            message.channel.awaitMessages({ filter,
                max: 1,
                time: 60 * 1000,
                errors: ['time']
            })
                .then(async(col) => {
                    if (col.first().content.toLowerCase() == 'accept') {
                        await client.db.delete(`duelreq${usr.id}`)
                        await client.db.delete(`duelreq${message.author.id}`)
                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setDescription(`${client.config.emoji.tick} **${usr.tag}** accepted **${message.author.tag}**'s **ARENA_NORMAL** duel!
                            __The duel will begin in 5 seconds!..__

                            **EXTRAS:**\n:white_small_square: Waifus do not actually lose any health whilst in the arena
                            :white_small_square: Both Waifus will start at full health
                            :white_small_square: Wichever waifu is at the highest hp after the set of attacks, is the winner!
                            :white_small_square: Wins and losses are counted but does not effect your ranked score`)
                            .addField(`${message.author.tag}'s ${display}`, `:white_small_square: **LEVEL**: ${lvl}\n:white_small_square: ${emojis[6]} **STRENGTH**: ${str}\n:white_small_square: ${emojis[5]} **ENDURANCE**: ${endur}`)
                            .addField(`${usr.tag}'s ${tdisplay}`, `:white_small_square: **LEVEL**: ${tlvl}\n:white_small_square: ${temojis[6]} **STRENGTH**: ${tstr}\n:white_small_square: ${temojis[5]} **ENDURANCE**: ${tendur}`) 
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                        })
                        await delay(5000)

                        // INITIAL CALCULATIONS
                        let messagehp = 10000
                        let targethp = 10000

                        // MESSAGE.AUTHOR STATS
                        let mdmg = Math.trunc(Math.random() * str * 50 * 0.6 * lvl)
                        mdmg = Number(mdmg)

                        // TARGET STATS
                        let tdmg = Math.trunc(Math.random() * tstr * 50 * 0.6 * tlvl)
                        tdmg = Number(tdmg)

                        ntargethp = targethp - mdmg
                        if(ntargethp < 0) { ntargethp = "0"}
                        nmessagehp = messagehp - tdmg
                        if(nmessagehp < 0) { nmessagehp = "0"}

                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                            .setDescription(`
                            **[LVL ${lvl}] ${display}** vs **[LVL ${tlvl}] ${tdisplay}** [ARENA_NORMAL]

                            ${message.author.tag}'s **[LVL ${lvl}] ${display}** lunges at ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** dealing ${temojis[0]} ${client.comma(mdmg)} damage and recieves ${emojis[0]} ${client.comma(tdmg)} damage...`)
                            .addField(`${message.author.tag}'s ${display}`, `
                            ${emojis[0]} ${client.comma(nmessagehp)}
                            `, true)
                            .addField(`${usr.tag}'s ${tdisplay}`, `
                            ${temojis[0]} ${client.comma(ntargethp)}
                            `, true)]
                        })
                        await delay(2000)
                        if(ntargethp <= 0){
                            mwl[0] += 1;
                            twl[1] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:tada: __RESULTS:__ **WINNER!**
                                ${message.author.tag}'s **[LVL ${lvl}] ${display}** wins a victory over ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}**!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        if(nmessagehp <= 0){
                            mwl[1] += 1;
                            twl[0] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:skull: __RESULTS:__ **YOU LOST!**
                                ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** has defeated **CHALLENGER** ${message.author.tag}'s **[LVL ${lvl}] ${display}**!

                                Better luck next time!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        mdmg = Math.trunc(Math.random() * str * 50 * 0.6 * lvl)
                        tdmg = Math.trunc(Math.random() * tstr * 50 * 0.6 * tlvl)
                        ntargethp = ntargethp - mdmg
                        if(ntargethp < 0) { ntargethp = "0"}
                        nmessagehp = nmessagehp - tdmg
                        if(nmessagehp < 0) { nmessagehp = "0"}

                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                            .setDescription(`
                            **[LVL ${lvl}] ${display}** vs **[LVL ${tlvl}] ${tdisplay}** [ARENA_NORMAL]

                            ${message.author.tag}'s **[LVL ${lvl}] ${display}** lunges at ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** dealing ${temojis[0]} ${client.comma(mdmg)} damage and recieves ${emojis[0]} ${client.comma(tdmg)} damage...`)
                            .addField(`${message.author.tag}'s ${display}`, `
                            ${emojis[0]} ${client.comma(nmessagehp)}
                            `, true)
                            .addField(`${usr.tag}'s ${tdisplay}`, `
                            ${temojis[0]} ${client.comma(ntargethp)}
                            `, true)]
                        })
                        await delay(2000)
                        if(ntargethp <= 0){
                            mwl[0] += 1;
                            twl[1] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:tada: __RESULTS:__ **WINNER!**
                                ${message.author.tag}'s **[LVL ${lvl}] ${display}** wins a victory over ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}**!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        if(nmessagehp <= 0){
                            mwl[1] += 1;
                            twl[0] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:skull: __RESULTS:__ **YOU LOST!**
                                ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** has defeated **CHALLENGER** ${message.author.tag}'s **[LVL ${lvl}] ${display}**!

                                Better luck next time!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        mdmg = Math.trunc(Math.random() * str * 50 * 0.6 * lvl)
                        tdmg = Math.trunc(Math.random() * tstr * 50 * 0.6 * tlvl)
                        ntargethp = ntargethp - mdmg
                        if(ntargethp < 0) { ntargethp = "0"}
                        nmessagehp = nmessagehp - tdmg
                        if(nmessagehp < 0) { nmessagehp = "0"}

                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                            .setDescription(`
                            **[LVL ${lvl}] ${display}** vs **[LVL ${tlvl}] ${tdisplay}** [ARENA_NORMAL]

                            ${message.author.tag}'s **[LVL ${lvl}] ${display}** lunges at ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** dealing ${temojis[0]} ${client.comma(mdmg)} damage and recieves ${emojis[0]} ${client.comma(tdmg)} damage...`)
                            .addField(`${message.author.tag}'s ${display}`, `
                            ${emojis[0]} ${client.comma(nmessagehp)}
                            `, true)
                            .addField(`${usr.tag}'s ${tdisplay}`, `
                            ${temojis[0]} ${client.comma(ntargethp)}
                            `, true)]
                        })
                        await delay(2000)
                        if(ntargethp <= 0){
                            mwl[0] += 1;
                            twl[1] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:tada: __RESULTS:__ **WINNER!**
                                ${message.author.tag}'s **[LVL ${lvl}] ${display}** wins a victory over ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}**!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        if(nmessagehp <= 0){
                            mwl[1] += 1;
                            twl[0] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:skull: __RESULTS:__ **YOU LOST!**
                                ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** has defeated **CHALLENGER** ${message.author.tag}'s **[LVL ${lvl}] ${display}**!

                                Better luck next time!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        mdmg = Math.trunc(Math.random() * str * 50 * 0.6 * lvl)
                        tdmg = Math.trunc(Math.random() * tstr * 50 * 0.6 * tlvl)
                        ntargethp = ntargethp - mdmg
                        if(ntargethp < 0) { ntargethp = "0"}
                        nmessagehp = nmessagehp - tdmg
                        if(nmessagehp < 0) { nmessagehp = "0"}

                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                            .setDescription(`
                            **[LVL ${lvl}] ${display}** vs **[LVL ${tlvl}] ${tdisplay}** [ARENA_NORMAL]

                            ${message.author.tag}'s **[LVL ${lvl}] ${display}** lunges at ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** dealing ${temojis[0]} ${client.comma(mdmg)} damage and recieves ${emojis[0]} ${client.comma(tdmg)} damage...`)
                            .addField(`${message.author.tag}'s ${display}`, `
                            ${emojis[0]} ${client.comma(nmessagehp)}
                            `, true)
                            .addField(`${usr.tag}'s ${tdisplay}`, `
                            ${temojis[0]} ${client.comma(ntargethp)}
                            `, true)]
                        })
                        await delay(2000)
                        if(ntargethp <= 0){
                            mwl[0] += 1;
                            twl[1] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:tada: __RESULTS:__ **WINNER!**
                                ${message.author.tag}'s **[LVL ${lvl}] ${display}** wins a victory over ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}**!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        if(nmessagehp <= 0){
                            mwl[1] += 1;
                            twl[0] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:skull: __RESULTS:__ **YOU LOST!**
                                ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** has defeated **CHALLENGER** ${message.author.tag}'s **[LVL ${lvl}] ${display}**!

                                Better luck next time!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        mdmg = Math.trunc(Math.random() * str * 50 * 0.6 * lvl)
                        tdmg = Math.trunc(Math.random() * tstr * 50 * 0.6 * tlvl)
                        ntargethp = ntargethp - mdmg
                        if(ntargethp < 0) { ntargethp = "0"}
                        nmessagehp = nmessagehp - tdmg
                        if(nmessagehp < 0) { nmessagehp = "0"}

                        message.channel.send({
                            embeds: [new MessageEmbed()
                            .setColor(message.author.color)
                            .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                            .setDescription(`
                            **[LVL ${lvl}] ${display}** vs **[LVL ${tlvl}] ${tdisplay}** [ARENA_NORMAL]

                            ${message.author.tag}'s **[LVL ${lvl}] ${display}** lunges at ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** dealing ${temojis[0]} ${client.comma(mdmg)} damage and recieves ${emojis[0]} ${client.comma(tdmg)} damage...`)
                            .addField(`${message.author.tag}'s ${display}`, `
                            ${emojis[0]} ${client.comma(nmessagehp)}
                            `, true)
                            .addField(`${usr.tag}'s ${tdisplay}`, `
                            ${temojis[0]} ${client.comma(ntargethp)}
                            `, true)]
                        })
                        await delay(2000)
                        if(ntargethp < nmessagehp){
                            mwl[0] += 1;
                            twl[1] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:tada: __RESULTS:__ **WINNER!**
                                ${message.author.tag}'s **[LVL ${lvl}] ${display}** wins a victory over ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}**!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)]
                            })
                        }
                        if(nmessagehp < ntargethp){
                            mwl[1] += 1;
                            twl[0] += 1;
                            await client.db.set(`arenanormal${message.author.id}`, mwl.join(`;`))
                            await client.db.set(`arenanormal${usr.id}`, twl.join(`;`))
                            return message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor(message.author.color)
                                .setDescription(`:skull: __RESULTS:__ **YOU LOST!**
                                ${usr.tag}'s **[LVL ${tlvl}] ${tdisplay}** has defeated **CHALLENGER** ${message.author.tag}'s **[LVL ${lvl}] ${display}**!

                                Better luck next time!
                                `)
                                .setThumbnail(`https://i.gyazo.com/8d674064d2c61cece5433878e4f47b11.png`)
                                .setFooter(`Running ${client.user.username} v${client.config.version}`, client.config.footerIMG)]
                            })
                        }
                        await client.db.set(`duelc${usr.id}`, (message.createdTimestamp + ms("5m")) - client.config.epoch);
                        await client.db.set(`duelc${message.author.id}`, (message.createdTimestamp + ms("1h")) - client.config.epoch);
                        return;

                    } else {
                        message.channel.send(`It looks like ${usr.tag} didn't want to duel you, ${message.author}. Better luck next time!`)
                        await client.db.delete(`duelreq${usr.id}`)
                        await client.db.delete(`duelreq${message.author.id}`)
                    }
                }).catch((x) => {
					console.log(x);
				    message.channel.send(`Welp, ${usr.tag} didn't respond in time.`)
                    client.db.delete(`duelreq${usr.id}`)
                    client.db.delete(`duelreq${message.author.id}`)
				});
                await delay(300000)
                await client.db.delete(`duelreq${usr.id}`)
                await client.db.delete(`duelreq${message.author.id}`)
        }
    }
}