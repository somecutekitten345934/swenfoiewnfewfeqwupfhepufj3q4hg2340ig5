const { MessageEmbed, escapeMarkdown, Message } = require("discord.js");
const ms = require('ms');
const delay = require('delay');

module.exports = {
	name: "plasmacannon",
	"aliases": ['cannon'],
	category: 'ecn',
	description: 'Shoot an overpowered cannon that stuns the target for 4-10 minutes.',
	async run(client, message, args) {
		let usr = await client.usr(args[0]).catch((x) => {});
		let mcst = await client.db.get("cst" + message.author.id) || "";
		mcst = mcst.split(";");
		if(!mcst.includes(`plasmacannon`)){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} You do not know how to use your ${client.config.emoji.plasmacannon}. Purchase it from \`${message.guild.prefix}shop\``)
				.setFooter(`TIP: Purchase weapons & ammo from the shop!`)
				.setTimestamp()]
			})
		}
		let coold = await client.db.get(`plasmac${message.author.id}`);
		if (coold) {
			let data = client.cooldown(message.createdTimestamp, coold);
			if (data) {
				return message.channel.send({
					embeds: [new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.emoji.err} Your ${client.config.emoji.plasmacannon} is overheated! Please wait another ${data} before firing this weapon.`)
					.setTimestamp()]
				})
			} else {

			};
		}
		let ammo = await client.db.get(`ammo${message.author.id}`) || "0;0;0;0;0;0;0;0";
		ammo = ammo.split(";");
		let plasma = ammo[0]

		if(ammo[0] < 1){
			return message.channel.send({
				embeds: [new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${client.config.emoji.err} You do not have enough ${client.config.emoji.plasmaammo} to shoot your ${client.config.emoji.plasmacannon}!`)
				.setFooter(`TIP: Purchase ammo to power your weapons from the shop!`)
				.setTimestamp()]
			})
		}
		if (!args.length) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.err} You must specify a user who you wish to obliterate with your ${client.config.emoji.plasmacannon}`)
			.setTimestamp()]
		})
		if (!usr) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.err} The arguments you provided are not a player. Try again!`)
			.setTimestamp()]
		})
		let cst = await client.db.get("cst" + usr.id) || "";
		cst = cst.split(";");
		if (message.author.id == usr.id) return message.channel.send(`You can't shoot yourself!`);

		if (cst.includes("dnr")) return message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.emoji.sadge} The player you are trying to attack is off the radar and cannot be located. Try someone else!`)
			.setTimestamp()]
		})



		// Actual attack code
		await client.db.set("plasmac" + message.author.id, (message.createdTimestamp + ms("3h")) - client.config.epoch);
		let usrcolor = await client.db.get('clr' + usr.id) || client.config.defaultHexColor;
				usrcolor = usrcolor.split(";")[0];
		let didntWork = Math.floor(Math.random() * 100);

		let bal = await client.db.get("bal" + usr.id) || 0;
			bal = Number(bal);
		let amtLost = bal / 3;
		if (bal - amtLost < 0) amtLost = bal;
		amtLost = Math.floor(amtLost);
		let burned = Math.floor(amtLost / 3);
		if(burned < 1) burned = 1;
		let namtLost = amtLost - burned;
		if(namtLost < 0){
			namtLost = 0;
		}

		// AMMO
		`Plasma;N/A;N/A;N/A;N/A;N/A;N/A`
		ammo[0] = plasma - 1;

		await client.db.set(`ammo${message.author.id}`, ammo.join(";"));

		await client.db.set("bal" + usr.id, bal - amtLost)
		let oldBal = await client.db.get("bal" + message.author.id) || 0;
				oldBal = Number(oldBal);
		let newBal = (oldBal + namtLost);
		await client.db.set('bal' + message.author.id, newBal);

		await client.dm(client, { id: usr.id, clr: usrcolor, message: `${message.author.tag} locates their ${client.config.emoji.plasmacannon} and aims it at ${usr.tag}...`, send: message.channel.id });
		await delay(1500);
		await client.dm(client, { id: usr.id, clr: usrcolor, message: `${message.author.tag} fires their ${client.config.emoji.plasmacannon} at ${usr.tag}....`, send: message.channel.id });
		await delay(1500);	
		if (didntWork > 90) {
			await client.dm(client, { id: usr.id, clr: usrcolor, message: `${usr.tag} dodges ${message.author.tag}'s orbital strike and gets away without injuries`, send: message.channel.id })
			return;
		} else {
		let stunTime = Math.floor(Math.random() * (10 - 4 + 1) ) + 4;
		stunTime *= ms('1m');
				//		stn: function (id, amt, client) {
		await client.stn(usr.id, stunTime/ms("1m"), client);
		await client.db.set('stnb' + usr.id, "obliterated");
		await client.dm(client, {id: usr.id, clr: usrcolor, message: `${message.author.tag} steals ${client.config.emoji.coin} ${client.comma(namtLost) || "0"}, and ${usr.tag} has been stunned for ${stunTime / ms('1m')} minutes`, send: message.channel.id})
		};
	}
}