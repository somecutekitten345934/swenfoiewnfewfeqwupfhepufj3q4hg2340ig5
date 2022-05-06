const delay = require("delay");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "covid",
  aliases: ["covid", "corona"],
  description: "Infect someone with COVID-19!",
  category: "fun",
async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("covid")) return message.channel.send("You're not allowed to use this command! You can unlock it by getting infected with COVID-19!")
    let user = await client.usr(args[0]).catch((err) => {});
    if (!user) return message.channel.send("You must mention somebody to infect!");
    let cst0 = await client.db.get("cst" + user.id);
        cst0 = cst0 ? cst0.split(";") : [];
    if (cst0.includes("covid")) return message.channel.send("That user is already infected with COVID-19!");
    if (cst0.includes("handsanitizer") || (user.bot)) {
        message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${user.tag} whips out their hand sanitizer, destroying ${message.author.tag}'s germs`)]
        });
        await delay(500);
        message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${user.tag} remainds unshackled by COVID-19!`)]
        });
    } else {
        cst0.push("covid");
        await client.db.set("cst" + user.id, cst0.join(";"));
        message.channel.send({
        embeds: [new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has coughed all over ${user.tag}, and infected them with COVID-19!`)]
        });
};
},
};