const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: "testapi",
	aliases: ["testsfwapi"],
	description: `Steal images from the SFW side of the api cuz i'm cool`,
	async run(client, message, args) {
		if(!message.guild.me.hasPermission("EMBED_LINKS")) {
			return message.channel.send("I need the Embed Links permission for this command to work.")
		}
        let list = [
            "waifu",
            "neko",
            "cuddle",
            "cry",
            "hug",
            "kiss",
            "lick",
            "pat",
            "bonk",
            "yeet",
            "smile",
            "wave",
            "handhold",
            "nom",
            "bite",
            "slap",
            "wink",
            "poke",
            "dance",
            "hneko",
            "hwaifu"
        ]
        let nsfw = [
            "hneko",
            "hwaifu"
        ]
        if(!args.length){
			return message.channel.send({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${client.config.emoji.err} Invalid Usage! Usage:\`${message.guild.prefix}testapi <type>\`.\n \nValid types are: \n\`${list}\``)
            })
		}
        let cmd = args[0].toLowerCase();
        if(list.indexOf(cmd) !== -1){
            if(nsfw.indexOf(cmd) !== -1){
                if(!message.channel.nsfw) {
                    return message.channel.send(`${client.config.emoji.err} This type may only be executed in an NSFW channel :flushed:`)
                }
                if(cmd == "hneko") { cmd = "neko"}
                if(cmd == "hwaifu") { cmd = "waifu"}
                let data = await fetch(`https://waifu.pics/api/nsfw/${cmd}`).then((res) => res.json());
                message.channel.send({
                    embed: new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`Pulling random image from category "${cmd}" from Waifu.pics....`)
                    .setImage(data.url)
                });
            } else {
            let data = await fetch(`https://waifu.pics/api/sfw/${cmd}`).then((res) => res.json());
            message.channel.send({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`Pulling random image from category "${cmd}" from Waifu.pics....`)
                .setImage(data.url)
            });
            }
        } else {
            return message.channel.send(`${client.config.emoji.err} Invalid api request type. Try using \`${message.guild.prefix}testapi\``)

        }
	},
}