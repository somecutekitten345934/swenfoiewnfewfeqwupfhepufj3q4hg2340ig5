const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'shutup',
	aliases: ['stfu', `legendstfu`],
	description: 'Innact the right to be forgotten (deletes all your data)',
	category: 'botowner999',	
	async run(client, message, args) {
        if(![client.config.owner, "355490257975902210"].includes(message.author.id)){ return }
        let list = await client.db.get(`deletelist`) || ""
        list = list.split(`;`)
        if(args[0] == "-l"){
            return message.channel.send(`${list.length ? JSON.stringify(list) : "None"}`)
        }
        let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) return message.reply(`Invalid user!`)
        if(usr.id == client.config.owner){
            return message.reply(`Can't let you shut that person up... sorry!`)
        }

        if(list.includes(usr.id)){
            list = list.filter(x => ![usr.id].includes(x)).join(";");
            await client.db.set(`deletelist`, list)
            message.reply(`Deleted ${usr.id} from the shutup list`)
            return;
        }
        if(!list.includes(usr.id)) {
            list.push(`${usr.id}`)
            await client.db.set(`deletelist`, list.join(`;`))
            message.reply(`Added ${usr.id} to the shutup list`)
            return;
        }
    }
}