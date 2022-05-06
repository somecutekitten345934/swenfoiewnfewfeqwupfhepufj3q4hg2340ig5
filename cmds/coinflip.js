const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "coinflip",
  aliases: ["coinflip", "cf"],
  description: "Bet X amount of money onto whether you get heads or tails and gain/lose it all",
  category: "ecn",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");

    let cd = await client.db.get("cfc" + message.author.id);
    let scnd = client.cooldown(message.createdTimestamp, cd);
    if (scnd) return message.channel.send(`You must wait ${scnd} ${scnd > 1 ? "seconds" : "second"} before flipping another coin!`);
    if (!(args[0] && (args[0].toLowerCase().startsWith("h") || (args[0].toLowerCase().startsWith("t"))))) return message.channel.send(`You must specify either "h" or "t" and a bet under the format: \`${message.guild.prefix}coinflip <h or t> <bet>\``);
    if(args[1] < 0){
      return message.channel.send(`${client.config.emoji.err} You may not coinflip less than ${client.config.emoji.coin} 1`)
    }
    let res = Math.round(Math.random()) == 0 ? "heads" : "tails";
    let bal = await client.db.get("bal" + message.author.id);
        bal = Number(bal);
    if(bal <= 0){
      return message.channel.send(`${client.config.emoji.err} You may not coinflip less than ${client.config.emoji.coin} 1`)
    }
    let bet = isNaN(args[1]) ? 1 : Number(args[1]);
    if (bal - bet < 0 || (bet < 0)) return message.channel.send("That number exceeds your current balance.");
    if(bet >= 250_001) return message.channel.send(`Coinflip bets may not exceed ${client.config.emoji.coin} 250,000`);
    await client.db.set("cfc" + message.author.id, (message.createdTimestamp + 1800000) - client.config.epoch);
    await client.db.delete("bal" + message.author.id);
    const channel = client.channels.cache.get(client.config.channels.transactions);
    channel.send(`[**COINFLIP**] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> **(${message.author.tag}) [${message.author.id}]**: [BALANCE = ${bal}] ${message.content}`)
    await client.db.set(`stn${message.author.id}`, 999999999999999)
    await client.db.set(`stnb${message.author.id}`, "flipping")
    let e = [new MessageEmbed()
              .setColor(message.author.color)
              .setTitle(`Coinflip - ${message.author.tag} (${client.config.emoji.coin} ${client.comma(bet)})`)
              .setDescription("**Flipping a coin...**")]
    let msg = await message.channel.send({ embeds: e });

    // NORMAL
    const chance = Math.random() * 100
    if (chance >= 70 || (cst.includes("cfw"))) {
      await client.db.set("bal" + message.author.id, (bal - bet) + (bet * 2));
      await delay(2000);
      let sads = [":(", ":/", ":c", ";(", ">:(", "(´；ω；`)", "(＃ﾟДﾟ)"]
      if (args[0].toLowerCase() == "t" || args[0].toLowerCase() == "tails"){
        res = "tails"
      } else {
        res = "heads"
      }
      msg.edit({ embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setTitle(`Coinflip - ${message.author.tag} (${client.config.emoji.coin} ${client.comma(bet)})`)
        .setDescription(`It landed ${res} up ${sads[Math.floor(Math.random() * sads.length)]}... here's your ${client.config.emoji.coin} ${client.comma(bet)} bet back, along with an extra ${client.config.emoji.coin} ${client.comma(bet)} :((`)
      ]})
    } else {
      await client.db.set("bal" + message.author.id, bal - bet);
      await delay(2000);
      if (args[0].toLowerCase() == "t" || args[0].toLowerCase() == "tails"){
        res = "heads"
      } else {
        res = "tails"
      }
      msg.edit({ embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setTitle(`Coinflip - ${message.author.tag} (${client.config.emoji.coin} ${client.comma(bet)})`)
        .setDescription(`It landed ${res} up! Thanks for the free ${client.config.emoji.coin} ${client.comma(bet)}, see you next time!`).setColor("#da0000")
      ]})
    };
    await client.db.delete("stn" + message.author.id);
    await client.db.delete("dns" + message.author.id);
    await client.db.delete("stnb" + message.author.id);
  },
};