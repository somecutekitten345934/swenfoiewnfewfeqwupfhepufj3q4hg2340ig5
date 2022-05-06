const { MessageEmbed } = require('discord.js');
const rm = require('discord.js-reaction-menu');

module.exports = {
	name: 'privacy',
	category: 'info',
	aliases: ['privacypolicy', 'privacy', 'pp'],
	description: "View the privacy policy and how data is handled.",
	async run(client, message, args) {
		let usr = await client.usr(args[9]).catch((x) => {});
		if (!usr) usr = message.author;
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		if(!args.length){
			let linkToSupportServer = `[Support Server](${client.config.ssInvite})`;
			const privacy = [new MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Privacy Policy")
			.setDescription(`
			
	All data regarding Weebchan is stored on its local database which is only directly accessible by \`${client.users.cache.get(client.config.owner).tag}\`, who is the bot owner. 
	However, there are certain users that are able to access, edit and delete your data. In the ${linkToSupportServer}, users who have adminsitrator permissions can use the \`${message.guild.prefix}set\`, \`${message.guild.prefix}get\` and \`${message.guild.prefix}delete\` commands on users. 
	
	By your continued use of Weebchan, we will assume that you agree to the Collection and manipulation of user data (IDs)
	
	**In regards to User Data**, only specific user IDs are stored. Other details, such as the user's tag, avatar URL and creation date are fetched directly from Discord itself and are not stored; only displayed.
	
	Messages, users and \`GuildMembers\` will all remain cached until next restart, at which point that are fetched from Discord once again and transferred into the cache.
	
	**MESSAGE CONTENT**
	By continued usage of Weebchan, you agree to have the following stored in our ${linkToSupportServer}

	- In order to make sure our moderation team can do their job, Weebchan will store any deleted/edited message from our ${linkToSupportServer}
	- Additionally, in order to assure that bugs stay away, and Weebchan stays exploit free, all commands used are stored where only **BOT DEVELOPERS** may access it for debugging.
		`)]
			return message.channel.send({ embeds: privacy})
		}
		if(args[0].toLowerCase() == "opt-in"){
			if(cst.includes(`PRIVACY_ACCEPTED`)){ return message.reply(`You are already opted in! You cant opt in twice...`)}
			cst.push(`PRIVACY_ACCEPTED`)
			await client.db.set(`cst${message.author.id}`, cst.join(`;`))
			return message.reply({
				embeds: [new MessageEmbed()
				.setDescription(`You have opt-ed in to allow your User ID to be stored on our local database to cache server leaderboards`)]
			})
		}
		if(args[0].toLowerCase() == "opt-out"){
			if(!cst.includes(`PRIVACY_ACCEPTED`)){ return message.reply(`You are currently not opted in, so you cant opt out!`)}
			message.reply({
				embeds: [new MessageEmbed()
				.setTitle(`PLEASE CONFIRM`)
				.setDescription(`Please confirm that you would like to opt-out for all leaderboards and remove your data that caches server leaderboards.

				**WARNING:** This will remove any and all leveling progression, bumps on specific servers, etc and is not reversable.
				
				Please type \`confirm\` to confirm your action. Anything else typed will be taken as cancellation!`)]
			})
			let filter = m => m.author.id === usr.id;
			message.channel.awaitMessages({ filter,
				max: 1,
				time: 60 * 1000,
				errors: ['time']
			})
				.then(async(col) => {
					if (col.first().content.toLowerCase() == 'confirm') {
						const msg = await message.channel.send({
							embeds: [new MessageEmbed()
							.setDescription(`${client.config.emoji.loading} Weebchan is deleting data.. please wait!`)]
						})
						let servers = await client.db.get(`ServerData${message.author.id}`) || ""
						servers = servers.split(`;`)
						for(const i of servers){
							let server = await client.db.get(`memberList${i}`) || ""
							server = server.split(`;`)
							if(server.includes(`${message.author.id}`)){
								server = server.filter(x => ![message.author.id].includes(x).join(`;`))
								await client.db.set(`memberList${i}`, server)
							}
						}
						cst = cst.filter(x => ![`PRIVACY_ACCEPTED`].includes(x)).join(";");
						await client.db.set(`cst${message.author.id}`, cst)
						await client.db.delete(`exp${message.author.id}`)
						await client.db.delete(`bumps${message.author.id}`)
						msg.edit({ embeds: [new MessageEmbed().setDescription(`${client.config.emoji.tick} Successfully removed yourself from opt-in required systems, and deleted all related data.`)]})
					} else {
						message.channel.send(`Cancelled operation`)
					}
				}).catch((x) => {
					console.log(x);
					return message.channel.send(`Cancelled operation`)
				});
			return;
		}
	},
};