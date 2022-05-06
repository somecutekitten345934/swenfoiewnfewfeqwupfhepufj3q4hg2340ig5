const { MessageEmbed, escapeMarkdown, DiscordAPIError, Util, codeBlock } = require('discord.js');

module.exports = {
	name: 'data',
	aliases: ['getdata', 'data', 'store', 'gd'],
	category: 'administrator132465798',	
	description: "View a User's stored data",
	cst: "gdt",
	async run(client, message, args) {
		/**
		 * This function will show all stored data regarding a User.
		 * @param {object} user Target user whose data must be shown 
		 */
		async function data(user = message.author) {
			let cst = await client.db.get("cst" + user.id);
					cst = cst ? cst.split(";") : [];
			let Keys = client.keys.concat(cst.concat(["user"]));  // :flushed:

			var shown = [];
			Promise.all(
				Keys.map(async(x) => {
					if (shown.includes(x)) {
						return false;
					};
					shown.push(x);
					if (x == "user") return `user=[${user.tag}, ${user.id}]`;
					const value = await client.db.get(`${x}${user.id}`);
					if (value) {
						if (typeof value == "object") {
							const data = Object.entries(value).map((x) => {
								if (typeof x[1] == "object") {
									return "[this.key=" + x[0] + ";" + Object.entries(x[1]).map((z) => z.join(";")).join(";") + "]"
								} else {
									return x.join(";");
								}
							}).join(";");
							return `${x}=${data || "{}"}\n${x}.type=Object`;
						}
						return `${x}=${value}`;
					} else {
						return false;
					};
				})
			)
				.then((f) => f.filter(a => a != false))
					.then((data) => {
						Util.splitMessage(data.join(`\n`), { maxLength: 1900, char: ""}).forEach(m=> message.channel.send(`\`\`\`\n${m}\`\`\``))
					});
		};
		if (!args.length) args = [message.author.id];
		let user = await client.usr(args[0]).catch((x) => {});
		if (!user) {
			user = message.author;
		};
		await data(user);
	},
};