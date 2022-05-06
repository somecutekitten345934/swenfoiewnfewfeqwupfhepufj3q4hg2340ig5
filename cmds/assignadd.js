const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "assignadd",
    aliases: [ "assignadd", "assigngive" ],
    description: "Give a user permission to assign access to other users. They will not have permission to give others permission to assign, but will only be able to assign the pet alias itself.",
    category: "pet",
    async run(client, message, args) {
        if (!args.length) return message.channel.send("Please use the following format: `" + message.guild.prefix + "assignadd <user> <pet alias>`")
        const user = await client.usr(args[0]).catch((x) => {});
        if (!user) return message.channel.send("An invalid user argument was provided.");
        const petalias = client.capital(args[1]);
        const petaliases = require('../petaliases.json');
        let owned = await client.db.get("assigns" + user.id);
        if (!owned) owned = [];
        if (!Array.isArray(owned)) owned = owned.split(';');
        if (!Object.keys(petaliases).includes(petalias)) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`Unknown waifu alias "${client.capital(petalias)}"`)]
            })
        };
        if (!petaliases[client.capital(petalias)].$ORIGINAL_PURCHASER_ID.split(";").includes(message.author.id)) {
            return message.channel.send("Only the original owner(s) may add other users; this is to prevent ownership leakages.")
        }
        if (!owned.includes(petalias)) {
            owned.push(petalias)
            await client.db.set("assigns" + user.id, owned.join(";"));
            message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${user.tag} can now assign users access to the ${client.capital(petalias)} waifu alias`)]
            })
        } else {
            return message.channel.send("That user already has permission over the " + client.capital(petalias) + " waifu alias. You may remove it by using `" + message.guild.prefix + `assigntake ${user.id} ${client.capital(petalias)}\``);
        }
    }
}