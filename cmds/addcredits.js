const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addcredits",
  aliases: [ "addcredits", "addcred" ],
  description: "Adds pet credits to a certain user",
  category: "own",
  cst: "botowner999",
  async run(client, message, args) {
    const msg = await message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`Weebchan is thinking!`)
      .setDescription(`I'm thinking.... give me a moment!`)
      .setThumbnail(client.config.thumbnail.question)]
    })
    if (args.length < 2) return msg.edit({
      embeds: [new MessageEmbed()
      .setColor(client.config.colors.red)
      .setTitle(`Invalid Usage!`)
      .setDescription(`I'm not really sure you know how to use this.... maybe try the format of \`${message.guild.prefix}addcredits <user> <amount>\`!`)
      .setThumbnail(client.config.thumbnail.question)]
    })
    const user = await client.usr(args[0])
      .catch((er) => {});
    if (!user) return msg.edit({
      embeds: [new MessageEmbed()
      .setColor(client.config.colors.red)
      .setTitle(`Invalid User!`)
      .setDescription(`I'm not really sure who you want me to give credits to... give me a user!`)
      .setThumbnail(client.config.thumbnail.question)]
    });
    const credits = isNaN(args[1]) ? 1 : Number(args[1]);
    var data = await client.db.get("pet" + user.id);
    if (!data) return msg.edit({
      embeds: [new MessageEmbed()
    .setColor(client.config.colors.red)
    .setTitle(`Missing Waifu!`)
    .setDescription(`That user doesn't have a waifu... How sad!`)
    .setThumbnail(client.config.thumbnail.error)]
  });
    data = data.split(";");
    if (data.length < 9) return msg.edit({
      embeds: [new MessageEmbed()
      .setColor(client.config.colors.red)
      .setTitle(`Malformed Data!`)
      .setDescription(`I don't really know how to tell you this... but this users waifu.... is um... malformed!`)
      .setThumbnail(client.config.thumbnail.error)]
    });
    data[4] = Number(data[4]) + (credits);
    await client.db.set("pet" + user.id, data.join(";"))
    const currAlias = await client.db.get("curralias" + user.id) || "default";
    let emojis;
    let display;
    if (currAlias) {
      const aliases = require('../petaliases.json');
      const names = Object.keys(aliases);
      if (names.includes(currAlias)) {
        display = aliases[currAlias].DISPLAY_NAME;
        selected = display;
        emojis = aliases[currAlias].EMOJIS;
      } else {
        display = "waifu";
        emojis = client.config.defaults.PET_EMOJIS;
      }
    }				

    msg.edit({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`Success!`)
      .setDescription(`${message.author.tag}, I have given **${user.tag}**  x${emojis[3]} **${credits}**!`)
      .setThumbnail(client.config.thumbnail.amaze)]
    })
  }
}