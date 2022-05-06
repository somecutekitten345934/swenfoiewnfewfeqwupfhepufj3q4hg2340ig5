const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildsettings",
  aliases: ["gdst", "gds", "guildset", "guildsettings", "guild-set", "guild-setting", "guild-settings"],
  description: "Edit a guild's settings.",
  category: "server",
  async run(client, message, args) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(client.config.colors.red)
      .setTitle(`Insufficient Permission!`)
      .setDescription(`You must have the MANAGE_GUILD permission in order to set guild sided settings!`)
      .setThumbnail(client.config.thumbnail.pout)]
    });
    let gds = [["XP leveling", "xpd", "xp"], ["Packages", "pkgd", "pkg"]];
    let gdst = await client.db.get("gdst" + message.guild.id);
        gdst = gdst ? gdst.split(";") : [  ];
        console.log(gdst)
    if (args.length < 1) return message.channel.send("You must specify a valid setting to toggle! The different types of settings are: " + client.list(gds.map((g) => `\`${g[0]} [${g[2]}]\``)))
    let gd = args[0].toLowerCase();
    let indx = gds.findIndex((g) => g[2].startsWith(gd));
    if (indx < 0) return message.channel.send("You must specify a valid setting to toggle! The different types of settings are: " + client.list(gds.map((g) => `\`${g[0]} [${g[2]}]\``)))
    if (gdst.includes(gds[indx][1])) {
      //disable
      gdst = gdst.filter((f) => f != gds[indx][1]);
      message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${client.config.emoji.tick} ${message.author.tag} has re-enabled ${gds[indx][0]} on this guild.`)
        .setFooter(`Set gdst${message.guild.id} as ${gdst.join(";")}`)]
      });
      await client.db.set(`gdst${message.guild.id}`, gdst.join(";"));
    } else {
      //re-enable
      gdst.push(gds[indx][1]);
      message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${client.config.emoji.tick} ${message.author.tag} has successfully disabled ${gds[indx][0]} on this guild.`)
        .setFooter(`Successfully set gdst${message.guild.id} as ${gdst.join(";") == "" ? "null" : gdst.join(";")}`)]
      });
      await client.db.set(`gdst${message.guild.id}`, gdst.join(";"));
    };
  }, 
};