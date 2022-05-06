const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js'); // discord API stuff
const delay = require('delay'); // delay module
const ms = require(`ms`)
const { NekoBot } = require("nekobot-api");
const api = new NekoBot();


module.exports = {
    name: "test",
    aliases: ["testcommand"],
    description: "Test command for new features.. I suppose",
    usage: 'test',
    async run(client, message, args) {
        if(!message.channel.nsfw){ return message.channel.send(`Testing command currently using NSFW API endpoints, try in an NSFW channel!`)}
        const image = await api.get(`paizuri`)
        message.channel.send({
            embed: new MessageEmbed()
            .setImage(image)
        })
    }
};