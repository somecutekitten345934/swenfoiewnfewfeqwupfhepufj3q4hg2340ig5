const { MessageEmbed, Util } = require("discord.js");
const nhentai = require('nhentai-js')

module.exports = {
    name: "searchdoujin",
    aliases: ["sd"],
    description: "Search for a doujin",
    category: "nsfw",
    async run(client, message, args) {
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setDescription(`${client.config.emoji.err} Invalid search query!`)
                .setColor(message.author.color)]
            })
        }
        let page = parseInt(args[0]); 
        let qu = args.slice(1).join(' ');
        try{
            if (!page || isNaN(page)) throw (`INVALID_PAGE`)
            const searchpage = await nhentai.search(qu, page, "popular")
            let arr = []; 
            
            searchpage.results.forEach(e => {
                
                arr.push(`:white_small_square: **[${e.bookId}]** ${e.title}`); 
            })
            Util.splitMessage(arr.join(`\n\n`), { maxLength: 3000, char: ""}).forEach(m=> message.channel.send({ embeds: [new MessageEmbed().setTitle(`Searching NHentai API for "${qu}"`).setDescription(`${m}`)]}))
          } catch(err){
              message.channel.send({
                  embeds: [new MessageEmbed()
                .setColor(client.config.colors.red)
                .setDescription(`${client.config.emoji.err} I encountered an error whilst trying to complete your query :(\n**ERROR:** ${err}`)]
              })
              console.log(err)
          }


  }
}