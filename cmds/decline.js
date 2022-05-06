const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "decline",
  aliases: ["decline", "denyapp"],
  description: "decline someone's guild app",
  cst: "srmod",
  async run(client, message, args) {
    message.channel.send(`Haha command no work, have fun`)
    return
		if (message.guild.id != client.config.supportServer) {
      return message.channel.send("this command only works in our support server! Join by using `" + message.guild.prefix + "haven`");
  };    
  let user = await client.usr(args[0]).catch((x) => {});
  if (!user) return message.channel.send("You must mention a user whose application you wish to decline!");
    let cst = await client.db.get("cst" + user.id) || "";
        cst = cst.split(";");
    if (!cst.includes("sbmt")) return message.channel.send("That user hasn't submitted their staff application yet!");
    let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
    if (!ch) return message.channel.send("That user has not applied for staff.");
    client.channels.cache.get(client.config.channels.appNotifs)
      .send(`Application ${ch} submitted by ${user.tag} (${user.id}) has been **declined** by ${message.author.tag} (${message.author.id})`)
      let em = new MessageEmbed()
      .setColor(client.config.colors.red)
      .setDescription(`Sorry, but your Staff Application has been declined.`)
      .addField("Manager", message.author.tag)
      .addField("Reason", args.slice(1).join(" ") || "Please contact me for your reason.");
      message.channel.send({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag}'s Staff Application has been declined by ${message.author.tag}; they have been sent the following message:`)
    });
    message.channel.send({ embed: em });
    user.send({ embed: em });
  }
};