let Discord = require("discord.js");
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const hypixel = new Hypixel.Client('9520a78f-9bcf-4dab-81a1-7d072f53ac6e'); // api key for hypixel

module.exports = {
	name: "eval",
	aliases: ["eval"],
	desc: "Takes some javascript code and evaluates it! This is limited to our bot developers as it is very powerful.",
	usage: "eval <code>",
	category: 'botdeveloper',
	cst: "evaluator",
async run(client, message, args) {
	if (![client.config.owner, "501710994293129216"].includes(message.author.id)) return message.channel.send({
		embeds: [new Discord.MessageEmbed()
		.setColor(client.config.colors.red)
		.setTitle(`Insufficient Permissions!`)
		.setThumbnail(client.config.thumbnail.question)
		.setDescription(`I can't really let you eval code since you dont have the special \`INTERNAL_BOT_DEVELOPER\` permission.. Sorry!`)]
	})

	msg = await message.channel.send({
		embeds: [new Discord.MessageEmbed()
		.setColor(client.config.colors.red)
		.setTitle(`Weebchan is Thinking!`)
		.setThumbnail(client.config.thumbnail.question)
		.setDescription(`I'm evaluating your code... please wait!`)]
	})
	if(message.content.includes(`216749228087705610`) && message.author.id !== client.config.owner){
		return message.reply(`I dont think so buddy`)
	}
	async function clean(text) {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
				return await text;
	}

	try {
		async function escapeRegExp(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		}
		let code = args.join(" ")
		if (!code) {
			return msg.edit({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Code is Missing!`)
				.setThumbnail(client.config.thumbnail.pout)
				.setDescription(`Did you really think I had magical powers and could evaluate nothing? Give me some code!`)]
			})
		};
	//	code = code.toString().replace(new RegExp(escapeRegExp(client.token), 'g'), '/*token removed*/');
		
	//	if(code.includes('forEach') && (message.author.id != client.owner)) return msg.edit(process.env.re + ' forEach is forbidden!')
		if(code.includes('token')) return msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`FORBIDDEN KNOWLEDGE!`)
			.setThumbnail(client.config.thumbnail.mad)
			.setDescription(`The "Client Token" is ancient magic that is forbidden! Go away!`)]
		})
		if(code.includes('client[')) return msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`FORBIDDEN KNOWLEDGE!`)
			.setThumbnail(client.config.thumbnail.mad)
			.setDescription(`The "Client Token" is ancient magic that is forbidden! Go away!`)]
		})
		if(code.includes('client [')) return msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`FORBIDDEN KNOWLEDGE!`)
			.setThumbnail(client.config.thumbnail.mad)
			.setDescription(`The "Client Token" is ancient magic that is forbidden! Go away!`)]
		})
		let evaled;
			if (code instanceof Promise) {
				evaled = await eval(code);
			} else {
				evaled = eval(code);
			};
		if (typeof evaled !== "string")
			evaled = require("util")
				.inspect(evaled);
			let cleaned = await clean(evaled);
		 msg.edit({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.green)
			.setTitle(`Evaluation Success!`)
			.setThumbnail(client.config.thumbnail.cool)
			.setDescription(`I have successfully evaluated the code provided!\`\`\`xl\n${cleaned}\n\`\`\``)]
		})
	} catch (err) {
			msg.edit({
				embeds: [new Discord.MessageEmbed()
				.setTitle("Evaluation Unsuccessful")
				.setThumbnail(client.config.thumbnail.fuckyou)
				.setDescription(`Maybe give me better code next time lol, anyways below is the error\`\`\`xl\n${err}\n\`\`\``)
				.setColor(client.config.colors.red)]
			});
		};
	},
};