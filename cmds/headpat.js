const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'headpat',
	aliases: ['stroke', 'str', `hpat`],
	description: "Headpat your waifu to grow its Affection to you by 1",
	category: 'pet',
	async run(client, message, args) {
		let cooldown = await client.db.get('strokec' + message.author.id);
		let time = ms('15m');
		let pet = await client.db.get("pet"+message.author.id);
		if (!pet)	return message.channel.send("It looks like you don't own a waifu! Why not tame one by using `" + message.guild.prefix + "tame`")	
			pet = pet.split(';');
			const currAlias = await client.db.get("curralias" + message.author.id) || "default";
			let emojis;
			let display;
			if (currAlias) {
				const aliases = require('../petaliases.json');
				const names = Object.keys(aliases);
				if (names.includes(currAlias)) {
					display = aliases[currAlias].DISPLAY_NAME;
					selected = display;
					emojis = aliases[currAlias].EMOJIS;
				} else {
					display = "waifu";
					emojis = client.config.defaults.PET_EMOJIS;
				}
			}			
			let pn = await client.db.get(`petname${message.author.id}`) || display;
			display = pn;		
"level;health;energy;exp;credits;intel;endur;str;affec"
		if (cooldown) {
			const now = Date.now();
			let expirationTime = parseInt(cooldown) + time;
			if (now < expirationTime) {
				let cd = Math.round((expirationTime - now) / ms('1m'));
				return message.channel.send(`You must wait another ${cd} minutes before patting your ${display}'s head!`)
			}
		};
		let affec = Number(pet[8]);
		if(affec > 20000) return message.channel.send("Your waifu's affection points may not exceed 20,000");
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		let inventory = await client.getInventoryString(`${message.author.id}`) || ""
        let item = await client.getItem(`CAPSULE_OF_FORGOTTEN_MEMORIES`)
		let amt = 1
        if(cst.includes(`CAPSULE_OF_FORGOTTEN_MEMORIES`)){
            if(inventory.includes(`CAPSULE_OF_FORGOTTEN_MEMORIES`)){
                affecGained = Math.trunc(Math.random() * (6 - 2) + 2);
				amt = 2
            }
        }

		affec = affec + amt;
		pet[8] = affec.toString();
		await client.db.set(`pet${message.author.id}`, pet.join(';'));
		message.channel.send({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setThumbnail(emojis[9])
			.setTitle(`Affection Gained!`)
			.setDescription(`${message.author.tag} pats their ${display}'s head and increased their ${emojis[7]} by ${amt}!\n\n${inventory.includes(`CAPSULE_OF_FORGOTTEN_MEMORIES`) ? `Your **${item.NAME_PROPER}** has gained you bonus ${emojis[7]}!` : ``}`)]
		});
		await client.db.set(`strokec${message.author.id}`, Date.now(), ms('15m'));
	}
}