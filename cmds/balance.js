const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'balance',
	category: 'ecn',	
	aliases: ['balance', 'bal', 'money', "coins"],
	description: "Check someone's balance, see how much money they have",
	usage: '<User(id | @Mention)>',
	async run(client, message, args) {
		let usr = await client.usr(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		let curr = await client.db.get(`curralias${usr.id}`)
		const bal = await client.db.get('bal' + usr.id) || "0";
		let vault = await client.db.get(`v${usr.id}`) || "0;0";
		vault = vault.split(`;`)
		if(!args.length){
			args[0] == usr
		}
		
		if(curr == "Neko"){
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`**${usr.tag}'s Neko Account** *NYAAA!*\nContains funds for their catgirl!\n${client.config.emoji.coin} ${client.comma(bal)}\n${client.config.emoji.vault} ${client.comma(vault[1])}`)]
			});
		} else {
			message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`**${usr.tag}'s Account**\n${client.config.emoji.coin} ${client.comma(bal)}\n${client.config.emoji.vault} ${client.comma(vault[1])}`)]
			});
		}
	},
};