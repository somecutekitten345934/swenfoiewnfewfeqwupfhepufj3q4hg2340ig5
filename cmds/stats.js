module.exports = {
    name: "stats",
    aliases: ["stats"],
    category: "utl",
    description: "View someone's command usage statistics.",
    async run(client, message, args) {
        let cst = await client.db.get("cst" + message.author.id) || "";
            cst = cst.split(";");
        let stc = await client.db.get("stc" + message.author.id);
        if (stc && (!isNaN(stc)) && (client.cooldown(message.createdTimestamp, stc))) {
            return message.channel.send(`You must wait ${client.cooldown(message.createdTimestamp, stc)} before checking another user's statistics! (imposed due to potential for abuse)`);
        };
        let user = await client.usr(args[0] || message.author.id).catch((f) => {});
        if (!user) user = message.author;
        let sts = await client.db.get("sts" + user.id) || "0;".repeat(client.commands.size + 15);
        if (sts.endsWith(";")) {
            sts = sts.slice(0, sts.length - 1);
        }
            sts = sts.split(";");
        let msg = `${user.tag}'s Stats\n`;
        for (let [, cmd] of client.commands) {
            msg += `${cmd.name} | ${sts[cmd.indx]} times\n`
        };
        message.channel.send(msg, { split: { char: "\n" }, code: "" });
        await client.db.set("sts" + user.id, sts.join(";"));
        if (!cst.includes("stc")) await client.db.set("stc" + message.author.id, (message.createdTimestamp + 120_000) - client.config.epoch)
    },
};