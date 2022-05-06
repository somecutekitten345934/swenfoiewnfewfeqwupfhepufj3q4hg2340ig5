const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "purge",
  aliases: ["purge", "clear"],
  description: "mass deletes messages",
  category: "mod",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
          return message.channel.send(`${client.config.emoji.err} You need the permission \`MANAGE_MESSAGES\` in order to use this!`)
  };
    function date(_date = Date.now()) {
			return moment(_date).format('MMMM Do YYYY, h:mm:ss A');
		};
    async function clear(n = 1, logs, trigger) {
      let { channel: source, author } = trigger;
     if (n < 1 || !logs || !source) return;
    
      let coll = await source.messages.fetch({ limit: n }),
          arr = coll.array(),
          collected = [],
          embeds = [];
    
      let index = 0;
      for (let i = 0; i < arr.length; i += 25) {
        collected.push([]);
        for (let m = i; m < i + 25; m++)
          if (arr[m]) collected[index].push(arr[m]);
        index++;
      }
    
      for (let i = 0; i < collected.length; i++) {
        let embed = new MessageEmbed()
        .setColor(message.author.color)
        .setTitle(`Channel Purging${collected.length > 1 ? ` - Part ${i + 1}` : ""}`)
        .setDescription(`Deleted from: ${source}`)
        .setAuthor(`${author.tag} (${author.id})`, author.displayAvatarURL({ dynamic: true }))
        .setTimestamp(trigger.editedAt ? trigger.editedAt : trigger.createdAt),
        group = collected[i];
        for (let msg of group) {
          let a = `${msg.author.tag} (${msg.author.id}) at ${msg.editedAt ? date(msg.editedAt) : date(msg.createdAt)}`;
          if (!msg.content) msg.content = msg.embeds[0].description || "[]"
          let c = msg.content.length > 1024 ? msg.content.substring(0, msg.content.length - 3) + '...' : msg.content;
          embed.addField(a, c);
        }
        embeds.push(embed);
      }
    
      source.bulkDelete(coll, true).then(async() => {
        if (message.guild.id == client.config.supportServer) {
          for (let embed of embeds) await logs.send({ embed });
        };
        message.channel.send({
          embeds: [new MessageEmbed()
          .setColor(message.author.color)
          .setDescription(`${client.config.emoji.tick} ${message.author.tag} has successfully deleted **${coll.size}** messages in ${Date.now() - message.createdTimestamp} MS`)]
        })
      }).catch((err) => message.channel.send("Sorry, but there was an error whilst performing the request: " + err));
    }
    if (isNaN(args[0]) || (!args[0])) return message.channel.send(`Invalid parameter "${args[0] || "null"}"; "n" must be of type Number`)
    let logs = client.channels.cache.get(client.config.channels.msgLogs);
    clear(Number(args[0]), logs, message);
  }
}