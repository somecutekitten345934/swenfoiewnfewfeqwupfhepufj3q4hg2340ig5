module.exports = {
  name: "assigns",
  aliases: ["assigns"],
  description: "View a list of pet aliases which you can assign",
  category: "pet",
  async run(client, message, args) {
    let assigns = await client.db.get("assigns" + message.author.id) || "";
    message.channel.send(assigns.split(";").map((x) => `\`${x}\``).join(", "))
  }
}