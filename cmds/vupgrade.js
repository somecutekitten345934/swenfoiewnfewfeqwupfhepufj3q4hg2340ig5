const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vupgrade",
  aliases: ["vupgrade", "vupgr"],
  description: "Upgrade your vault, costing 500 at first, but every time you upgrade, the more you'll need to pay the next time you upgrade again.",
  category: "ecn",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("bvault")) return message.channel.send("You must own a Bank Vault in order to use this command!")
    let bal = await client.db.get("bal" + message.author.id) || 0;
        bal = Number(bal);
    let v = await client.db.get("v" + message.author.id) || "1;0";
        v = v.split(";");
        v[0] = Number(v[0]);
    if (v[0] == 9999999999) return message.channel.send("Bruh you already have a maxvault...");
    if ((args[0] || "").toLowerCase() == "max") {
      let cbal = bal;
      let loops = 0;
      let levelups = 0;
      while (cbal >= 0) {
        let cost = (v[0] + loops) * 500;
        cbal -= cost;
        if (cbal < cost) {
          break;
        } else {
          loops += 1;
          levelups += 1;
        }
      };
      if (levelups == 0) return message.channel.send(`Sorry mate, but you need at least ${client.config.emoji.coin} ${client.comma(v[0] * 500)} in order to upgrade your bnk vault!`);
      v[0] += levelups;
      await client.db.set("bal" + message.author.id, cbal)
      await client.db.set("v" + message.author.id, v.join(";"))
      return message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.comma(v[0])}! It can now hold ${client.config.emoji.coin} ${client.comma(v[0] * 15000)}`)]
      });  
    };
    let cns = v[0] * 500;
    if (bal - cns < 0) return message.channel.send("You must have at least" + `${client.config.emoji.coin} ${client.comma(cns)} ` + " in order to upgrade your Bank Vault.");
    v[0] += 1;

    await client.db.set("bal" + message.author.id, bal - cns)
    await client.db.set("v" + message.author.id, v.join(";"))
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.comma(v[0])}! It can now hold ${client.config.emoji.coin} ${client.comma(v[0] * 15000)}`)]
    });
  },
};