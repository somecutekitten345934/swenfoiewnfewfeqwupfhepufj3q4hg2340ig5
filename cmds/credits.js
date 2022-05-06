const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "credits",
  aliases: ["cred", "crdt", "credit" ],
  description: "Shows how much credit you have",
  category: "info",
  async run(client, message, args) {
    async function crdt(id, tag) {
      let crd = await client.db.get("crdt" + id) || 0;
      if (isNaN(crd)) crd = 0;    
      crd = Number(crd);
      const embed = [new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`${tag}'s Donor Credit`)
      .setDescription(
        `\`${message.guild.prefix}donate\` - to purchase donator credit;\n\`${message.guild.prefix}perks\` - See pricing and information`
      )
      .addField("Available Credit", "$" + client.noExponents(crd))]

      message.channel.send({ embeds: [embed] })
    };
    let user = await client.usr(args[0]).catch((x) => {});
    if (!user) user = message.author;
    let p = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
    p = p.split(";");
    if (p[8] != "1") {
      crdt(message.author.id, message.author.tag) 
    } else {
      crdt(user.id, user.tag)
    };
  }
            
} 