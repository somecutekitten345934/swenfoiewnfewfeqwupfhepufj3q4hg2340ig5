const { MessageEmbed, escapeMarkdown, Permissions, UserFlags, Message } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'viewitem',
  aliases: ["viewi"],
  description: 'Gives information about an inventory item',
  async run(client, message, args){
    // ITEM INFORMAITON
      let arg;
      if(!args.length){ args = "UNDEFINED_ARGUMENT"} else { arg = args[0].toUpperCase()}
      try{
        const indx = Object.values(client.config.items).findIndex((c) => c.NAME == arg)
        const vitem = Object.values(client.config.items)[indx];
        let color = `#5f7a7e`
        if(vitem.RARITY == "SPECIAL"){
          color = `#f26969`
        } else if(vitem.RARITY == "LEGENDARY"){
          color = `#ea8626`
        } else if(vitem.RARITY == "MYTHIC"){
          color = `#efd27b`
        } else if(vitem.RARITY == "RARE"){
          color = `#07b7c2`
        } else if(vitem.RARITY == "UNCOMMON"){
          color = `#4CBB17`
        } else if(vitem.RARITY == "COMMON"){
          color = `#4cbb17`
        }

        if(!vitem) throw(`ERROR_INVALID_ITEM`)
        let cst = await client.db.get(`cst${message.author.id}`) || ""
        cst.split(`;`)
        console.log(vitem.HIDDEN)
        if(vitem.HIDDEN == undefined){
          vitem.HIDDEN == "false"
        }
        if(vitem.HIDDEN == "true") throw(`ERROR_INVALID_HIDDEN_ITEM`)
        let bound = "<:Thumbsup:870800596612055090> **TRADABLE ITEM**\nThis item is currently tradable!"

        if(vitem.ACCOUNT_BOUND){
          bound = ":warning: **ACCOUNT BOUND**\nThis item may not be traded with another player!"
        }
        message.channel.send({
          embeds: [new MessageEmbed()
          .setTitle(`Item Information!`)
          .setColor(color)
          .setDescription(`
          Here's what i've gathered about the ${vitem.NAME_PROPER}

          :white_small_square: **ID:** ${vitem.NAME}
          :white_small_square: **Display Name:** ${vitem.NAME_PROPER}
          :white_small_square: **Rarity:** ${vitem.RARITY}
          :white_small_square: **Item Type:** ${vitem.TYPE}
          :white_small_square: **Description:** ${vitem.DESCRIPTION}
          :white_small_square: **Usage:** ${vitem.USAGE}
          :white_small_square: **Version Added:** ${vitem.ADDED}
          :white_small_square: **Emoji:** ${vitem.EMOJI}
          :white_small_square: **Cost:** ${vitem.COST}
          :white_small_square: :zap: **Power Level:** ${vitem.ATTRIBUTES.POWER_LEVEL ? `${vitem.ATTRIBUTES.POWER_LEVEL}` : `Item has no power level`}


          ${cst.includes(vitem.NAME) ? `:white_small_square: **Player Owned:** ${client.config.emoji.tick} Owned!` : `:white_small_square: **Player Owned:** ${client.config.emoji.err} Missing`}

          ${bound}
          `)]
        })
      } catch(e){
        if(!args.length){
          arg = "UNDEFINED_ITEM"
        }
        return message.channel.send({
          embeds: [new MessageEmbed()
          .setThumbnail(client.config.thumbnail.mad)
          .setTitle(`Invalid Item ID`)
          .setDescription(`I wasn't able to find anything for \`ID:${arg}\`. Check your argument and try again!`)]
        })
      }
  }
}