const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "massgive",
  aliases: ["massgive", "mgive"],
  description: "mass gives a bunch of user ids a specified cst",
  category: "owner",
  cst: "mgive",
  async run(client, message, args) {
    if (args.length < 1) return message.channel.send("format: `;massgive <cst> ...users`");
    let cst = args[0];
    const msg = await message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`Giving ${args.length - 1} accounts "${cst}"...`)]
    })
    let added = 0;
    async function massgive() {
      for (x of args.slice(1)) {
        x = x.replace(/\>/g, "").replace(/\</g, "").replace(/\@/g, "").replace(/\!/g, "");
        let user = await client.users.fetch(x).catch((g) => {});
        if (user) {
          let cst0 = await client.db.get("cst" + user.id);
              cst0 = cst0 ? cst0.split(";") : [];
          cst0.push(cst);
          await client.db.set("cst" + user.id, cst0.join(";"))
          added += 1;
        }
      };
    };
    massgive()
      .then((r) => msg.edit({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`Successfully given ${added} accounts "${cst}"`)]
      }))
  },
};