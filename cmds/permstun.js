const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "permstun",
  aliases: [ "permstun", "knockout" ],
  cst: "permstun",
  category: 'own',
  async run(client, message, args) {
    function ln() {
      return client.comma(Math.floor(Math.random()*1000000000)) + " minutes";
    };
    if (!args.length) return message.channel.send("You must mention a user to permstun!");
    const user = await client.usr(args[0]).catch((err) => {});
    if (!user) return message.channel.send("You have not mentioned a user!!");
    let cst = await client.db.get("cst" + user.id);
        cst = cst ? cst.split(";") : [];
    cst.push("pstn");
    await client.db.set("cst" + user.id, cst.join(";"));
    await client.db.set("stnb" + user.id, "dead");
   message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has kicked ${user.tag}'s ass and sent them flying high into the stratosphere`)]
    });
    await delay(1500)
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has gotten hyperthermia and fallen unconscious for ${ln()}`)]
    });
    await delay(1500)
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has suffocated due to hypoxia and fallin in a coma for ${ln()}`)]
    });
    await delay(1500)
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has come plunging down to Earth whilst falling at terminal velocity`)]
    });
    await delay(1500)
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has died for ∞ minutes due to the injuries sustained`)]
    });
  },
};