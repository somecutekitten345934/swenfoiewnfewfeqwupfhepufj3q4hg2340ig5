const Discord = require("discord.js");
const { users } = require("node-os-utils");

module.exports = {
  name: "gayrate",
  description: "find out how just how gay you really are",
  category: "social",
async run(client, message, args) {
    let usr = await client.usr(args[0]).catch((e)=>{});
    if (!usr) usr = message.author;
    let gayrate = Math.floor(Math.random() * 100);
    if (usr.id == client.config.owner) gayrate = "ITS NEGATIVE 9000"
    if(usr.id == "566441953563115550") gayrate = "100"
    if (usr.id == "478721289381740546") gayrate = "ITS OVER 9000" // windquake is now SUPER gay
    if(usr.id == '870822273014194206') gayrate = "200"
    if(usr.id == '819050451861110806') gayrate = "69,420"
    let cur = await client.db.get(`curralias${usr.id}`)
    if(cur == "Neko"){
      const embed1 = new Discord.MessageEmbed()
      .addField(`:gay_pride_flag: Gay Rate :gay_pride_flag: `, `${usr.tag}'s catgirl rates them....\n**${gayrate}/100**`)
      .setThumbnail(usr.avatarURL({dynamic:true}))
      .setColor(message.author.color)
      .setTimestamp()
      message.channel.send({ embeds: [embed1] });
    } else {
      const embed1 = new Discord.MessageEmbed()
            .addField(":gay_pride_flag: Gay Rate :gay_pride_flag: ", "I rate you, " + usr.tag + `\n**${gayrate}/100**`)
            .setThumbnail(usr.avatarURL({dynamic:true}))
            .setColor(message.author.color)
            .setTimestamp()
      message.channel.send({ embeds: [embed1] });
    }
    },
};