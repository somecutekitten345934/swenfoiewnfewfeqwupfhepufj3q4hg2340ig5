const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "dnd",
    aliases: [ "dnd", "notify" ],
    category: 'util',
    description: "Toggle whether or not you'll receive DM notifications",
    async run(client, message, args) {
      let cst = await client.db.get("cst" + message.author.id);
          cst = cst ? cst.split(";") : [];
      if (cst.includes("dnd")) {
        cst = cst.filter((x) => !["dnd"].includes(x));
        await client.db.set("cst" + message.author.id, cst.join(";"));            
        message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`You will now receive direct message notifications`)]
        });
      } else {
        cst.push("dnd");
        await client.db.set("cst" + message.author.id, cst.join(";"));
        message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`You will no longer receive direct message notifications`)]
        });
      };
    },
};