const { MessageEmbed, Message } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "getcode",
	aliases: ["gcode", "gencode"],
	category: "botdeveloper",
	description: 'Generates a random code for image ids',
	usage: 'waifu',
	async run(client, message, args) {
        let cst = await client.db.get(`cst${message.author.id}`) || "";
        cst = cst.split(`;`)

        function makeid(length) {
            var result           = [];
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result.push(characters.charAt(Math.floor(Math.random() * 
         charactersLength)));
           }
           return result.join('');
        };
        return message.channel.send({
            embeds: [new MessageEmbed()
            .setDescription(`${client.config.emoji.tick} Successfully generated code: \`${makeid(20)}\``)]
        })
    }
}