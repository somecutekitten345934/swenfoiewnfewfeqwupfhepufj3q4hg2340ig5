const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "submit",
  aliases: ["submit"],
  description: "Submit your staff application",
  async run(client, message, args) {
		if (message.guild.id != client.config.supportServer) {
      return message.channel.send("this command only works in our support server! Join by using `" + message.guild.prefix + "hub`");
  };    

    let cst = await client.db.get("cst" + message.author.id);
        cst = cst ? cst.split(";") : [];
    if (cst.includes("sbmt")) return message.channel.send("You've already submitted your staff application!");
    let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(message.author.id));
    if (!ch) return message.channel.send("You haven't even applied for staff yet!");
    cst.push("sbmt")  
    client.channels.cache.get(client.config.channels.appNotifs)
      .send(`Application ${ch} submitted by ${message.author.tag} (${message.author.id})`)
    message.channel.send("Successfully notified the staff team!");
    await client.db.set("cst" + message.author.id, cst.join(";"));
  }
};