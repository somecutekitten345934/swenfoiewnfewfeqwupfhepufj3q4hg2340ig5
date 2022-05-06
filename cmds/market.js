const { MessageEmbed } = require('discord.js');
const { isValidObjectId } = require('mongoose');

module.exports = {
    name: "market",
	description: "The official waifu market owned by SemiShy",
    aliases: ["market"],
    category: "pet",
    async run(client, message, args) {
        let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";")

//        if(!cst.includes(`botdeveloper`)) return message.channel.send(`<:WeebChan:832363728690741298> Nishio has collected too many waifus and the market has overfilled! Check back later!`)

        let alias = await client.db.get("petaliases" + message.author.id) || "";
        alias = alias.split(";")
        let fmsg = await client.db.get(`footer872518881489612910`) || "No Footer Set!";
        let fpic = await client.db.get(`footerpic872518881489612910`) || "https://i.gyazo.com/0cab7d6004125b86e103ebcebb252c4c.jpg"
        let icon = await client.db.get(`icon872518881489612910`) || "https://i.gyazo.com/07e06f35b6e279d89439365546c65827.jpg"

		let owns = {
			Nishi: alias.includes("Nishi"),
            Me: alias.includes("Me!Me!Me!"),
            ZeroTwo: alias.includes("ZeroTwo"),
            Astolfo: alias.includes("Astolfo"),
            Nezuko: alias.includes("Nezuko"),
            Megumin: alias.includes("Megumin"),
            Senko: alias.includes("Senko"),
            Rem: alias.includes("Rem"),
            Rias: alias.includes("Rias"),
            Albedo: alias.includes("Albedo"),
            Chika: alias.includes("Chika"),
            Mai: alias.includes("Mai"),
            Rikka: alias.includes("Rikka"),
            Shiro: alias.includes("Shiro"),
            WeebChan: alias.includes("Weebchan"),
            Hatsune: alias.includes("HatsuneMiku"),
            Yuno: alias.includes("Yuno"),
            SemiMute: alias.includes(`SemiMute`),
            Sagiri: alias.includes(`Sagiri`),
            Shir: alias.includes(`Shir`),
            Rin: alias.includes(`Rin`),
            Tohru: alias.includes(`Tohru`),
            Lucoa: alias.includes(`Lucoa`),
            Discordchan: alias.includes(`Discordchan`),
            Aqua: alias.includes(`Aqua`),
            Umaru: alias.includes(`Umaru`),
            Nagatoro: alias.includes(`Nagatoro`)
        }
        if(!args.length){ 
            return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(`#000101`)
            .setTitle(`__Waifu Market__`)
            .setDescription(`
Here is the selection of waifus you can purchase from the market.

[1] <:OniCredit:838603021976993823> • **Oni** ${owns.Nishi ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 10k`}
[2] <:MeIntel:829414781727146005> • **Me!Me!Me!** ${owns.Me ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 30k`}
[3] <:02Affection:829180821930770462> • **ZeroTwo** ${owns.ZeroTwo ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 55k`}
[4] <:AstolfoGylc:821320297755049995> • **Astolfo** ${owns.Astolfo ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 65k`}
[5] <:MeguminAffection:830115120692461648> • **Megumin** ${owns.Megumin ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 80k`}
[6] <:NezukoCredits:829761025305215036> • **Nezuko** ${owns.Nezuko ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 100k`}
[7] <a:SenkoExperience:823126849429176390> • **Senko** ${owns.Senko ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 150k`}
[8] <:RemGylc:820875270654918656> • **Rem** ${owns.Rem ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 175k`}
[9] <a:RiasExperience:829411711824035840> • **Rias** ${owns.Rias ? ` ${client.config.emoji.tick}` : `- SOLD OUT`}
[10] <a:AlbedoExperience:831016840301510687> • **Albedo** ${owns.Albedo ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 225k`}
[11] <a:ChikaGlyc:832320442139279361>  • **Chika** ${owns.Chika ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 50k`}
[12] <:MaiExperience:837104460186517524>  • **Mai** ${owns.Mai ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 60k`}
[13] <a:RikkaExp:836353843691257887>  • **Rikka** ${owns.Rikka ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 50k`}
[14] <:ShiroExperience:836377732455202856>  • **Shiro** ${owns.Shiro ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 40k`}
[15] <:WeebChan:832363728690741298>  • **Weeb~chan** ${owns.WeebChan ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 500k`}
${client.config.emoji.loading} __Showing page 1/2__... (( \`${message.guild.prefix}market page2\` ))

Purchase your own alias via \`${message.guild.prefix}market <id>\`
            `)
            .setThumbnail(icon)
            .setImage(fpic) 
            .setFooter(`${fmsg}`)]
        })
    }
        let cmd = args[0].toLowerCase()
        if(cmd == "page2") // PAGE 2 OF THE MARKET
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(`#000101`)
            .setTitle(`__Waifu Market__`)
            .setDescription(`
Here is the selection of waifus you can purchase from the market.

[16] <:HatsuneIntel:836847969709719622> • **Hatsune Miku** ${owns.Hatsune ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 150k`}
[17] <:YunoIntel:837099882866671627> • **Yuno** ${owns.Yuno ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 80k`}
[18] ${client.config.emoji.testbadge1} • **SemiMute** ${owns.SemiMute ? ` ${client.config.emoji.tick}` : `- SOLD OUT`}
[19] <:SagiriStrength:838621436750200842> • **Sagiri** ${owns.Sagiri ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 75k`}
[20] <:ShirEnergy:839714163781926933> • **Shiro** ${owns.Shir ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 150k`}
[21] <:RinStrength:839718150785990687> • **Rin** ${owns.Rin ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 200k`}
[22] <a:TohruEnergy:840739572131954718> • **Tohru** ${owns.Tohru ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 160k`}
[23] <a:LucoaEnergy:840739989356412969> • **Lucoa** ${owns.Lucoa ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 200k`}
[24] <:DiscordCredit:853780703266209862> • **Discordchan** ${owns.Discordchan ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 250k`}
[25] <:AquaIntel:854752598165553193> • **Aqua** ${owns.Aqua ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 120k`}
[26] <a:UmaruEXP:861819720133771264> • **Umaru** ${owns.Umaru ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 150k`}
[27] <:NagatoroStrength:862401864468004924> • **Nagatoro** ${owns.Nagatoro ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 200k`}

${client.config.emoji.loading} __Showing page 2/2__...
        `)
        .setThumbnail(icon)
        .setImage(fpic) 
        .setFooter(`${fmsg}`)]
        })
        let v = await client.db.get(`marketv872518881489612910`) || 0;
        v = Number(v)
        let bal = await client.db.get(`bal${message.author.id}`) || 0;
        bal = Number(bal)
        let ov = await client.db.get(`marketo872518881489612910`) || 0;
        ov = Number(ov)
        nbal = v + bal;
        nbal = Number(nbal)
        if(args[0] == "check" && cst.includes(`marketw`)){
            return message.channel.send(`${client.config.emoji.vault} The market vault currently holds ${client.config.emoji.coin} ${client.comma(v)}\nOverall, the market has made ${client.config.emoji.coin} ${client.comma(ov)}`)
        }
        if(cmd == "footer" && cst.includes(`marketw`)){
            if(!args[1]){
                return message.channel.send(`${client.config.emoji.err} The market's footer may not be undefined. Try putting some text and try again.`)
            }
            var footer = args.slice(1).join(' ');
            if(footer.length > 250){
                return message.channel.send(`${client.config.emoji.err} The footer message may not exceed 250 characters`)
            } else {
                await client.db.set(`footer872518881489612910`, footer)
                return message.channel.send(`${client.config.emoji.tick} Set the market footer as "${footer}"`)
            }
        }
        if(cmd == "footerpic" && cst.includes(`marketw`)){
            if(!args[1]){
                return message.channel.send(`${client.config.emoji.err} The market's footer image may not be undefined. Try putting a valid image.`)
            } else {
                await client.db.set(`footerpic872518881489612910`, args[1])
                return message.channel.send(`${client.config.emoji.tick} Set the market footer image as "${args[1]}"`)
            }
        }
        if(cmd == "icon" && cst.includes(`marketw`)){
            if(!args[1]){
                return message.channel.send(`${client.config.emoji.err} The market's icon may not be undefined. Try putting a valid image.`)
            } else {
                await client.db.set(`icon872518881489612910`, args[1])
                return message.channel.send(`${client.config.emoji.tick} Set the market icon image as "${args[1]}"`)
            }
        }
        if(args[0] == "withdraw" && cst.includes(`marketw`)){
            if(v == 0) return message.channel.send(`${client.config.emoji.err} The markets vault does not currently have any money. Try again later!`)
            message.channel.send(`${client.config.emoji.tick} Successfully withdrawn ${client.config.emoji.coin} ${client.comma(v)} from the market vault`)
            await client.db.delete(`marketv872518881489612910`)
            await client.db.set(`bal${message.author.id}`, `${nbal}`)
            return;
        }
        if(args[0] == "setv" && message.author.id == client.config.owner){
            if(isNaN(args[1])){
                return message.channel.send(`${client.config.emoji.err} Second argument either not present or is NaN`)
            }
            num = Number(args[1])
            await client.db.set(`marketv872518881489612910`, `${num}`)
            return message.channel.send(`${client.config.emoji.tick} Successfully set value marketv872518881489612910 as ${num}`)
        }
        if(args[0] == "wipemarket" && message.author.id == client.config.owner){
            await client.db.delete(`marketv872518881489612910`)
            return message.channel.send(`${client.config.emoji.tick} Successfully deleted database value marketv872518881489612910`)
        }
        if(args[0] == "wipeomarket" && message.author.id == client.config.owner){
            await client.db.delete(`marketo872518881489612910`)
            return message.channel.send(`${client.config.emoji.tick} Successfully deleted database value marketo872518881489612910`)
        }
        let t = parseInt(args[0]);
        if (!isNaN(args[1])) {
            if (Number(args[1]) <= 0) args[1] = 1;
        }
        let things = [
			{ number: 1, price: 10_000 },
			{ number: 2, price: 30_000},
            { number: 3, price: 55_000 },
            { number: 4, price: 65_000 },
            { number: 5, price: 80_000 },
            { number: 6, price: 100_000 },
            { number: 7, price: 150_000 },
            { number: 8, price: 175_000 },
            { number: 9, price: 1 },
            { number: 10, price: 225_000 },
            { number: 11, price: 50_000} ,
            { number: 12, price: 60_000 },
            { number: 13, price: 50_000 },
            { number: 14, price: 40_000 },
            { number: 15, price: 500_000 },
            { number: 16, price: 150_000 },
            { number: 17, price: 80_000 },
            { number: 18, price: 2 },
            { number: 19, price: 75_000},
            { number: 20, price: 150_000},
            { number: 21, price: 200_000},
            { number: 22, price: 160_000},
            { number: 23, price: 200_000},
            { number: 24, price: 250_000},
            { number: 25, price: 120_000},
            { number: 26, price: 150_000},
            { number: 27, price: 200_000}
		];
		let valid = things.map(({ number }) => number);
		if (!t || (!valid.includes(t))) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		if (!bal || (bal == 0)) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);
		if (bal - things[valid.indexOf(t)].price < 0) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);

        if (t == 1) {
			let owns = alias.includes("Nishi")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:OniCredit:838603021976993823> Oni alias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Nishi`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:OniCredit:838603021976993823> Oni alias. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 2) {
			let owns = alias.includes("Me!Me!Me!")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:MeIntel:829414781727146005> Me!Me!Me! alias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Me!Me!Me!`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:MeIntel:829414781727146005> Me!Me!Me!. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 3) {
			let owns = alias.includes("ZeroTwo")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:02Affection:829180821930770462> ZeroTwo alias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`ZeroTwo`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:02Affection:829180821930770462> ZeroTwo. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 4) {
			let owns = alias.includes("Astolfo")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:AstolfoGylc:821320297755049995> Astolfo alias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Astolfo`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:AstolfoGylc:821320297755049995> Astolfo. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 5) {
			let owns = alias.includes("Megumin")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:MeguminAffection:830115120692461648> Megumin aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Megumin`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:MeguminAffection:830115120692461648> Megumin. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 6) {
			let owns = alias.includes("Nezuko")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:NezukoCredits:829761025305215036> Nezuko aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Nezuko`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:NezukoCredits:829761025305215036> Nezuko. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 7) {
			let owns = alias.includes("Senko")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:SenkoExperience:823126849429176390> Senko aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Senko`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:SenkoExperience:823126849429176390> Senko. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 8) {
			let owns = alias.includes("Rem")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:RemGylc:820875270654918656> Rem aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Rem`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:RemGylc:820875270654918656> Rem. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 9) {
			let owns = alias.includes("Rias")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:RiasExperience:829411711824035840> Rias aias! View your aliases via \`;waifualias\``) }
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} The alias <a:RiasExperience:829411711824035840> Rias is sold out!`)]
            })
            return;
		}
        if (t == 10) {
			let owns = alias.includes("Albedo")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:AlbedoExperience:831016840301510687> Albedo aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Albedo`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:AlbedoExperience:831016840301510687> Albedo. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 11) {
			let owns = alias.includes("Chika")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:ChikaGlyc:832320442139279361> Chika aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Chika`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:ChikaGlyc:832320442139279361> Chika. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 12) {
			let owns = alias.includes("Mai")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:MaiExperience:837104460186517524> Mai aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Mai`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:MaiExperience:837104460186517524> Mai. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 13) {
			let owns = alias.includes("Rikka")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:RikkaExp:836353843691257887> Rikka aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Rikka`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:RikkaExp:836353843691257887> Rikka. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 14) {
			let owns = alias.includes("Shiro")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:ShiroExperience:836377732455202856> Shiro aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Shiro`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:ShiroExperience:836377732455202856> Shiro. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 15) {
			let owns = alias.includes("Weebchan")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:WeebChan:832363728690741298> Weeb~chan aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Weebchan`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:WeebChan:832363728690741298> Weeb~chan. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 16) {
			let owns = alias.includes("HatsuneMiku")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:HatsuneIntel:836847969709719622> Hatsune Miku aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`HatsuneMiku`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:HatsuneIntel:836847969709719622> Hatsune Miku. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 17) {
			let owns = alias.includes("Yuno")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:YunoIntel:837099882866671627> Yuno aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Yuno`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:YunoIntel:837099882866671627> Yuno. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 18) {
			let owns = alias.includes("SemiMute")
			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the ${client.config.emoji.testbadge1} SemiMute aias! View your aliases via \`;waifualias\``) }
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} The alias ${client.config.emoji.testbadge1} SemiMute is sold out!`)]
            })
            return;
		}
        if (t == 19) {
			let owns = alias.includes("Sagiri")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:SagiriStrength:838621436750200842> Sagiri aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Sagiri`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:SagiriStrength:838621436750200842> Sagiri. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 20) {
			let owns = alias.includes("Shir")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:ShirEnergy:839714163781926933> Shiro aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Shir`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:ShirEnergy:839714163781926933> Shiro. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 21) {
			let owns = alias.includes("Rin")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:RinStrength:839718150785990687> Rin aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Rin`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:RinStrength:839718150785990687> Rin. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 22) {
			let owns = alias.includes("Tohru")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:TohruEnergy:840739572131954718> Tohru aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Tohru`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:TohruEnergy:840739572131954718> Tohru. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 23) {
			let owns = alias.includes("Lucoa")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:LucoaEnergy:840739989356412969> Lucoa aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Lucoa`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:LucoaEnergy:840739989356412969> Lucoa. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 24) {
			let owns = alias.includes("Discordchan")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:DiscordCredit:853780703266209862> Discord~chan aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Discordchan`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:DiscordCredit:853780703266209862> Discord~chan. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 25) {
			let owns = alias.includes("Aqua")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:AquaIntel:854752598165553193> Aqua aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Aqua`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:AquaIntel:854752598165553193> Aqua. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 26) {
			let owns = alias.includes("Umaru")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <a:UmaruEXP:861819720133771264> Umaru aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Umaru`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <a:UmaruEXP:861819720133771264> Umaru. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
        if (t == 27) {
			let owns = alias.includes("Nagatoro")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:NagatoroStrength:862401864468004924> Nagatoro aias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`marketv872518881489612910`, nv)
            await client.db.set(`marketo872518881489612910`, nov)
            alias.push(`Nagatoro`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:NagatoroStrength:862401864468004924> Nagatoro. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
    }
}