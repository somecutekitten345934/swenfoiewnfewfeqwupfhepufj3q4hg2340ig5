const { MessageEmbed } = require('discord.js');
const { isValidObjectId } = require('mongoose');

module.exports = {
    name: "store",
	description: "SemiMute's permission and alias store",
    async run(client, message, args) {
        let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";")

        let alias = await client.db.get("petaliases" + message.author.id) || "";
        alias = alias.split(";")
        let fmsg = await client.db.get(`footer216749228087705610`) || "No Footer Set!";

		let owns = {
			Kanna: alias.includes("Kanna"),
            Example: cst.includes("Example"),
            Kaede: alias.includes(`Kaede`)
        }
        if(!args.length){ 
            return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(`#000101`)
            .setTitle(`__SemiMute's Store__`)
            .setDescription(`
Here is the selection of permissions or aliases you can purchase from the store.

Purchase your own alias via \`;store <id>\`
            `)
            .addField(`ALIASES`, `
[001] <:KannaEner:812123143601782787> • **Kanna Alias** ${owns.Kaede ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} 10M`}
[002] SOON • **Kaede Alias** ${owns.Kaede ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} ???`}
            `)
            .addField(`PERMISSIONS`, `
[101] COMING SOON! • **??? Permission** ${owns.Colorist ? ` ${client.config.emoji.tick}` : `- ${client.config.emoji.coin} ???`}
            `)
            .setThumbnail(`https://i.gyazo.com/17abc5a2cc11e33b63de8ae2ae398076.png`)
            .setImage(`https://i.gyazo.com/c12356652679a98ab075a18ec3635da9.jpg`) 
            .setFooter(`${fmsg}`)]
        })
    }
        let v = await client.db.get(`marketv216749228087705610`) || 0;
        v = Number(v)
        let bal = await client.db.get(`bal${message.author.id}`) || 0;
        bal = Number(bal)
        let ov = await client.db.get(`marketo216749228087705610`) || 0;
        ov = Number(ov)
        nbal = v + bal;
        nbal = Number(nbal)
        if(args[0] == "check" && cst.includes(`storew`)){
            return message.channel.send(`${client.config.emoji.vault} The market vault currently holds ${client.config.emoji.coin} ${client.comma(v)}\nOverall, the market has made ${client.config.emoji.coin} ${client.comma(ov)}`)
        }
        if(args[0] == "footer" && cst.includes(`storew`)){
            if(!args[1]){
                return message.channel.send(`${client.config.emoji.err} The market's footer may not be undefined. Try putting some text and try again.`)
            }
            var footer = args.slice(1).join(' ');
            if(footer.length > 250){
                return message.channel.send(`${client.config.emoji.err} The footer message may not exceed 250 characters`)
            } else {
                await client.db.set(`footer216749228087705610`, footer)
                return message.channel.send(`${client.config.emoji.tick} Set the market footer as "${footer}"`)
            }
        }
        if(args[0] == "withdraw" && cst.includes(`storew`)){
            if(v == 0) return message.channel.send(`${client.config.emoji.err} The markets vault does not currently have any money. Try again later!`)
            message.channel.send(`${client.config.emoji.tick} Successfully withdrawn ${client.config.emoji.coin} ${client.comma(v)} from the market vault`)
            await client.db.delete(`marketv216749228087705610`)
            await client.db.set(`bal${message.author.id}`, `${nbal}`)
            return;
        }
        if(args[0] == "setv" && message.author.id == client.config.owner){
            if(isNaN(args[1])){
                return message.channel.send(`${client.config.emoji.err} Second argument either not present or is NaN`)
            }
            num = Number(args[1])
            await client.db.set(`storev216749228087705610`, `${num}`)
            return message.channel.send(`${client.config.emoji.tick} Successfully set value storev216749228087705610 as ${num}`)
        }
        if(args[0] == "wipestore" && message.author.id == client.config.owner){
            await client.db.delete(`storev216749228087705610`)
            return message.channel.send(`${client.config.emoji.tick} Successfully deleted database value storev216749228087705610`)
        }
        if(args[0] == "wipeostore" && message.author.id == client.config.owner){
            await client.db.delete(`storeo808902389952020501`)
            return message.channel.send(`${client.config.emoji.tick} Successfully deleted database value storeo216749228087705610`)
        }
        let t = parseInt(args[0]);
        if (!isNaN(args[1])) {
            if (Number(args[1]) <= 0) args[1] = 1;
        }
        let things = [
			{ number: 1, price: 10_000_000 },
		];
		let valid = things.map(({ number }) => number);
		if (!t || (!valid.includes(t))) return message.channel.send("You must provide a valid ID of what you wish to purchase!");
		if (!bal || (bal == 0)) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);
		if (bal - things[valid.indexOf(t)].price < 0) return message.channel.send(`You don't have enough ${client.config.emoji.coin} to purchase that item!`);

        if (t == 1) {
			let owns = alias.includes("Kanna")
            pce = things[valid.indexOf(t)].price;
            nv = v + things[valid.indexOf(t)].price;
            nov = ov + things[valid.indexOf(t)].price;

			if (!owns) {} else { return message.channel.send(`${client.config.emoji.err} You already own the <:KannaEner:812123143601782787> Kanna alias! View your aliases via \`;waifualias\``) }

			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
            await client.db.set(`storev216749228087705610`, nv)
            await client.db.set(`storeo216749228087705610`, nov)
            alias.push(`Kanna`)
			await client.db.set("petaliases" + message.author.id, alias.join(";"));
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.tick} Successfully purchased <:KannaEner:812123143601782787> Kanna alias. View your waifu aliases via \`;waifualias\``)]
            })
            return;
		}
    }
}