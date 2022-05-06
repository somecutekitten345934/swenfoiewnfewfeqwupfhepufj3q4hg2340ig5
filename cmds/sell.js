const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "sell",
  aliases: ["sell"],
  description: "Sell some of your items off",
  category: "ecn",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("slrprmt")) return message.channel.send(`You must own a ${client.config.emoji.permit} Seller's Permit in order to sell items!`);
    function identify(x) {
      if (x.startsWith("dolp")) {
        return {
          item: [ "Dolphin", ":dolphin:", 0 ],
          rate: 7,
          f: true
        }
      } else if (x.startsWith("sha")) {
        return {
          item: [ "Shark", ":shark:", 1 ],
          rate: 8,
          f: true
        }
      } else if (x.startsWith("blow")) {
        return {
          item: [ "Blowfish", ":blowfish:", 2 ],
          rate: 4,
          f: true
        }
      } else if (x.startsWith("tro")) {
        return {
          item: [ "Tropical Fish", ":tropical_fish:", 3 ],
          rate: 6,
          f: true
        }
      } else if (x.startsWith("fish")) {
        return {
          item: [ "Fish", ":fish:", 4 ],
          rate: 3,
          f: true
        }
      } else if (x.startsWith("dark")) {
        return {
          item: [ "Potion of Darkness", client.config.emoji.chill ],
          rate: 50,
          f: false
        }
      } else if (x.startsWith("ir")) {
        return {
          item: [ "Iron", client.config.emoji.t1ore, 0 ],
          rate: 1,
          f: false
        }
      } else if (x.startsWith("si")) {
        return {
          item: [ "Silver", client.config.emoji.t2ore, 1 ],
          rate: 5,
          f: false
        }
      } else if (x.startsWith("g")) {
        return {
          item: [ "Gold", client.config.emoji.t3ore, 2 ],
          rate: 55,
          f: false
        }
      } else if (x.startsWith("met")) {
        return {
          item: [ "Meteorite", client.config.emoji.t4ore, 3 ],
          rate: 100,
          f: false
        }
      } else if (x.startsWith("rub")) {
        return {
          item: [ "Ruby", client.config.emoji.t5ore, 4 ],
          rate: 500,
          f: false
        };
      };
    };
    let item = (args[0] || "").toLowerCase();
    let identified = identify(item);
    if (!identified) return message.channel.send("You can sell the following in-game items: `dolphin`, `shark`, `blowfish`, `tropical-fish`, `fish`, `iron`, `silver`, `gold`, `meteorite`, `ruby`, and `dark`" )
    if (isNaN(args[1])) args[1] = 1;
    let amt = Number(args[1]);
        amt = Math.trunc(amt);
    if (amt <= 0) return message.channel.send("You must provide a positive number")
    let bal = await client.db.get("bal" + message.author.id) || "0";
    bal = Number(bal);
    bal = Math.floor(bal);
    let amtGained = (amt * identified.rate);

    if (identified.item.length > 2 && (identified.f == true)) {
      //selling a fish
      let fish = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
          fish = fish.split(";")
      for (x in fish) {
        fish[x] = Number(fish[x]);
      };
      if (fish[identified.item[2]] < amt) return message.channel.send(`You don't have enough ${identified.item[1]} ${identified.item[0]}`)
      fish[identified.item[2]] = fish[identified.item[2]] - amt;
      fish = fish.join(";");
      bal = bal + amtGained;
      await client.db.set("fsh" + message.author.id, fish);
      await client.db.set("bal" + message.author.id, bal);
    } else if (identified.item.length > 2 && (identified.f != true)) {
      let o = await client.db.get("ores" + message.author.id) || "0;0;0;0;0";
          o = o.split(";");
      for (x in o) {
        o[x] = Number(o[x]);
      };
      if (o[identified.item[2]] < amt) return message.channel.send(`You don't have enough ${identified.item[1]} ${identified.item[0]}`)
      o[identified.item[2]] = o[identified.item[2]] - amt;
      o = o.join(";");
      bal = bal + amtGained;
      await client.db.set("ores" + message.author.id, o);
      await client.db.set("bal" + message.author.id, bal);
    } else {
      let ch = await client.db.get("chillpills" + message.author.id) || "0";
      ch = Number(ch);
      if (ch < amt) return message.channel.send(`You don't have enough ${identified.item[1]} ${identified.item[0]}`)
      ch = ch - amt;
      bal = bal + amtGained;
      await client.db.set("chillpills" + message.author.id, ch);
      await client.db.set("bal" + message.author.id, bal.toString());
    }
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has successfully sold ${identified.item[1]} ${client.comma(amt)} for ${client.config.emoji.coin} ${client.comma(amtGained)}`)]
    });
  },
};