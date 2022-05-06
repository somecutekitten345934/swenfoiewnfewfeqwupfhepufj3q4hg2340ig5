const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "waifualias",
    aliases: ["waifualias", "wa"],
    category: 'waifualias',
    description: "Choose a waifu alias to be displayed on your waifu!",
    async run(client, message, args) {
        let aliases = await client.db.get("petaliases" + message.author.id) || "default";
   /*     if (aliases == "default") {
            return message.channel.send("You do not have permission to access any waifu aliases.");
        };
        */
            if (!args.length || (isNaN(args[0]))) {
        //    if (aliases == "default") return message.channel.send("You do not have access to any waifu aliases.")
            let list = aliases.split(";");
        if (!list.includes("default")) list.push("default");
            const prompt = `\`\`\`\n{\n${list.map((x) => `    "${list.indexOf(x)}": "${x}"`).join(',\n')}\n}\`\`\``;
            return message.channel.send({
              embeds: [new MessageEmbed()    
              .setColor(message.author.color)
              .setTitle(`${message.author.tag}'s Waifu Aliases`)
              .setDescription(`These can be created by messaging \`${client.users.cache.get(client.config.owner).tag}\`. To create, they cost $10 each. Additionally, you can purchase premade alias' with ${client.config.emoji.coin} via \`${message.guild.prefix}market\`\n \`${message.guild.prefix}waifualias <id>\` in order to select an alias to display.` + prompt)]
            })
        };
        let list = aliases.split(";");
        if (!list.includes("default")) list.push("default");
        const index = Number(args[0]);
        const petalias = list[index];
        const petname = list[index].DISPLAY_NAME;
        if (!petalias) {
            return message.channel.send(`Invalid Index "${index}"`)
        } else {
            if (petalias == "default") {
                await client.db.delete("curralias" + message.author.id);
                await client.db.delete("petname" + message.author.id);
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`Successfully removed your waifu alias.`)]
                })    
            }
            await client.db.set("curralias" + message.author.id, petalias)
            await client.db.set("petname" + message.author.id, petname)
            message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`Successfully chosen "${petalias}" as preferred waifu alias`)]
            })
        }
    }
}