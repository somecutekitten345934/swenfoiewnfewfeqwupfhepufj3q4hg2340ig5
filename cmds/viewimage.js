const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
	name: "viewimage",
	aliases: ["viewimg"],
	description: 'View an image from a specific command',
	usage: 'waifu',
	async run(client, message, args) {
    let cst = await client.db.get(`cst${message.author.id}`) || "";
        cst = cst.split(`;`)
    if(!cst.includes(`botdeveloper`)) return;
    if(!args.length){
        return message.channel.send(`${client.config.emoji.err} Usage: \`${message.guild.prefix}viewimage <CATEGORY> <IMAGE>\``)
    }
    const cmd = args[0].toLowerCase();
    let list = [
        "hwaifu",
        "fuck",
        "hold",
        "cuddle",
        "kiss",
        "getwaifu",
        "hug",
        "neko"
    ]
    let nsfw = [
        "hwaifu",
        "fuck"
    ]
    if(list.indexOf(cmd) !== -1){
        var fs = require('fs');
        let files = fs.readdirSync(`./Images/${cmd}/`)
        if(files.indexOf(args[1]) !== -1){
            const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`IMAGE PREVIEWER`) 
			.setDescription(`
			Here is a preview of \`${args[1]}\`!
			`)
			.attachFiles(`./Images/${cmd}/` + `${args[1]}`)
			.setImage('attachment://' + `${args[1]}`)
            .setFooter(`This image will randomly appear in the ${cmd} command!`)

		    await message.channel.send({ embeds: [embed]})
        } else {
            return message.channel.send({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} The image ID "${args[1]}" from category ${cmd} is not valid.`)
            })
        }
    }
	}
		
} // 1+1=11