const { MessageEmbed, Message, MessageMentions, MessageFlags } = require("discord.js")
const fetch = require('node-fetch');
const { users } = require("node-os-utils");
const ms = require('ms');
const delay = require('delay');

module.exports = {
    name: "todo",
    aliases: ["todo"],
    description: "Todo list for SemiMute",
    usage: 'test',
    async run(client, message, args) {
        message.channel.send({
            embed: new MessageEmbed()
            .setTitle(`SemiMute's Developer Todo List`)
            .setDescription(`Welcome to SemIMute's personal todo list command. Here are the upcoming planned things!

            **IN TESTING**
            __Testing version ${client.config.version}__
            :white_small_square: Level Revamp (New Calculation, Picture Response)

            **IN DEVELOPMENT**
            :white_small_square: Fishing, Equip, inventory

            **PLANNED**
            :white_small_square: Weebchan AntiCheat Systems (Recode)
            :white_small_square: Halloween Specials
            :white_small_Square: Fishing Revamp
            `)
        })
    }
};
