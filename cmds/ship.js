const fetch = require('node-fetch');
const { users } = require("node-os-utils");
const ms = require('ms');
const delay = require('delay');
const { MessageEmbed } = require(`discord.js`)


module.exports = {
    name: "ship",
    aliases: ["ship"],
    description: "See how good two users match!",
    usage: 'test',
    async run(client, message, args) {
        if (!args.length) return message.channel.send(`${client.config.emoji.err} You must specify some users!`)
        let user1 = await client.usr(args[0]).catch((x) => {});
        let user2 = await client.usr(args[1]).catch((x) => {});
        if (!user1) return message.channel.send(`${client.config.emoji.err} Sorry but the first user you mentioned is not a valid user!`);
        if (!user2) return message.channel.send(`${client.config.emoji.err} Sorry but the second user you mentioned is not a valid user!`);
        let calc = Math.floor(Math.random() * 100) + 1
        let calcmsg;

        if (calc == 100){
            calcmsg = "**This is a PERFECT match!**"
        } else if(calc > 90){
            calcmsg = "This is a **FLAWLESS** match!"
        } else if (calc > 80){
            calcmsg = "This is a great match!"
        } else if (calc > 70){
            calcmsg = "This is not a bad match.."
        } else if (calc > 60){
            calcmsg = "This is an ok match..."
        } else if (calc > 50){
            calcmsg = "There might be better options for them... This is a suggestion..."
        } else if (calc > 40){
            calcmsg = "There might be better options for them... This is a suggestion..."
        } else if (calc > 30){
            calcmsg = "Things arn't looking to great for them...!"
        } else if (calc > 20){
            calcmsg = "This is a placeholder match message!"
        } else if (calc > 10){
            calcmsg = "Please find another person... for the love of god.."
        } else {
            calcmsg = "One of these people need to move countries..."
        }

        if(user1.id == "478721289381740546" || user2.id == "478721289381740546"){
            calc = 0
            calcmsg = "Please dont match up with WindQuake..."
        }

        if((user1.id == "861209428066172939") && (user2.id == "216749228087705610") || (user1.id == "216749228087705610") && user2.id == "861209428066172939"){
            calc = 100
            calcmsg = `${user1.tag} is a **PERFECT** match for ${user2.tag}!`
        }

        if((user1.id == "861209428066172939") && (user2.id == "508701317884149760") || (user1.id == "508701317884149760") && user2.id == "861209428066172939"){
            calc = 100
            calcmsg = `${user1.tag} is a **PERFECT** match for ${user2.tag}!`
        }

        if(user1.id == "622035681295859722" || user2.id == "622035681295859722"){
            calc = 0
            calcmsg = "Sorry, but Signal7a is only into traps... You have no chance!"
        }

        if(user1.id == "355490257975902210" || user2.id == "355490257975902210"){
            calc = 0
            calcmsg = "Sorry... Pluto only likes himself..."
        }

        message.channel.send({
            embeds: [new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(`**CALCULATING THE SHIP.....** :heart:\n**${user1.tag}** and **${user2.tag}** are a **${calc}%** match!\n\n${calcmsg}`)]
        })
    }
};
