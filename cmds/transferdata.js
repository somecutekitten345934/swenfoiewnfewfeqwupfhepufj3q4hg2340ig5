const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "transferdata",
  aliases: ["transferdata", "datatransfer", "transfer-data", "tdata"],
  category: "own",
  description: "Transfers a user's data to another one, deleting all of user1's data.",
  cst: "transferdata",
  async run(client, message, args) {
    if (args.length < 2) return message.channel.send("You must provide a source user as your first argument and a destination user as your second argument under the format: `" + message.guild.prefix + "transferdata <source user> <destination user>`")
    let src = await client.usr(args[0]).catch((x) => {});
    if (!src) return message.channel.send(`"${args[0]}" is not recognised as a valid user`);
    let dest = await client.usr(args[1]).catch((x) => {});
    if (!dest) return message.channel.send(`"${args[1]}" is not recognised as a valid user`);
    const msg = await message.channel.send(`${client.config.emoji.loading} Transferring data from **${src.tag}** to **${dest.tag}**...`);
    Promise.all(
      client.keys.forEach(async(key) => {
        const data = await client.db.get(`${key}${src.id}`);
        if (data) {
          await client.db.set(`${key}${dest.id}`, data);
        } else {

        }
      })
    );
    msg.edit(`${client.config.emoji.loading} Deleting **${src.tag}**'s data...`);
    Promise.all(
      client.keys.forEach(async(key) => {
        await client.db.delete(`${key}${src.id}`)
      })
    );
    msg.edit({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${client.config.emoji.tick} Successfully transferred **${src.tag}** to **${dest.tag}**`)
      .setFooter(`In ${Date.now() - msg.createdTimestamp} MS`)]
    })
  },
};