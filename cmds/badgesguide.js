const { MessageEmbed, MessageAttachment } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'badgesguide',
  aliases: ['bg', "badgesg"],
  description: '<Information Not Available yet',
  usage: 'badges <user>',
  cst: "bcmd",
  async run(client, message, args){
      message.channel.send({
          embeds: [new MessageEmbed()
          .setColor(message.author.color)
          .setTitle("Weebineers Badge Guide")
          .setDescription(`Here are all the available badges that you can earn and collect!`)
          .addField(`Achievement Badges`, `
          <a:YueEnergy:814032111249653780> **YUE ADDICT** - ???
          <:nekohug:829772207797305374> **NEKO LOVER** - ???
          ??? **??** - ???
          `)
          .addField(`Hunter Badges`, `
          :bulb:  **CREATIVE HUNTER** - Suggest a major update that gets implemented
          :cloud_tornado:  **EXPLOIT HUNTER** - Awarded to those who report exploit level bugs
          <a:SenkoEnergy:823126824955412501> **WAIFU HUNTER** - Contribute a lot of pictures for picture based commands
          `)
          .addField(`Other`, `
          ${client.config.emoji.staff} **STAFF BADGE** - Awarded to the staff members of Weebineers Haven
          ${client.config.emoji.bcmd} **TESTER BADGE** - Awarded to beta testers of Weebineers
          ??? **WAIFU SUPPORTER** - Support the bot with over $100
          ??? **SUPPORTER** - Support the bot and purchase something!
          ${client.config.emoji.booster} **BOOSTER BADGE** - Awarded to players who server boost haven
          `)
          .addField(`Testing Badges (TEMPORARY SECTION)`, `${client.config.emoji.testbadge1} **TEST BADGE** - Awarded by developers for testing`)
          .setFooter(`IN DEVELOPMENT`)
          .setTimestamp()]
      })
  }
};