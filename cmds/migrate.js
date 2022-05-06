const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "migrate",
  aliases: ["migrate"],
  description: "Migrate your inventory to the new system",
  category: "utl",
  async run(client, message, args) {
      let cst = await client.db.get(`cst${message.author.id}`) || ""
      cst = cst.split(`;`)

      let migratedcst = []
      if(cst.includes(`fishrod`)){
        cst.push(`BASIC_FISHING_ROD`)
        migratedcst.push(`:white_small_square: \`fishrod\` -> \`BASIC_FISHING_ROD\``)
        cst = cst.filter(x => ![`fishrod`].includes(x))
      }
      if(cst.includes(`wingsdarkness1`)){
        cst.push(`WINGS_OF_DARKNESS`)
          migratedcst.push(`:white_small_square: \`wingsdarkness1\` -> \`WINGS_OF_DARKNESS\``)
          cst = cst.filter(x => ![`wingsdarkness1`].includes(x))
      }
      if(cst.includes(`wingsdarkness2`)){
        cst.push(`WINGS_OF_THE_VOID`)
        migratedcst.push(`:white_small_square: \`wingsdarkness2\` -> \`WINGS_OF_THE_VOID\``)
        cst = cst.filter(x => ![`wingsdarkness2`].includes(x))
    }
    if(migratedcst.length <= 0){
        return message.reply({
          embeds: [new MessageEmbed()
          .setTitle(`Currently Up to Date!`)
          .setDescription(`You're currently up to date and do not require any data migrations!`)
          .setThumbnail(client.config.thumbnail.amaze)]
        })
    }
    await client.db.set(`cst${message.author.id}`, cst.join(`;`))
      message.channel.send({
          embeds: [new MessageEmbed()
        .setTitle(`Successfully Migrated!`)
        .setDescription(`Successfully migrated any legacy items! Here are the following changes made to your data:\n${migratedcst.join(`\n`)}`)
        .setThumbnail(client.config.thumbnail.thumbsup)]
      })
  }
}