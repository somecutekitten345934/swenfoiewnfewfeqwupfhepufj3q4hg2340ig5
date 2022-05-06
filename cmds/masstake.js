const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "masstake",
  aliases: ["masstake", "mtake"],
  description: "Same this as mass give but the opposite.",
  category: "owner",
  cst: "mtake",
  async run(client, message, args) {
    if (args.length < 1) return message.channel.send("format: `;masstake <cst> ...users`");
    let cst = args[0];
    const msg = await message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`Removing "${cst}" from ${args.length - 1} accounts...`)]
    })
    let taken = 0;
    async function masstake() {
      for (x of args.slice(1)) {
        x = x.replace(/\>/g, "").replace(/\</g, "").replace(/\@/g, "").replace(/\!/g, "");
        let user = await client.users.fetch(x).catch((g) => {});
        if (user) {
          let cst0 = await client.db.get("cst" + user.id);
              cst0 = cst0 ? cst0.split(";") : [];
          cst0 = cst0.filter((r) => r != cst);
          await client.db.set("cst" + user.id, cst0.join(";"))
          taken += 1;
        }
      };
    };
    masstake()
      .then((r) => msg.edit({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`Successfully taken "${cst}" from ${taken} accounts`)]
      }))
  },
};