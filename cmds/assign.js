const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "assign",
    aliases: [ 'assign' ],
    description: "Assigns access to your currently owned or co-owned waifu aliases",
    category: 'pet',
    async run(client, message, args) {
        if (args.length < 2) return message.channel.send("Please use the following format to assign users access: `" + message.guild.prefix + "assign <user> <waifu alias>`")
        const user = await client.usr(args[0]).catch(x => {});
        if (!user) return message.channel.send("I can't find that user.")  
        const petalias = args[1];
        const petaliases = require('../petaliases.json');
        if (!Object.keys(petaliases).includes(client.capital(petalias))) {
					return message.channel.send({
						embeds: [new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Unrecognised waifu alias "${petalias}"`)]
					})
				} else {
					let own = await client.db.get("assigns" + message.author.id) || "";
					own = own.split(";");
					if (!own.includes(client.capital(petalias))) {
						return message.channel.send({
							embeds: [new MessageEmbed()
							.setColor(message.author.color)
							.setDescription("You do not have permission to assign that alias. Use `" + message.guild.prefix + "assigns` in order to view a list of waifu aliases which you possess ownership rights over.")]
						})
					}
					let aliases = await client.db.get("petaliases" + user.id);
					if (!aliases) aliases = [];
					if (!Array.isArray(aliases)) aliases = aliases.split(";");
					if (!aliases.includes(client.capital(petalias))) {
						//add it to user;
						newa = aliases;
						newa.push(client.capital(petalias))
						await client.db.set("petaliases" + user.id, newa.join(';'))
						message.channel.send({
							embeds: [new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${user.tag} has received access to the ${petalias} waifu alias`)]
						})
					} else {
						//remove from user
						if (!aliases.includes(client.capital(petalias))) {
							message.channel.send({
								embeds: [new MessageEmbed()
								.setColor(client.config.colors.red)
								.setDescription(`${user.tag} does not have access to the ${petalias} waifu alias`)]
							})								
						} else {
							aliases = aliases.filter((x) => x != client.capital(petalias));
							await client.db.set("petaliases" + user.id, aliases.join(";"))
							const curr = await client.db.get("curralias" + user.id); 
							if (curr == client.capital(petalias)) {
								await client.db.delete('curralias' + user.id);
							};
							message.channel.send({
								embeds: [new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`${user.tag} has lost access to the ${petalias} waifu alias`)]
							})
						}
					}
				}
    }
}