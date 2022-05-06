const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'send',
	aliases: ['send'],
  description: 'relay a message to a specific channel',
	category: 'botowner999',
	cst: "send",
	async run(c, message, a) {
    if (![c.config.owner].includes(message.author.id)) {
      return message.channel.send(`${c.config.emoji.err} You actually thought you would be able to use this? Only SemiMute#6630 can use this! ;3`)
    }
		if (a.length < 2) return message.channel.send("You must specify a channel ID and a message for me to send!");
		var msg = a.slice(1).join(' ');
    let ch = c.channels.cache.get(a[0] || "");
    if (!ch) return message.channel.send(`Invalid channel id "${a[0] || ""}"`)
    ch.send(msg);
    message.channel.send({
      embeds: [new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`Successfully sent "${c.trim(a.slice(1).join(" "), 1500)}" to [#${ch.name}] of guild [${ch.guild.name}]`)]
    })
	},
};