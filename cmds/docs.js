const Discord = require('discord.js');
const fetch = require('node-fetch');
const qs = require('querystring');

module.exports = {
	name: "docs",
	aliases: ["docs"],
	category: 'utl',
	description: "Search the [discord.js](https://www.npmjs.com/package/discord.js) documentation, most useful for bot developers! This runs on the stable branch",
	usage: "docs <query>",
async run(client, message, args) {
	timeout = (20) * 1000;
	const queryString = args.join(' ')
	const res = await fetch(`https://djsdocs.sorta.moe/v1/main/stable/embed?q=${queryString}`);
	const embed = await res.json();
	const reactionfilter = (reaction, user) => reaction.emoji.name == "🗑️" && user.id === message.author.id;
	if(!queryString){
			await message.delete(3000)
					.catch((err)=>{});
			const filter = m => m.author.id === message.author.id;
			message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setDescription("What would you like to search the Discord.js Docs for?\n\n> Expires in 20 Seconds, type `cancel` to cancel")]
			})
					.then(msg => {
						msg.delete(20000)
					})
						
			message.channel.awaitMessages(filter, {
					max: 1,
					time: 20000,
					errors: ['time'],
			}).then(async(collected)=>{
					if (collected.first().content.toLowerCase() == 'cancel') {
							return message.channel.send(client.config.emoji.tick + ' Command cancelled')
					}
					const queryString = collected.first().content;
					const res = await fetch(`https://djsdocs.sorta.moe/v1/main/stable/embed?q=${queryString}`);
					const info = await res.json();
					
					if (!info || !res) {
							message.channel.send(client.config.emoji.err + ' I can\'t fint the requiested information on the Discord.js Documentation!')
					}
						await message.channel.send({ embeds: [info] })
			}).catch(() => {
					message.channel.send(client.config.emoji.err + ' You took too long! Goodbye!');
				});
			return;
	};
	if (!embed) {
			return message.channel.send(`${client.config.emoji.err} ${client.user.username} **couldn't** find the requested information.\nMaybe look for something that actually exists next time?`);
	};

	let sent = await message.channel.send({ embeds: [embed] });
	await sent.react('🗑️');
	sent.awaitReactions(reactionfilter, {
		max: 1,
		time: timeout,
		errors: ['time'],
	}).then((collection) => {
		sent.delete();
		message.delete();
	}).catch(async() => {sent.edit({ embeds: [new Discord.MessageEmbed(sent.embeds[0]).setFooter('This message is no longer active.').setTimestamp
	().setColor('#da0000')]});sent.reactions.forEach((r) => r.remove())})
	},
}