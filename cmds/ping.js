const Discord = require("discord.js");

module.exports = {
	name: 'ping',
	aliases: ['latency', 'ping'],
	usage: 'ping',
	desc: 'See the bot\'s latency',
async run(client, message, args) {
  //const pingDB = await client.db.fetchLatency();
  let ping = Math.round(message.client.ws.ping); 
  const ping1 = new Discord.MessageEmbed()
  .setDescription(`:ping_pong: Please wait! It wont take long :) \n if you see this message its probs not a good thing`)
  .setColor("RANDOM");
  message.channel.send({embeds: [ping1]}).then((msg) => {
  const ping2 = new Discord.MessageEmbed()
  .setTimestamp(message.createdTimestamp)
  .addField('❯ __**API:**__', `${ping} MS`, true)
  .addField('❯ __**Ping:**__', `${msg.createdTimestamp - message.createdTimestamp} MS`, true)
  //.addField('❯ __**DB:**__', `Read: ${pingDB.read} MS\nWrite: ${pingDB.write} MS\nAverage: ${pingDB.average} MS`, false)
  .setColor(message.author.color);
  msg.edit({ embeds: [ping2]})
    });
	},
}
