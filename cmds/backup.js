const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "backup",
	aliases: ['backup', 'bu'],
	description: 'Sends you an encoded string containing all of your data. For security reasons, the manipulation and how this data is handled will remain unspecified. Also note that trying to use someone else\'s backup token will result in permanent stuns. Note if you send this token to someone else, then it\'s **YOUR** fault and both parties involved will be punished with the same severity. Currently, there is no way of loading previously created backups.',
	category: 'utl',	
	async run(client, message, args) {
		if (!args) args = [message.author.id];
		var user = await client.usr(args[0]);
		if (!user) user=message.author; 
		if (message.author.id === client.config.owner) {
			let str; 
			let objects = ['mute', 'stun', 'dailyc', 'role']
			const keys = client.keys.concat(client.commands.map(x => x.name)).filter((x) => !objects.includes(x));
			for (var key in keys) {
				let value = await client.db.get(`${keys[key]}${user.id}`);
				if (!value) {

				} else {
					if (typeof value == 'undefined') return; 
					value = value.toString().replace(/_+/g, '%').replace(/;+/g, '::semi');
					str += `${keys[key]}_${value};`;
				}
			};
			const asb64 = Buffer.from(str).toString("base64");
			message.author.send(`${user.tag}'s base64 hash will be sent to you shirtly.`)
					message.channel.send("Check your DMs!")

		return	message.author.send(`\`\`\`\n${asb64}\n\`\`\``, { split: { char: "" } })
		}
		let str; 
		let objects = ['mute', 'stun', 'dailyc', 'role']
		const keys = client.keys.concat(client.commands.map(x => x.name)).filter((x) => !objects.includes(x));
		for (var key in keys) {
			let value = await client.db.get(`${keys[key]}${message.author.id}`);
			if (!value) {

			} else {
				if (typeof value == 'undefined') return; 
				value = value.toString().replace(/_+/g, '%').replace(/;+/g, '::semi');
				str += `${keys[key]}_${value};`;
			}
		};
		const asb64 = Buffer.from(str).toString("base64");
				message.channel.send("Check your DMs!")
		message.author.send(`**Your Backup token will be sent to you shortly.**\nPlease don't share this code with anyone; it will give them access to your stored data.`)
		message.author.send(`\`\`\`\n${asb64}\n\`\`\``, { split: { char: "" } })
	}
}