const { MessageEmbed, MessageManager } = require('discord.js');

module.exports = {
    name: "assigntake",
    aliases: [ "assigntake", "assigndel", "assignremove" ],
    description: "Take a user's permission to assign access of waifu aliases to other users. Their co-ownership rights will be revoked.",
    category: "pet",
    async run(client, message, args) {
        if (!args.length) return message.channel.send("Please use the following format: `" + message.guild.prefix + "assigntake <user> <waifu alias>`")
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
                .setDescription(`Unknown waifu alias "${petalias}"`)]
            })
        };
        if (!petaliases[client.capital(petalias)].$ORIGINAL_PURCHASER_ID.split(";").includes(message.author.id)) {
            return message.channel.send("Only the original owner(s) may remove other users; this is to prevent ownership leakages.")
        }
        if (!owned.includes(petalias)) {
          return message.channel.send({
              embeds: [new MessageEmbed()
              .setColor(message.author.color)
              .setDescription("That user already doesn't permission over the " + petalias + " dragon alias. You may add it by using `" + message.guild.prefix + `assignadd ${user.id} ${petalias}\``)]
          });
        } else {
          owned = owned.filter((x) => x != client.capital(petalias));
          await client.db.set("assigns" + user.id, owned.join(";"));
          message.channel.send({
              embeds: [new MessageEmbed()
              .setColor(message.author.color)
              .setDescription(`${user.tag} can no longer assign users access to the ${client.capital(petalias)} waifu alias`)]
          })
      }
    }
}