const Discord = require('discord.js');

module.exports = {
	name: 'roast',
	aliases: ['roast'],
	description: 'Roast someone',
	category: "social",
	usage: 'roast <@Member/ID>',
	async run(client, message, args) {
		const noroast = [ client.config.owner ];
		var roast = [
			'Your birth certificate is an apology letter from the condom factory.',
			'I\'d like to see things from your point of view but I can\'t seem to get my head that far up my ass.',
			'You must have been born on a highway because that\'s where most accidents happen.',
			'Better to let people think you\'re smart until you open your mouth and prove them wrong.',
			'Is your ass jealous of the amount of shit that just came out of your mouth?',
			'You\'re so fat the only letters of the alphabet you know are KFC.',
			'Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.',
			'Your family tree must be a cactus because everybody on it is a prick.',
			'If I wanted to kill myself I\'d climb your ego and jump to your IQ.',
			'If laughter is the best medicine, your life must be curing the world.',
			'Did you eat paint chips when you were a kid?',
			'I\'m not saying I hate you, but I would unplug your life support to charge my phone.',
			'You\'re so ugly, when your mom dropped you off at school she got a fine for littering.',
			'Shock me, say something intelligent.',
			'I\'m jealous of all the people that haven\'t met you!.',
			'Don\'t feel sad, don\'t feel blue, Frankenstein was ugly too.',
			'I could eat a bowl of alphabet soup and shit out a smarter statement than that.',
			'If you are going to be two faced, at least make one of them pretty.',
			'I may love to shop but I\'m not buying your bullshit.',
			'Why don\'t you slip into something more comfortable -- like a coma.',
			'You look like something I\'d draw with my left hand.',
			'It\'s better to keep your mouth shut and give the \'impression\' that you\'re stupid than to open it and remove all doubt.',
			'It\'s too bad stupidity isn\'t painful.',
			'What\'s the difference between you and eggs? Eggs get laid and you don\'t.',
			'At least when I do a handstand my stomach doesn\'t hit me in the face.',
			'The last time I saw a face like yours I fed it a banana.',
			'If assholes could fly, this place would be an airport!',
			'You are proof that God has a sense of humor.',
			'You are so stupid, you\'d trip over a cordless phone.',
			'Ordinarily people live and learn. You just live.',
			'Aww, it\'s so cute when you try to talk about things you don\'t understand.',
			'If a crackhead saw you, he\'d think he needs to go on a diet.',
			'Learn from your parents\' mistakes - use birth control!',
			'When was the last time you could see your whole body in the mirror?',
			'I wish you no harm, but it would have been much better if you had never lived.',
			'If what you don\'t know can\'t hurt you, you\'re invulnerable.',
			'I heard you took an IQ test and they said your results were negative.',
			'If you had another brain, it would be lonely.',
			'You act like your arrogance is a virtue.',
			'We all sprang from apes, but you didn\'t spring far enough.',
			'You must think you\'re strong, but you only smell strong.',
			'Ever since I saw you in your family tree, I\'ve wanted to cut it down.',
			'If you spoke your mind, you\'d be speechless.',
			'Is your name Maple Syrup? It should be, you sap.',
			'Your mom must have a really loud bark!',
			'You\'re the reason why women earn 75 cents to the dollar.',
			'Why don\'t you let that hole under your nose heal up?',
			'For those who never forget a face, you are an exception.',
			'If ignorance is bliss, you\'d be the happiest little fool on the planet.',
			'You are the human equivalent of a participation award.',
			'Does your ass ever get jealous of the shit that comes out of your mouth.',
			'There\'s a tree creating the oxygen you\'re wasting, go find it in the woods and apologize.',
			'I\'d try to insult you, but I can\'t top what nature has already done.',
			'I\'d tell you to go fuck yourself but I’m pretty sure you’d be disappointed.',
			'You are the reason God created the middle finger.',
			'I’m busy right now, can I ignore you another time?',
			'You’re a gay sprinkle on a rainbow cupcake.',
			'You have an entire life to be an idiot. Why not take today off?',
			'I thought of you today. It reminded me to take out the trash.',
			'You’re the reason the gene pool needs a lifeguard.',
			'I\’m not saying you’re fat but you look like you were poured into your clothes and forgot to say “when”.',
			'Your family tree must be a circle.',
			'You’re so ugly your portraits hang themselves.',
			'Anyone willing to fuck you is just too lazy to masturbate',
			'God wasted an asshole when he put teeth in your mouth.',
		]
		if (!args.length) {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(roast[Math.floor(Math.random() * roast.length)])
				.setTitle(`Weebchan roasts ${message.author.tag}!`)
				.setThumbnail(client.config.thumbnail.mad)]
			});
}
		let mem = await client.usr(args[0]).catch((x) => {});
		if(!mem){
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setThumbnail(client.config.thumbnail.fuckyou)
				.setTitle('Invalid User!')
				.setDescription('Please provide me with a valid user to roast....')]
			})
		}
		if (mem.bot || (noroast.includes(mem.id))) {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setTitle('Roast Immunity!')
				.setDescription(`I'm not really sure how to roast this person... Try someone else!`)
				.setThumbnail(client.config.thumbnail.fuckyou)
				.setColor(message.author.color)]
			})
		};
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setTitle(`${message.author.tag} roasts ${mem.tag}!`)
			.setDescription(roast[Math.floor(Math.random() * roast.length)])
			.setThumbnail(client.config.thumbnail.mad)
			.setColor(message.author.color)]

		})
	},
}