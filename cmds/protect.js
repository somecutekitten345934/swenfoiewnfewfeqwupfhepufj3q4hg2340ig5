const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "protect",
    aliases: [ "protect" ],
    category: 'pet',
    description: "Toggle your waifu's protection from mysterious creatures...",
    async run(client, message, args) {
        let p = await client.db.get("pet" + message.author.id);
        if (!p) return message.channel.send({
			embeds: [new MessageEmbed()
			.setTitle(`Missing Waifu!`)
			.setThumbnail(client.config.thumbnail.pout)
			.setColor(client.config.colors.red)
			.setDescription(`I can't have your waifu protect you, if they dont exist! Tame one via \`${message.guild.prefix}tame\``)]
		})
        let tgl = await client.db.get("dfnd" + message.author.id);
        p = p.split(";");
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
		let pn = await client.db.get(`petname${message.author.id}`) || display;
        display = pn;
        let cst = await client.db.get("cst" + message.author.id) || "";
            cst = cst.split(";");
        if(cst.includes(`waifusleep`)){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.sleep} Sorry, your ${display} can't protect you while sleeping! Wake them up with \`${message.guild.prefix}waifu sleep\` in order to have them protect you!`)]
            })
        }
        if (Number(p[1] < 2000 && Number(p[2] <= 20))) return message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`Your ${display} must have above ${emojis[0]} 2000 & ${emojis[1]} 20 in order to protect you from different types of attacks`)
            .setThumbnail(emojis[9])
            .setFooter(`TIP: Use the Feed command to increase health and energy!`)]
        })
        if (Number(p[1]) < 2000) return message.channel.send("Your " + display + " must have above " + emojis[0] + " 2000 in order to protect you from different types of attacks");
        if (Number(p[2]) < 20) return message.channel.send("Your " + display + " must have above " + emojis[1] + " 20 in order to protect you from different types of attacks");
        if (!cst.includes("dfnd")) {
            cst.push("dfnd");
            await client.db.set("cst" + message.author.id, cst.join(";"));
            if(currAlias == "Neko"){
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`**NYAA!** ${message.author.tag}'s catgirl will now guard them wherever they adventure to!`)
                    .setImage(`https://i.gyazo.com/594281fdb4c096e676687e3a2c6dfb43.jpg`)]
                })
            } else {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${message.author.tag}'s ${display} will now attempt to defend them during different types of attacks`)]
                })
            }
        } else {
            cst = cst.filter((x) => !["dfnd"].includes(x));
            await client.db.set("cst" + message.author.id, cst.join(";"));            
            if(currAlias == "Neko"){
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`**NYAA!** ${message.author.tag}'s catgirl has headed back home and has gone to sleep! :3`)
                    .setImage(`https://i.gyazo.com/9dc3a85f6472f6beed627713deda1051.jpg`)]
                })
            } else {
                message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${message.author.tag}'s ${display} will no longer attempt to defend them during different types of attacks`)]
                })
            }            
        }
    }
}