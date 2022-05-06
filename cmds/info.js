const { MessageEmbed } = require("discord.js");
const osu = require("node-os-utils");
module.exports = {
	name: "info",
	aliases: ['info'],
	description: "View some bot infomation",
	category: 'info',
	async run(client, message, args) {
		let cmdCount = await client.db.get("cmds") || 0;
		let cm = await client.db.get('cmds' + message.author.id) || 0;
		let msg = await message.channel.send(`Getting information...`)
		let mem = process.memoryUsage().heapUsed / 1024 / 1024;
		let cpu = await osu.cpu.usage();
	var getUptime = function(millis) {
    var dur = {};
    var units = [{
            label: "ms",
            mod: 1000
        },
        {
            label: "s",
            mod: 60,
        },
        {
            label: "m",
            mod: 60,
        },
        {
            label: "hrs",
            mod: 24
        },
        {
            label: "d",
            mod: 31
        }
    ];

    units.forEach(function(u) {
        millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
    });

    var nonZero = function (u) {
        return dur[u.label];
    };
    dur.toString = function () {
        return units
						.reverse()
            .filter(nonZero)
            .map(function (u) {
                return dur[u.label] + "" + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
            })
            .join('');
    };
    return (dur);
};

	msg.edit({
		content: null,
		embeds: [new MessageEmbed()
		.setColor(message.author.color)
		.setTitle('Bot Stats')
		.setDescription('`Users Cached` is not entirely accurate as the same user can be counted multiple times on different guilds.')
		.setAuthor(client.user.tag, client.user.avatarURL())
		.addField('❯ Name', client.user.tag, true)
		.addField('❯ Commands Used (Since: 02/04/2021)', client.comma(cmdCount), true)
		.addField("❯ Commands You've Used", client.comma(cm), true)
		.addField('❯ CPU Usage', `\`${cpu}%\``, true)
		.addField("❯ Servers", client.comma(client.guilds.cache.size), true)
		.addField('❯ Bot Version', `${client.config.version}`, true)
		.addField('❯ Created On', client.user.createdAt.toDateString(), true)
		.addField('❯ Users Cached', client.comma(client.users.cache.size), true)
		.addField("❯ Roles Cached", client.comma(client.guilds.cache.reduce((a, b) => a + b.roles.cache.size, 0)), true)
		.addField("❯ Channels Cached", client.comma(client.channels.cache.size), true)
		.addField("❯ Emoji Cached", client.comma(client.emojis.cache.size), true)
		.addField('❯ Total Cached Files', client.comma(Object.values(require.cache).length), true)
		.addField("❯ Total Cached Items", client.comma(Number(client.guilds.cache.size + client.channels.cache.size + client.users.cache.size)), true)
		.addField('❯ WS Status', client.ws.status.toString(), true)
		.addField('❯ Uptime', getUptime(client.uptime).toString(), true)
		.addField('❯ Memory Usage', `**~**${Math.trunc(mem)}/${Math.trunc(process.memoryUsage().rss / 1024 / 1024)} MB`, true)
		.addField('❯ Discord.js', `v**${require('discord.js').version}**`, true)
		.addField('❯ Total Commands', client.comma(client.commands.size), true)
		.setTimestamp(client.readyTimestamp)
		.setFooter(`Ready`)]
	});	
	}
}