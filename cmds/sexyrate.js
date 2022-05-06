const Discord = require("discord.js");
const { users } = require("node-os-utils");

module.exports = {
  name: "sexyrate",
  description: "find out how just how sexy you really are",
  category: "social",
async run(client, message, args) {
    let usr = await client.usr(args[0]).catch((e)=>{});
    if (!usr) usr = message.author;
    let sexyrate = Math.floor(Math.random() * 100);
    if (usr.id == client.config.owner) sexyrate = "99999999999"
    if(usr.id == "478721289381740546") sexyrate = "0"
    let curr = await client.db.get(`curralias${usr.id}`)
    if(curr == "Neko"){
      const embed1 = new Discord.MessageEmbed()
      .addField(":heart_decoration: Sexy Rate :heart_decoration: ", `${usr.tag}'s catgirl rates them....\n**${sexyrate}/100**`)
      .setThumbnail(usr.avatarURL({dynamic:true}))
      .setColor(message.author.color)
      .setTimestamp()
      message.channel.send({ embeds: [embed1] });
    } else {
      const embed1 = new Discord.MessageEmbed()
      .addField(":heart_decoration: Sexy Rate :heart_decoration: ", "I rate you, " + usr.tag + ".... " + `\n**${sexyrate}/100**`)
      .setThumbnail(usr.avatarURL({dynamic:true}))
      .setColor(message.author.color)
      .setTimestamp()
      message.channel.send({ embeds: [embed1] });
    }
  },
};