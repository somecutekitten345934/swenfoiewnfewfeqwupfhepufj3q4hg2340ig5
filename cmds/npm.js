const Discord = require('discord.js')
const moment = require('moment')
const fetch = require('node-fetch')

module.exports = {
	name: 'npm',
	desc: 'Search [npmjs](https://www.npmjs.com/) for any package',
	usage: 'npm <package>',
	aliases: ["npm", "npmjs"],
async run(client, message, args) {
		if (!args.length) {
			const res = await fetch('https://registry.npmjs.com/');
			const data = await res.json();
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(`#da0000`)
				.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
				.setTitle(`Database Information`)
				.addField('❯ Name', data.db_name, true)
				.addField('❯ Doc Count', client.comma(data.doc_count), true)
				.addField('❯ Modification Count', client.comma(data.update_seq), true)
				.addField('❯ Compact Running', data.compact_running || false, true)
				.addField('❯ Deleted Documents', client.comma(data.doc_del_count), true)
				.addField('❯ Disk Size', `${client.comma(Math.trunc(Number(data.data_size / 1024 / 1024)))} / ${client.comma(Math.trunc(Number(data.disk_size) / 1024 / 1024))} MB`, true)]
		//		.addField('❯ Disk Last Started At', moment(data.instance_start_time).format('YYYY/MM/DD hh:mm:ss'), true) keeps saying "invalid Date"
			})
		};
		global.pkg = args.join(' ');
		const msg = await message.channel.send(" Fetching package...")
			const res = await fetch(`https://registry.npmjs.com/${pkg}`);
		if (res.status == 404) {
			return msg.edit(client.config.emoji.err + " I could not find the specified package");
		};
		const body = await res.json();
		if (body.time.unpublished) {
			return msg.edit(client.config.emoji.err + ' The specified package is unpublished');
		};
		const version = body['dist-tags'] ? body.versions[body['dist-tags'].latest] : {};
		const dependencies = version.dependencies ? version.dependencies : null;
		const embed = new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
			.setTitle(body.name)
			.setURL(`https://www.npmjs.com/package/${pkg}`)
			.setDescription(body.description || 'No description.')
			.addField('❯ Version', body['dist-tags'].latest || 'Unknown', true)
			.addField('❯ License', body.license|| 'None', true)
			.addField('❯ Author', body.author ? body.author.name : 'Unknown', true)
			.addField('❯ Created On', moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Last Modified', moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Main File', version.main.toString() || 'index.js', true)
			.setFooter(`In ${Date.now() - message.createdTimestamp} MS`)

		return msg.edit({ embeds: [embed] });
	}
}