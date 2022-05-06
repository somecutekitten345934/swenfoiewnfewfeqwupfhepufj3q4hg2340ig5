const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "keywords",
  aliases: ["keywords"],
  description: "Shows you a list of the bot's keywords. These are enabled by default and cannot be disabled.",
  category: "info",
  async run(client, message, args) {
    let kws = ["allmoney", "alldolphin", "allshark", "allblowfish", "alltropical", "allfish", "alldark", "alliron", "allsilver", "allgold", "allmeteorite", "allruby"];
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setTitle("Bot Keywords")
      .setDescription(
        `
        Here's a list of keywords which the bot automatically replaces in every message it receives. Note that these cannot be disabled and are the same for everyone.
        You can use these interchangeably between commands. For example, \`${message.guild.prefix}pay @User#1234 allmoney\` will pay User#1234 all of the author's balance.

        ${kws.map((x) => "`" + x + "`").join(", ")}

        (\`alldark\` is your amount of darkness potions)
        `
      )]
    })
  }
}