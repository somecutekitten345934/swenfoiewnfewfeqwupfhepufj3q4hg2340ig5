const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'badges',
  aliases: ['badges'],
  description: '<Information Not Available yet',
  usage: 'badges <user>',
  cst: "bcmd",
  async run(client, message, args){
    let user = await client.usr(args[0] || message.author.id);
      let cst = await client.db.get("cst" + user.id) || "";
      cst = cst.split(";");
          var ab = [] || [""]

          // achievement badges 

          // Higharchy Test
          if (cst.includes("abtest2")){
            ab.push("Tier 5 Test")
          } else if (cst.includes("abtest")){
            ab.push("Tier 5 Test")
          } else if (cst.includes("abtest")){
            ab.push("Tier 5 Test")
          } else if (cst.includes("abtest")){
            ab.push("Tier 5 Test")
          } else if (cst.includes("abtest")){
            ab.push("Tier 5 Test")
          }
          if (ab.length >= 9) ab.push("\n")
          if (ab.length == 0) ab.push("No Achievements!")
          
          var other = [] || [""]

          // Other Category
          if (cst.includes("srmod")){
            other.push(`${client.config.emoji.staff}`)
          } else if (cst.includes("moderator")){
            other.push(`${client.config.emoji.staff}`)
          } else if (cst.includes("tmod")){
            other.push(`${client.config.emoji.staff}`)
          }
          if (cst.includes("booster")){
            other.push("<a:booster:817541153288749107>")
          }
          if (cst.includes("bcmd")){
            other.push("<:bcmd:817541167004123156>")
          }

          if (other.length >= 9) other.push("\n")
          if (other.length == 0) other.push("No Other Badges!")
          // testing badge system
          var tbadges = [] || [""];

          if(cst.includes(""))
          if (cst.includes("test")){
            tbadges.push("<:sadge:813268598562095135>")
          }
          // test badge
          if (cst.includes("RainbowBadge")){
            tbadges.push("<a:RainbowDance:790461343898533909>")
          };
          if (tbadges.length >= 9) tbadges.push("\n")
          if (tbadges.length == 0) tbadges.push("No Testing Badges!")


    if (!user) user = message.author;
    if (user){
        message.channel.send({
            embed: new MessageEmbed()
            .setColor(message.author.color)
            .setTitle(`${user.tag}'s Badges`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Here is all the badges that ${user.tag} owns!\n` + "`;badgesguide` - View the list of earnable or obtainable badges" + `\n\n`)
            .addField("ACHIEVEMENT BADGES", `Coming Soon`)
            .addField("OTHER", `${other.join("")}`)
            .setTimestamp()
            .setFooter("W.I.P Command!")
        })
    }
  }
}