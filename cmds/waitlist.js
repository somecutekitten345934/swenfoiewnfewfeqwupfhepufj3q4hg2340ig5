const Discord = require('discord.js');
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const hypixel = new Hypixel.Client('df507fa2-66e3-4be2-b032-e73e080b20a2'); // api key for hypixel

module.exports = {
	name: 'waitlist',
	aliases: ['wl'],
	description: 'Weebineers Guild Waitlist',
	usage: 'reload <command name or alias>',
	async run(client, message, args) {
        if(message.guild.id !== `742257076637794344`){
            return;
        }
        let normal = await client.db.get(`wln`) || 0;
        normal = Number(normal)
        let priority = await client.db.get(`wlp`) || 0;
        priority = Number(priority)

        var guildlength = await hypixel.getGuild(`name`, `Weebineers`).then(guild => guild.members)
        var length = guildlength.length
        length = Number(length)  
        let left = 125 - length;

        message.channel.send({
            embed: new Discord.MessageEmbed()
            .setTitle(`Weebineers Guild Waitlist Information`)
            .setDescription(`Here you can view how many slots Weebineers has, along with how big of a waitlist there is.`)
            .addField(`AVAILABLE SLOTS`, `Amount of slots available in the guild: \`${left}\`\nUses the Hypixel API, so its always accurate ;3`)
            .addField(`PRIORITY WAITLIST`, `People who are waiting on the priority waitlist: \`NUMBER\`\nThese members have a certain weight to bypass the normal queue.`)
            .addField(`NORMAL WAITLIST`, `People who are waiting on the NORMAL waitlist: \`NUMBER\``)
        })
    }
}