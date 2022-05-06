const { MessageEmbed, Permissions } = require("discord.js")

module.exports = {
  name: "apply",
  aliases: ["apply"],
  description: "Apply for Trial Moderator",
  category: null,
  disabled: true,
  async run(client, message, args) {
    message.channel.send(`Command System Disabled! (Needs recode due to d.js v13 update)`)
    return
		if (message.guild.id != client.config.supportServer) {
        return message.channel.send("this command only works in our support server! Join by using `" + message.guild.prefix + "hub`");
    };    
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("canapply")) {
      if (Number(message.author.createdTimestamp) > Date.now() - 15778463000) {
        return message.channel.send("Your account is too new to apply for trial moderator")
      };
      if (Number(message.author.createdTimestamp) > Date.now() - 0) {
        return message.channel.send("You have not been in this server for long enough in order to apply for staff.");
      };
    }
    let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(message.author.id));
    if (ch) return message.channel.send("You've already applied for trial moderator!");
    let apps = await client.db.get("apps" + client.config.owner) || 0;
        apps = Number(apps);
		let appChannel = await message.guild.channels.create(`app-${message.author.id}`, {
			parent: client.config.channels.appCat,
      type: 'TEXT',
      topic: message.author.id,
			permissionOverwrites: [{
        id: message.guild.id,
        allow: [],
				deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			}, {
				id: message.author.id, 
        allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.SEND_MESSAGES],
        deny: []
			}, {
        id: client.config.roles.mod.normal,
        allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
        deny: []
      }]
    })
      .catch((e) => message.channel.send(`Sorry, but an error occurred; ${e}`));
      await client.db.set("apps" + client.config.owner, apps + 1)
      await message.member.roles.add(client.config.roles.applicant)
        .catch((err) => message.channel.send(err))
      message.channel.send({
      embed: new MessageEmbed()
      .setColor(client.config.colors.green)
      .setDescription(`${message.author.tag} has successfully begun the staff application process! \`#${appChannel.name}\``)
    })
    appChannel.send(`Welcome ${message.author} to your personal staff application channel! If you have any questions, feel free to contact SemiMute#6630`, {
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`Here, you'll be writing (and submitting) your staff application. You can begin your application by reading over <#808272231355383838> and getting the application format.`)
    });    
  }
}