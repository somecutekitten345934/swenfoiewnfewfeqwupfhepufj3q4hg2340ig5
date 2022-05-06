const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dm",
  aliases: ["dm"],
  description: "DMs a user (bot dev only)",
  category: "botdeveloper",
  cst: "dm",
  async run(client, message, args) {
    const user = await client.usr(args[0]).catch((x) => {});
    if (!user) return message.channel.send(`You must mention the recipient in order for this command to work!`);

    const msg = args.slice(1).join(" ");
    if (!msg) return message.channel.send("You must include a message.");
    let uclr = await client.db.get("clr" + user.id) || "#00aaaa";
        uclr = uclr.split(";");
    let dmfirst = [new MessageEmbed()
      .setColor(uclr[0])
      .setDescription("A Weebchan Developer has sent you a private messsage! Here is the contents:")]
      user.send({ embeds: dmfirst });
    let emb = [new MessageEmbed()
    .setColor(uclr[0])
    .setDescription(msg.toString())
    .setFooter(`Sent by: ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))]
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has been sent the following message:`)]
    });
    message.channel.send({ embeds: emb });
    user.send({ embeds: emb });
  }
}