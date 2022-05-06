const delay = require("delay");
const { MessageEmbed, Message, Util } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "quote",
  aliases: ["quotes"],
  description: "Add/list/view/remove different quotes",
  category: "fun",
  async run(client, message, args) {
    let cst = await client.db.get(`cst${message.author.id}`) || ""
    cst = cst.split(`;`)
    if(!cst.includes(`quoter`)){
      return message.reply(`Ha, you cant quote people.. L`)
    }
      let quotes = await client.db.get(`quote` + message.author.id) || [];
      let randquote = quotes[Math.floor(Math.random() * quotes.length)]
      if(!args.length){
        var test = await client.db.get(`quote${message.author.id}`)
        if(!test){
          return message.channel.send(`Sorry, but it seems you dont have any quotes!`)
        }
          try{
            let usr = await client.usr(randquote.Quoted).catch((e) => {});
            let quoted;
            if(!usr){
              quoted = "**NULL**"
            } else {
              quoted = usr.tag
            }
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setTitle(`Random Quote Found!`)
                .setDescription(`${randquote.Quote}\n\n:white_small_square: Quote by ${quoted}`)
                .setFooter(`Added on ${moment.utc(randquote.DateAdded).format(`L`)}`)]
            })
          } catch(err){
              if(err == "TypeError: Cannot read property 'Quote' of undefined"){
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setDescription(`Sorry, but I can't seems to find any quotes for you...`)]
                })
              }
          }
      }
      if(!isNaN(args[0])){
        for(var i in quotes){
          quotes[i].number = Number(i) + 1;
        }
        var quote = quotes.find(c=>c.number == args[0])
        if(!quote){
          return message.reply(`Invalid Quote selection. Try \`${message.guild.prefix}quote list\` to see your available quotes`)
        }
        return message.channel.send({
          embeds: [new MessageEmbed()
          .setColor(message.author.color)
          .setTitle(`Quote #${args[0]}`)
          .setDescription(`${quote.Quote}\n\n:white_small_square: Quote by <@${quote.Quoted}>`)
          .setFooter(`Added on ${moment.utc(quote.DateAdded).format(`L`)}`)]
      })
      }
      if(args[0] == "remove"){
        for(var i in quotes){
          quotes[i].number = Number(i) + 1;
        }
        let find = quotes.find(c=>c.number == args[1])
        console.log(JSON.stringify(find))
        if(!find){
          return message.reply(`**DEBUGGER:** NULL`)
        } else {
          message.reply({
            embeds: [new MessageEmbed()
              .setTitle(`Quote Removed`)
            .setDescription(`Successfully removed quote \`${find.Quote}\` by <@${find.Quoted}>`)]
          })
          quotes = quotes.filter(c=>c.number !== Number(args[1]))
          let newthing = []
          for(const i of quotes){
            newthing.push({
              Quote: `${i.Quote}`,
              DateAdded: i.DateAdded,
              Quoted: `${i.Quoted}`,
            })
          }
          await client.db.set(`quote${message.author.id}`, newthing)
        }
      }
      if(args[0] == "add"){
        let { channel, reference: reply } = message
        if(reply){
          const repliedTo = await channel.messages.fetch(reply.messageId);
          if(reply.messageId){
            if(repliedTo.author.bot){
              return message.channel.send(`Sorry, but you can't quote bots via replying as they may include embeds :eyes:`)
            }
            if(repliedTo.content.includes(`"`)){
              return message.channel.send(`Sorry, but the usage of the \`"\` character has been blacklisted due to issues with internal database issues.`)
            }
            message.channel.send({
              embeds: [new MessageEmbed()
              .setDescription(`I have successfully saved the quote "${repliedTo.content}" - <@${repliedTo.author.id}> to your list of quotes!`)]
            })
            quotes.push({
              Quote: `${repliedTo.content}`,
              DateAdded: Date.now(),
              Quoted: `${repliedTo.author.id}`,
            })
            await client.db.set(`quote` + message.author.id, quotes)
            return;
          }
        }
        let text = args.slice(2).join(' ')
        text = text.slice(0, 350)
        let usr = await client.usr(args[1]).catch((e) => {});
        if (!usr) return message.channel.send(`Please provide an actual user you would like to quote!`);
        quotes.push({
            Quote: `${text}`,
            DateAdded: Date.now(),
            Quoted: `${usr.id}`,
        })
        if(!args[2]){
          return message.channel.send(`Try actually adding something to quote....`)
        }
        if(text.includes("`")){
          return message.channel.send(`Sorry, but the usage of the \` character has been blacklisted due to issues with internal database issues.`)
        }
        message.channel.send({
            embeds: [new MessageEmbed()
            .setDescription(`I have successfully saved the quote "${text}" - <@${usr.id}> to your list of quotes!`)]
        })
        await client.db.set(`quote` + message.author.id, quotes)
      }
      for(var i in quotes){
        quotes[i].number = Number(i) + 1;
      }
      let quotelist = quotes.map(c=> `:white_small_square: [${c.number}] **04/12/2022** :black_small_square: ${c.Quote} - by **${`<@${c.Quoted}>` || "**NULL**"}**`)
      var mainArray = [];
      var tempArray = [];
      for(var i in quotelist){
        var maxLengthPerArray = 3900;
        var tempLength = tempArray.join('\n').length;
        if(tempLength > maxLengthPerArray){
          mainArray.push(tempArray);
          tempArray = [];
          tempArray.push(quotelist[i])
        } else {
          tempArray.push(quotelist[i]);
        }
      }
      if(tempArray.length) mainArray.push(tempArray);
      if(!mainArray.length){
        return message.reply(`You don't have any quotes! Try adding quotes via \`${message.guild.prefix}quote add <ID> <QUOTE>\` or replying to a message with ${message.guild.prefix}quote add`)
      }
      if(args[0] === "list"){
        if(quotelist.length > 75){
          let msg  = await message.channel.send({
            embeds: [new MessageEmbed()
            .setTitle(`Quote System: Attempting to DM`)
            .setDescription(`${client.config.emoji.loading} Attempting to private message ${message.author.tag} (${message.author.id}) their quote list as it exceeds **75** quotes.`)
            .setThumbnail(client.config.thumbnail.question)]
          })
          await delay(2000)
          try{
            mainArray.forEach(m=> message.author.send({embeds: [new MessageEmbed().setDescription(m.join('\n'))]}))
            await delay(3000)
            msg.edit({ embeds: [new MessageEmbed()
              .setTitle(`Quote System: DM Success!`)
              .setDescription(`I have successfully private messaged ${message.author.tag} their quotes list!`)
              .setThumbnail(client.config.thumbnail.thumbsup)]})
          }catch(err){
            if(err == "DiscordAPIError: Cannot send messages to this user"){
              message.channel.send(`**[WEEBCHAN DEBUGGER]** Failed to message the author`)
            }
            msg.edit({ embeds: [new MessageEmbed()
              .setTitle(`Quote System: Failed to DM`)
              .setDescription(`Something went wrong! I was unable to DM ${message.author.tag} their quotes!\n**NOTE:** Make sure your privacy settings are correct!`)
              .setThumbnail(client.config.thumbnail.error)]})
          }
          return;
        }
        mainArray.forEach(m=> message.channel.send({embeds: [new MessageEmbed().setDescription(m.join('\n'))]}))
      }
  }
}
