const Discord = require('discord.js');
const fetch = require('node-fetch')
const querystring = require('querystring')

module.exports = {
	name: 'urban',
	aliases: ['urban', 'define'],
	category: 'fun',
	description: "Search the urban dictionary for something. It will show the first given result/definition. Can only be used in NSFW channels.",
	usage: 'urban <word>',
	async run(client, message, args) {
		if (!args.length) {
			return message.channel.send(`You need to include something to search the urban dictionary for`)
		}
		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list) {
			return message.channel.send(`I cannot find that word!`)
		}
		let [answer] = list;
		if (!answer) return message.channel.send("Your search has yielded no results!")
		let embed = new Discord.MessageEmbed()
		.setColor(message.author.color)
		.setTitle(answer.word)
		.setURL(answer.permalink)
		.addField("Definition", client.trim(answer.definition, 1024))
		.addField("Example", answer.example ? `\`\`\`css\n${client.trim(answer.example, 1000)}\n\`\`\`` : "\`\`\`\nNo example found\n\`\`\`")
		.setFooter(`👍 ${client.comma(answer.thumbs_up)} | 👎 ${client.comma(answer.thumbs_down)}`);
		return message.channel.send({ embeds: [embed] })
	},
};