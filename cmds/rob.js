const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'rob',
  aliases: ['rob', 'ripoff'],
  category: 'ecn',
  description: 'Rob a user, stealing X amount of the User\'s balance',
  usage: 'rob <user>',
  async run(client, message, args) {
    const result = Math.floor(Math.random(1) * 10);
    let cooldown = await client.db.get('robc' + message.author.id);
		const data = client.cooldown(message.createdTimestamp, cooldown);
		if (data) {
			return message.channel.send(`You must wait another ${data} before robbing someone again!`);
		} else {

    };

    function notEnough() {
      return message.channel.send("They don't have enough" + ` ${client.config.emoji.coin}` + " in balance for you to rob!")
    }
  if (!args.length) return message.channel.send(`${client.config.emoji.err} You must specify a user who you wish to rob!`)
    let usr = await client.usr(args[0]).catch((x) => {});
    if (!usr) return message.channel.send("Whoops! I can't find that user");
    if (message.author.id == usr.id) return message.channel.send(`You can't rob yourself!`);
    let cst = await client.db.get("cst" + usr.id) || "";
        cst = cst.split(";");
    if (cst.includes("dnr")) {
      return message.channel.send(`This person is immune to having their ${client.config.emoji.coin} stolen... Try someone else!`);
    }
    if (result <= 8) {
      await client.db.set(`robc${message.author.id}`, (message.createdTimestamp + ms("1h")) - client.config.epoch);
    let authorBal = await client.db.get('bal' + usr.id) || 0;
    authorBal = Number(authorBal)
    let amt = authorBal - Math.floor(Math.random() * authorBal);
    amt = Number(Math.trunc(amt / 5))
    const amountLeft = Number(Number(authorBal) - Number(amt));
    if (amountLeft < 0) return notEnough();
    await client.db.set('bal' + usr.id, amountLeft);
    let oldBal = await client.db.get('bal' + message.author.id) || 0;
    oldBal = Number(oldBal)
    const newBal = Number(oldBal + amt);
    await client.db.set('bal' + message.author.id, newBal)
      await client.dm(client, {
        id: usr.id,
        clr: message.author.color,
        message: `${message.author.tag} slashes at ${usr.tag}'s satchel, stealing ${client.config.emoji.coin} ${message.author.com == 1 ? amt : client.comma(amt)} from ${usr.tag}'s account`,
        send: message.channel.id
      })
  } else {
				//		stn: function (id, amt, client) {
    await client.stn(message.author.id, 5, client);
    await client.dm(client, {
      id: usr.id,
      clr: message.author.color,
      message: `${message.author.tag} attempted to steal ${usr.tag}'s ${client.config.emoji.coin} but got caught and has been arrested for 5 minutes!`,
      send: message.channel.id
    })
    await client.db.set("stnb" + message.author.id, "arrested", ms("5m"))
    await client.db.set(`robc${message.author.id}`, (message.createdTimestamp + ms("1h")) - client.config.epoch);
    }
  }
};