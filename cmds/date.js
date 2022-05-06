const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "date",
    aliases: ["date"],
    description: "Take your waifu on a date, gaining affection",
    category: 'ecn',
	async run(client, message, args) {
        let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");

        let cd = await client.db.get("datec" + message.author.id);
        cd = Number(cd);
        let scnd = client.cooldown(message.createdTimestamp, cd);

        let id = message.author.id
        let pet = await client.db.get('pet' + id);
        if (!pet) {
            return message.channel.send(`${message.author.id == id ? `You don't own a waifu!` : `${tag} does not own a pet!`} Why not tame one by using \`${message.guild.prefix}tame\``)
        };
        const currAlias = await client.db.get("curralias" + id) || "default";
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
                display = "Waifu";
                emojis = client.config.defaults.PET_EMOJIS;
            }
        }
        let pn = await client.db.get(`petname${message.author.id}`) || display;
        display = pn;
        let data = await client.db.get(`pet` + message.author.id)
        data = data.split(";");
        if (data.length < 9) return message.channel.send("Your pet's data must be at least 9 elements long. To fix this, please contact `" + client.users.cache.get(client.config.owner).tag + "`.");
        "level;health;energy;exp;credits;intel;endur;str;affec;glycogenesis"

        if(cst.includes(`waifusleep`)){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.sleep} Sorry, your ${display} can't go on a date while sleeping! Wake them up with \`${message.guild.prefix}waifu sleep\` for them to go out with you!`)]
            })
        }
        let petuse = await client.db.get(`petuse${message.author.id}`)
        if(petuse){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} Your ${display} is not currently by your side! You may not go on a date with her until she returns...`)]
            })
        }
        if (scnd) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setThumbnail(emojis[9])
                .setDescription(`${client.config.emoji.err} You took your ${display} on a date too recently! Try taking them on a date in ${scnd}.`)]
            });
        };
        

        //COOLDOWN STUFF
        let health = Number(data[1]);
        let affec = Number(data[8]);
        let energy = Number(data[2]);                                     
        let xp = Number(data[3]);
        let cred = Number(data[4]);
        let intel = Number(data[5]);
        let endur = Number(data[6]);
        let str = Number(data[7]);
        let glyc = Number(data[9]);
        let lvl = Number(data[0]);

        if(affec <= 3){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setThumbnail(emojis[9])
                .setDescription(`${client.config.emoji.err} It seems your ${display}'s ${emojis[7]} to you is much too low, and you are unable to go on a date with them. Try \`${message.guild.prefix}stroke\` in the meantime.`)]
            })
        }

        const place = [
            `the movies`,
            `the beach`,
            `the park`,
            `the cafe`,
            `the hot tub ( ͡° ͜ʖ ͡°)`
        ]
        if(energy !== 100){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setThumbnail(emojis[9])
                .setDescription(`${message.author.tag}'s ${display} refuses to get out of bed for a date since she is not at full energy. Fill up your waifus energy with` + " `;feed` and try again")]
            })
        }
        if(health <= 7500){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setThumbnail(emojis[9])
                .setDescription(`:broken_heart: I'm too injured to go on a date right now! Why not feed me to get me above **7,500** health by using` + message.guild.prefix + " `;feed`?")]
            })
        }
        let affecGained = Math.trunc(Math.random() * (4 - 2) + 2);
        let itemmsg;
        let inventory = await client.getInventoryString(`${message.author.id}`) || ""
        let item = await client.getItem(`PINK_PENDANT`)
        if(cst.includes(`PINK_PENDANT`)){
            if(inventory.includes(`PINK_PENDANT`)){
                affecGained = Math.trunc(Math.random() * (6 - 2) + 2);
            }
        }

        if(pet){
            let bal = await client.db.get(`bal${message.author.id}`);
            let newbal = bal + Math.trunc(Math.random() * 25000 / 5);
            if (newbal <= 500){
                newbal = 750
            }
            if (Math.trunc(Math.random() * 100) >= 75){
                let healthloss = Math.trunc(Math.random() * (2500 - 100) + 100);
                healthloss = Number(healthloss)
                let newhealth = Number(health - healthloss);
                data[1] = newhealth;

                let sts = (message.createdTimestamp + 21_600_000) - client.config.epoch;
                await client.db.set('datec' + message.author.id, sts);

                await client.db.set(`pet` + message.author.id, data.join(";"));
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setThumbnail(emojis[9])
                    .setDescription(`${message.author.tag}'s ${display} trips and falls, losing ${emojis[0]}${healthloss}. ${display} is now stuck in the hospital for 6 hours ${client.config.emoji.sadge}`)]
                })

            } else if (Math.trunc(Math.random() * 100) <= 25){ // 25% to gain money on dating
                // money calculation 
                let amtgained = Math.trunc(Math.random() * 5000 / 2)
                amtgained = Number(amtgained)
                let oldbal = await client.db.get(`bal${message.author.id}`)
                oldbal = Number(oldbal)
                let newbal = Number(amtgained + oldbal)

                affecGained = Number(affecGained)
                let newaffec = Number(affec + affecGained);
                data[8] = newaffec;
                await client.db.set(`pet` + message.author.id, data.join(";"));
                await client.db.set(`bal` + message.author.id, newbal)

                let sts = (message.createdTimestamp + 86_400_000) - client.config.epoch;
                await client.db.set('datec' + message.author.id, sts);

                return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setThumbnail(emojis[9])
                .setTitle(`Affection Gained!`)
                .setDescription(`You have taken your ${display} on a date to ${place[~~(Math.random() * place.length)]}. Your ${display} discovers ${client.config.emoji.coin} ${amtgained} and has gained ${emojis[7]} ${affecGained} to you!\n\n${inventory.includes(`PINK_PENDANT`) ? `Your **${item.NAME_PROPER}** (\`${item.NAME}\`) has gained you bonus ${emojis[7]}!` : ``}`)
                .setFooter(`TIP: If you fail your date, your cooldown is reduced and you can retry in 6 hours`)]
                })
            } else { // normal dates if user does not discover coins

                affecGained = Number(affecGained)
                let newaffec = Number(affec + affecGained);
                data[8] = newaffec;
                await client.db.set(`pet` + message.author.id, data.join(";"));

                await client.db.set(`bal` + message.author.id, newbal)

                let sts = (message.createdTimestamp + 86_400_000) - client.config.epoch;
                await client.db.set('datec' + message.author.id, sts);

                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setThumbnail(emojis[9])
                    .setTitle(`Affection Gained!`)
                    .setDescription(`You have taken your ${display} on a date to ${place[~~(Math.random() * place.length)]}. Your ${display} has gained ${emojis[7]} ${affecGained} to you from your outing!\n\n${inventory.includes(`PINK_PENDANT`) ? `Your **${item.NAME_PROPER}** has gained you bonus ${emojis[7]}!` : ``}`)
                    .setFooter(`TIP: If you fail your date, your cooldown is reduced and you can retry in 6 hours`)]
                })
                return;
            }
        }
        message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`An unexpected error has occured with your date! Report this issue to ${client.config.owner.tag}!`)]
        })
    }
}