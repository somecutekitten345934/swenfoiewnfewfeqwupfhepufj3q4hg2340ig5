const { freetypeVersion } = require('canvas');
const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js');
const { isValidObjectId } = require('mongoose');
const ms = require('ms');


module.exports = {
  name: 'inventory',
  category: 'ecn',
  aliases: ['inventory', "inv"],
  description: '<Information Not Available yet',
  usage: 'badges <user>',
  async run(client, message, args){
        let user = await client.usr(args[0] || message.author.id);
        if (!user) user = message.author;

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
            selected = "default";
            display = "Waifu";
            emojis = client.config.defaults.PET_EMOJIS;
          }
        }
        let pn = await client.db.get(`petname${user.id}`) || display;
        display = pn;


        let cst = await client.db.get("cst" + user.id) || "";
        cst = cst.split(";");

        let ring = await client.db.get(`RING${user.id}`) || "NONE"
        const ringindx = Object.values(client.config.items).filter((c) => c.NAME == `${ring}`)
        let ering = []
        for(const i of ringindx){
            if(cst.includes(i.NAME) || i.NAME == "NONE"){
              let DISABLED = ''
              if(i.DISABLED){
                DISABLED = `${client.config.emoji.err} **DISABLED**`
              }
              ering.push(`${i.NAME_PROPER} (\`${i.NAME}\`) ${DISABLED}`)
            }
        }

        let necklace = await client.db.get(`NECKLACE${user.id}`) || "NONE"
        const neckindx = Object.values(client.config.items).filter((c) => c.NAME == `${necklace}`)
        let enecklace = []
        for(const i of neckindx){
            if(cst.includes(i.NAME) || i.NAME == "NONE"){
              let DISABLED = ''
              if(i.DISABLED){
                DISABLED = `${client.config.emoji.err} **DISABLED**`
              }
              enecklace.push(`${i.NAME_PROPER} (\`${i.NAME}\`) ${DISABLED}`)
            }
        }

        let bracelet = await client.db.get(`BRACELET${user.id}`) || "NONE"
        const braceindx = Object.values(client.config.items).filter((c) => c.NAME == `${bracelet}`)
        let ebracelet = []
        for(const i of braceindx){
            if(cst.includes(i.NAME) || i.NAME == "NONE"){
              let DISABLED = ''
              if(i.DISABLED){
                DISABLED = `${client.config.emoji.err} **DISABLED**`
              }
              ebracelet.push(`${i.NAME_PROPER} (\`${i.NAME}\`) ${DISABLED}`)
            }
        }

        let talisman = []
        let tali = await client.db.get(`TALISMAN${message.author.id}`) || "NONE;NONE;NONE;NONE;NONE"
        tali = tali.split(`;`)
        for(const i of tali){
          let DISABLED = ''
          const indx = Object.values(client.config.items).findIndex((c) => c.NAME == i)
          const vitem = Object.values(client.config.items)[indx];
          if(i.DISABLED){
            DISABLED = `${client.config.emoji.err} **DISABLED**`
          }
          talisman.push(`:heavy_minus_sign: ${vitem.NAME_PROPER} (\`${vitem.NAME}\`) ${DISABLED}`)
        }

        let wing = await client.db.get(`WINGS${user.id}`) || "NONE"
        const windx = Object.values(client.config.items).filter((c) => c.NAME == `${wing}`)
        console.log(wing)
        let wings = []
        for(const i of windx){
            if(cst.includes(i.NAME) || i.NAME == "NONE"){
              let DISABLED = ''
              if(i.DISABLED){
                DISABLED = `${client.config.emoji.err} **DISABLED**`
              }
              wings.push(`${i.NAME_PROPER} (\`${i.NAME}\`) ${DISABLED}`)
            }
        }

        var special = [] || [""]
        if (cst.includes("NEKO_EARS")){
          special.push(`${client.config.emoji.NEKO_EARS}`)
        }

        if (special.length >= 9) special.push("\n")
        if (special.length == 0) special.push("NONE")

        let rod = await client.db.get(`FISHING_ROD${user.id}`)
        const rindx = Object.values(client.config.items).filter((c) => c.NAME == `${rod}`)
        let rarray = []
        for(const i of rindx){
          if(cst.includes(i.NAME) || i.NAME == "NONE"){
              let DISABLED = ''
            if(i.DISABLED){
                DISABLED = `${client.config.emoji.err} **DISABLED**`
              }
              rarray.push(`${i.EMOJI} ${i.NAME_PROPER} ${DISABLED}`)
            }
        }
        if(!rarray.length){
          rarray.push(`NONE EQUIPPED`)
        }
      message.channel.send({
          embeds: [new MessageEmbed()
          .setColor(message.author.color)
          .setTitle(`${display}'s Inventory (${user.tag})`)
          .setThumbnail(emojis[9])
          .setDescription(`Equip items into your ${display}'s inventory with \`${message.guild.prefix}equip <type> <item>\`.
          
          :white_small_square: **WINGS:** :heavy_minus_sign: ${wings}
          :white_small_square: **NECKLACE:** :heavy_minus_sign: ${enecklace}
          :white_small_square: **BRACELET:** :heavy_minus_sign: ${ebracelet}
          :white_small_square: **RING:** :heavy_minus_sign: ${ering}
          :white_small_square: **TALISMAN**:
          ${talisman.join(`\n`)}
    
          :white_small_square: **WEAPON:** :warning: Not Released
          :white_small_square: **FISHING ROD:** ${rarray}
          :white_small_square: **PICKAXE:** :warning: Not Released
          `)]
      })
  }
};