const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
name: "rules",
aliases: ['rules', 'rls', 'rule'],
description: 'Displays Weebineers rules',
category: 'info',
	async run(client, message, args) {
    if(message.guild.id !== `742257076637794344` || message.guild.id !== "808086568815558687"){
      return message.channel.send({
        embeds: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${client.config.emoji.err} This command only works in the Weebineers Guild discord!`)
      })
    }
    if(args[0] == "haven"){
      message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(`#f56c6c`)
        .setDescription(`
        Weebchan's Haven is a haven for players who use Weebchan, the social economy discord bot!
  
        __**DISCORD RULES**__
        **:white_small_square: SPAM/FLOOD**\nSpamming/Flooding characters, copypastas, mass mentioning, etc
        **:white_small_square: NSFW**\nPlease keep NSFW related content INSIDE our nsfw channel <#808123364891426867> | Any gore or child pornography will result in a **BAN**
        **:white_small_square: HARRASMENT**\nWe have a zero tolerance harassment policy. Doing so will result in severe punishments
        **:white_small_square: NO ADVERTISMENT**\nAdvertising Servers/Discord Invites/Websites etc
        **:white_small_square: NO BEGGING**\nBegging for coins, items, buying auction items, etc
        **:white_small_square: DO NOT BYPASS AUTOMOD**\nAttempts to bypass our AutoMod system, including anti-link will result in punishments
        **:white_small_square: LEAKING INFORMATION/DDOSING**\nLeaking IP Addresses, postal codes, or anything personal for ANYONE will result in a PERMA BAN. THIS INCLUDES ANY AND ALL THREATS, INCLUDING FALSE INFORMATION
        :white_small_square: **NO TOXICITY**\nDo not be overly toxic to another member. Joking is fine, but dont take it too far.
        :white_small_square: **NO EAR RAPE**\nDo not earrape anyone in the voice channel. This includes requesting ear rape related songs.
        :white_small_square: **NO FAKE REPORTS/SUGGESTIONS**\nPlease be mindful that all reports and suggestions must be real. I actually have to read them... Don't use them for shitposting
        `)]
      })
      message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(`#f56c6c`)
        .setDescription(`
        :white_medium_small_square: **EXTRA INFORMATION**
    Haven follows Discord Terms Of Service. Read more about it here:
    [Discord TOS](https://discord.com/terms)
        `)]
      })
      message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(`#f56c6c`)
        .setDescription(`:white_medium_small_square: **OWNER CONTACT**\nAll punishments are made by the Weebchan Haven Staff's discretion, If you have any issues or were unfairly punished, contact ${client.users.cache.get(client.config.owner).tag} <@216749228087705610>`)]
      })
      return;
    }
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(`#f56c6c`)
      .setDescription(`
      Weebineers is an anime themed hypixel skyblock guild. Here are the rules you must follow while being here!

      __**DISCORD RULES**__
      **:white_small_square: SPAM/FLOOD**\nSpamming/Flooding characters, copypastas, mass mentioning, etc
      **:white_small_square: NSFW**\nPlease keep NSFW related content INSIDE our nsfw channel <#767360179029147659> | Any gore or child pornography will result in a **BAN**
      **:white_small_square: HARRASMENT**\nWe have a zero tolerance harassment policy. Doing so will result in severe punishments
      **:white_small_square: NO ADVERTISMENT**\nAdvertising Servers/Discord Invites/Websites etc
      **:white_small_square: NO BEGGING**\nBegging for coins, items, buying auction items, etc
      **:white_small_square: DO NOT BYPASS AUTOMOD**\nAttempts to bypass our AutoMod system, including anti-link will result in punishments
      **:white_small_square: LEAKING INFORMATION/DDOSING**\nLeaking IP Addresses, postal codes, or anything personal for ANYONE will result in a PERMA BAN. THIS INCLUDES ANY AND ALL THREATS, INCLUDING FALSE INFORMATION
      :white_small_square: **NO TOXICITY**\nDo not be overly toxic to another member. Joking is fine, but dont take it too far.
      :white_small_square: **NO EAR RAPE**\nDo not earrape anyone in the voice channel. This includes requesting ear rape related songs.
      `)]
    })
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(`#f56c6c`)
      .setDescription(`
      __**GUILD CHAT RULES**__
      **:white_small_square: SPAM/FLOOD**\nSpamming/Flooding characters, copypastas, etc
      **:white_small_square: HARRASMENT**\nWe have a zero tolerance harassment policy. Doing so will result in severe punishments
      **:white_small_square: NO ADVERTISMENT**\nAdvertising Servers/Discord Invites/Websites, auctions, etc
      **:white_small_square: NO BEGGING**\nBegging for coins, items, buying auction items, etc
      :white_small_square: **NO TOXICITY**\nDo not be overly toxic to another member. Joking is fine, but dont take it too far.
      `)]
    })
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(`#f56c6c`)
      .setDescription(`
      :white_medium_small_square: **EXTRA INFORMATION**
  Weebineers follows Discord Terms Of Service. Read more about it here:
  [Discord TOS](https://discord.com/terms)
  Weebineers follows the Hypixel Network rules. Read more about it here:
  [Hypixel Rules](https://hypixel.net/rules)
      `)]
    })
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(`#f56c6c`)
      .setDescription(`:white_medium_small_square: **OWNER CONTACT**\nAll punishments are made by the Weebineers Staff's discretion, If you have any issues or were unfairly punished, contact ${client.users.cache.get(client.config.owner).tag} <@216749228087705610>`)]
    })
    }
}