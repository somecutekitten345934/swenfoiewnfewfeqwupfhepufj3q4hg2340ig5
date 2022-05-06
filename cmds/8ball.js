const Discord = require("discord.js");

module.exports = {
	name: "8ball",
	aliases: ['8ball', `askweebchan`, `askwc`],
	description: 'Ask the bot a question and get its reponse/idea about it. I\'m sure you know what 8ball really is.\nWhy not try it out?',
	category: "fun",
	usage: "8ball <question>",
	async run(client, message, args) {

	if (!args.length) {
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setTitle(`Invalid Arguments..`)
			.setDescription(`How do you expect me to answer you without any question???`)
			.setThumbnail(client.config.thumbnail.question)]
		})

	};		
	let question = args.join(" ")
	const answers = [
			'As I See It Yes',
			'Ask Again Later',
			'Better Not Tell You Now',
			'Cannot Predict Now',
			'Concentrate and Ask Again',
			'Don\'t Count On It',
			'It Is Certain',
			'It Is Decidely So',
			'Most Likely',
			'My Reply Is No',
			'My Sources Say No',
			'Outlook Good',
			'Hmm.. that outlook isnt too good...',
			'Signs Point to Yes',
			'Very Doubtful',
			'Without A Doubt',
			'Yes',
			"Impossible",
			"ppffffffffffffffff! That's funny!",
			'Yes - Definitely'
	];
	
	message.channel.send({
		embeds: [new Discord.MessageEmbed()
		.setColor(message.author.color)
		.setThumbnail(client.config.thumbnail.question)
		.setTitle(`Weebchan's Response!`)
		.setDescription(`
		**Your Question:** ${question}
		**My Response:** ${answers[~~(Math.random() * answers.length)]}
		`)]
	})
	},
}