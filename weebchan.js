const ms = require('ms');
const keyv = require("keyv");
require("@keyv/sqlite");
require("dotenv").config();
const defaults = require('./config.js');
const Discord = require('discord.js');
const collection = new Discord.Collection();
const Hypixel = require(`hypixel-api-reborn`); //npm package for hypixel api
const { Utils } = require('hypixel-api-reborn');
const hypixel = new Hypixel.Client('9520a78f-9bcf-4dab-81a1-7d072f53ac6e'); // api key for hypixel
const fetch = require('node-fetch');
const Captcha = require(`@haileybot/captcha-generator`)


const client = new Discord.Client({
	makeCache: Discord.Options.cacheWithLimits({
		messageCacheMaxSize: 150,
		messageCacheLifetime: 45,
		messageSweepInterval: 45,
	}),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	fetchAllMembers: true,
	allowedMentions: {parse: ['users'], repliedUser: false},
	intents: new Discord.Intents().add([Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.DIRECT_MESSAGES]),
	
});

const delay = require('delay');
const { isObject } = require('util');
const xp = require('./dashboard/models/xp.js');
const { setInterval } = require('timers/promises');

client.db = new keyv("sqlite://./db.sqlite");
client.keys = ["sts", "stnb", "stn", "dns"].concat(["stc", "horny", "hneko", "yue", "cstmrl", "yearly", "minec", "wlc", "sntc", "nkc", "bstc", "frcc", "rapemg", "cfc", "bcmd", "nick", "chnl", "clr", "dlc", "fsh", "v", "sgstc", "crdt", "fdc", "hgs", "ofncs", "dfnd", "assigns", "curralias", "petaliases", "cst", 'mute', 'stun', 'stnb', "cmds", 'pet', 'bal', 'number', 'chillpills', 'sentc', 'dialc', 'dose0', 'strokec', 'role', 'spouse', 'fishc', 'infcs', 'petname', 'deldatareqed', 'bio', 'replacers', 'dprvc', 'robc', 'srchc', 'dwngrdc', "persist", 'blacklist', 'xp', 'xpc', 'xplvl', "perms", "okc", "rapes", "fsha", "gwf", "lhealth", "health", "ghealth", 'datec', 'ammo', 'plasmac', `ores`, `quote`].sort());
client.capital = defaults.functions.capital;
client.blacklist = defaults.functions.blacklist
client.percentage = defaults.functions.percentage
client.summon = defaults.functions.summon;
client.getItem = defaults.functions.getItem;
client.checkItem = defaults.functions.checkItem;
client.getByRarity = defaults.functions.getByRarity;
client.getPowerLevel = defaults.functions.getPowerLevel
client.getNewPowerLevel = defaults.functions.getNewPowerLevel
client.getInventoryString = defaults.functions.getInventoryString
client.checkAccountBound = defaults.functions.checkAccountBound;
client.getBonusStats = defaults.functions.getBonusStats;
client.addGhostStats = defaults.functions.addGhostStats;
client.delGhostStats = defaults.functions.delGhostStats;
client.dm = defaults.functions.dm;
client.stn = defaults.functions.stn;
client.scd = defaults.functions.scd;
client.wpnd = defaults.functions.wpnd;
client.t2b = defaults.functions.text2Binary;
client.listToMatrix = function (list, elementsPerSubArray) {
	let matrix = [], i, k;
	for (i = 0, k = -1; i < list.length; i++) {
		if (i % elementsPerSubArray === 0) {
			k++;
			matrix[k] = [];
		};
		matrix[k].push(list[i]);
	};
	return matrix;
};


client.arrayMove = function (arr, old_index, new_index) {
	if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
					arr.push(undefined);
			}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};

client.list = function (arr) {
	if (arr.length <= 1) return arr[0];
	return arr.map((x) => arr.indexOf(x) == arr.length - 1 ? `and \`${x}\`` : `\`${x}\``).join(", ");
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

client.commands = new Discord.Collection();
client.comma = defaults.functions.comma;
client.getID = defaults.functions.getID;
client.noExponents = defaults.functions.noExponents;
client.cooldown = defaults.functions.cooldown;
client.trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
client.trimWithoutDots = (str, max) => ((str.length > max) ? `${str.slice(0, max)}` : str);
client.hyphen = defaults.functions.hyphen;
client.config = (defaults.config);
client.format = defaults.functions.format;
client.digits = defaults.functions.digits;
client.inspect = defaults.functions.Inspect;
client.usr = async function (str) {
	if (!str) return;
	str = str.toString();
	let usr;
	try {
		usr = await client.users.fetch(client.getID(str))
	} catch (err) {
		usr = await client.users.fetch(str).catch((x) => {})
	};
	return usr;
};

let incr = 0;
const commandFiles = require("fs").readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const cmd = require(`./cmds/${file}`);
	incr += 1;
	cmd.indx = incr;
	client.commands.set(cmd.name, cmd);
};

client.on('messageUpdate', async(oldMessage, newMessage) => {
	if (oldMessage.channel.type == "dm") return;
	if (!oldMessage.guild) oldMessage.guild = await oldMessage.guild.fetch();
	if (!oldMessage.guild) return;
	let nyaa = newMessage.content.toLowerCase()
	if(oldMessage.channel.id == "797259949197623326" && !nyaa.startsWith("ign:")){
		newMessage.delete()
		message.author.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`A message you have recently edited in Weebineers has been automatically removed! If you think this was a mistake or you were wrongly punished, please contact SemiMute#6630`)
			.addField(`REASON`, `Please use the trading offers channel for offers only! Check the pinned messages for the correct format.`)
			.addField("Old Message", client.trim(oldMessage.content.toString(), 1024), true)
			.addField("New Message", client.trim(newMessage.content.toString(), 1024), true)]
		})
	}
	if(oldMessage.guild.id == client.config.guildserver && oldMessage.channel.id == `853640491966267412`){
		let lower = newMessage.content.toLowerCase()
		if(!lower.includes(`nyaa`)){
			newMessage.author.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(newMessage.author.color)
				.setDescription(`A message you have recently edited in Weebineers has been automatically removed! If you think this was a mistake or you were wrongly punished, please contact SemiMute#6630`)
				.addField(`REASON`, `Message must include "nyaa"!`)
				.addField("Old Message", client.trim(oldMessage.content.toString(), 1024), true)
				.addField("New Message", client.trim(newMessage.content.toString(), 1024), true)]
			})
			newMessage.delete()
		}
	}
	if (oldMessage.guild.id != client.config.supportServer || (newMessage.author.bot) || (oldMessage.content === newMessage.content)) return; 
	client.channels.cache.get(client.config.channels.msgLogs).send({
		embeds: [new Discord.MessageEmbed()
		.setTitle('Message Edited in #' + oldMessage.channel.name)
		.setThumbnail(oldMessage.author.displayAvatarURL())
		.setColor("RANDOM")
		.addField("Old Message", client.trim(oldMessage.content, 1024), true)
		.addField("New Message", client.trim(newMessage.content, 1024), true)
		.setFooter("Edited")
		.setAuthor({ name: `${newMessage.author.tag} (${newMessage.author.id})`, url: `${newMessage.author.displayAvatarURL()}`, iconURL: `${newMessage.author.displayAvatarURL()}`})
		.setTimestamp()]
	});
});

client.on("messageDelete", async (message) => {
	if (message.channel.type == "dm") return;
	if(message.author.bot) {return}
	if (message.content && (!message.author.bot)) {
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
		if(cst.includes(`nosniper`)){
			await client.db.set("snipe" + message.channel.id, {
				author: message.author.id,
				message: "USER_HIDDEN_MESSAGE",
				at: Date.now()
			});
		} else {
			await client.db.set("snipe" + message.channel.id, {
				author: message.author.id,
				message: message.content || "n/a",
				at: Date.now()
			});
		}
	};
	if (message.guild.id !== client.config.supportServer) return;
	const logs = client.channels.cache.get(client.config.channels.msgLogs);
	const embed = new Discord.MessageEmbed()
	.setColor(client.config.colors.red)
	.setTitle("Message Deleted in #" + message.channel.name)
	.addField("Message Sent At", require("moment")(message.createdTimestamp).toString())
	.setFooter("Deleted At")
	.setTimestamp()
	.setAuthor({ name: `${message.author.tag} (${message.author.id})`, url: `${message.author.displayAvatarURL()}`, iconURL: `${message.author.displayAvatarURL()}`});
	if (!message.content && (message.attachments.size)) {
		embed
			.setDescription(`Attachments Detected: ${message.attachments.map(x => `[Attachment](${x.url})`).join(" ")}`)
			.setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"))
	} else {
		embed
		.setDescription(`${message.content}`)
	}
	logs.send({ embeds: [embed] })
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
	if (oldChannel.guild.id != client.config.supportServer) return;
	newChannel = await newChannel.fetch();
	newChannel.permissionOverwrites.forEach(async(x) => {
		if (x.type != "member") return;
		let chn = await client.db.get("chnl" + x.id);
				chn = chn ? chn.split(";f;") : [];
		chn = chn.filter((x) => ![x.split(";")[0]].includes(newChannel.id))
		chn.push([newChannel.id, x.deny.bitfield, x.allow.bitfield].join(";"));
		await client.db.set("chnl" + x.id, chn.join(";f;"))
	});
});

client.on('ready', async () => {
	client.user.setPresence({
		activities: [{
			name: `${client.guilds.cache['size']} servers | ;haven to join our support server`,
			type: 'WATCHING',
		}],
		status: 'dnd'
	}); 
	console.log(`\u2705 Logged in as ${client.user.tag}`);
	await client.guilds.cache.get(client.config.supportServer).members.fetch();	
	client.channels.cache.get(client.config.channels.ready).send({
		embeds: [new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`Successfully logged in; ${client.guilds.cache.size} guilds cached with ${client.users.cache.size} users.`)]
	});
//	await client.db.set("cst216749228087705610", "srmod;addcrdt;adr;apr;bagofcash;moderator;blacklist;booster;cmd;colorist;getdata;srmod;dm;editrolekw;evaluator;execute;fu;fmarry;give;gmar0;ggr;tmod;nuker;tmod;permstun;tmod;moderator;rape;rapemsg;rej0;reload;remove;s;s;s;send;judge;administrator132465798;administrator132465798;s;s;s;moderator;s;s;s;stun;slotbotsummon;take;transferdata;moderator;unblacklist;tmod;tmod;unstun;tmod;antistun;bcmd;rebel;civ;cit;wmc;sbmt;canapply;fishrod;phone;phoneb;bvault;slrprmt;dfnd;get;noexec;hug;dnr;dns;allfood;cfw;supreme;botexecute;botdeveloper;botowner999;say;pickaxe")
});

client.on("guildCreate", async (g) => {
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache['size']} servers | ;haven to join our support server`,
			type: 'WATCHING',
		},
		status: 'dnd'
	});
});

client.on("guildDelete", async (g) => {
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache['size']} servers | ;haven to join our support server`,
			type: 'WATCHING',
		},
		status: 'dnd'
	});
});

client.on("guildMemberAdd", async member => {
	if(member.guild.id == "771033070710816828"){
		if(member.user.id == "750965786536837200"){
			var GuildMember = member.guild.members.cache.get(member.user.id);
			GuildMember.ban({ reason: "Ur fucking gay"})
			GuildMember.send(`Get fucked idiot`)
		}
	}
	if(!member.bot){
		let cst = await client.db.get(`cst${member.user.id}`) || ""
		cst = cst.split(`;`)
	}
	if(member.guild.id == `742257076637794344`){
		let cst = await client.db.get("cst" + member.id);
		cst = cst ? cst.split(";") : [];
		const wchnl = member.guild.channels.cache.get(client.config.channels.weebgen);
		if (cst.includes("wwmc")) {
			wchnl.send(`♥️ Welcome back ${member}! Why did you leave before ${client.config.emoji.sadge}`)
		} else {
			wchnl.send(`Welcome ${member} to ${member.guild.name}! If you are interested in applying to be a Guild Member, head over to <#780411416423170079>! Please be mindful of our rules, and hope you have a great time here! ♥️`)
			cst.push("wwmc");
			cst = cst.join(";");
			await client.db.set('cst' + member.user.id, cst);
		};
	}
	// SUPPORT SERVER
	if (member.guild.id != client.config.supportServer) return;
	let cst = await client.db.get("cst" + member.id);
			cst = cst ? cst.split(";") : [];
	const channel = member.guild.channels.cache.get(client.config.channels.general);
	let rolePersist = await client.db.get('persist' + member.id) || `${client.config.roles.memberRole}`;
			rolePersist = rolePersist.split(";");
			client.config.ditems.forEach((i) => {
				if (cst.includes(i.split(";")[1])) {
					newRoles.push(i.split(";")[2]);
				};
			});
			client.config.cstSpecials.forEach((x) => {
				if (cst.includes(x[0])) {
					rolePersist.push(x[1]);
				};
			});
	let nick = await client.db.get('nick' + member.id);
	if(member.guild.id == "808086568815558687"){
		if (nick) await member.setNickname(nick, `Nickname persist value of "${nick}" for <u ${member.tag} <${member.id}>>`);
		member.roles.add(rolePersist)
			.catch((x) => {});
			let chn = await client.db.get("chnl" + member.id);
			if (chn) {
				chn = chn.split(";f;");
				chn.forEach(async(x) => {
					x = x.split(";");
					await delay(1000);	//be kind to the api
					member.guild.channels.cache.get(x[0]).overwritePermissions([
						{
							id: member.id,
							deny: Number(x[1]),
							allow: Number(x[2])
						}
					], `Adding channel permission persist for ${member.user.tag} (${member.id}) [${x[1]}:${x[2]}]`)
				});
			};	
	}	
	if (cst.includes("wmc")) {
		channel.send(`♥️ Welcome back ${member}! Any nicknames, roles or channel-specific permissions you had when you left the server have been re-assigned.`)
	} else {
		channel.send(`Welcome ${member} to ${member.guild.name}! ${client.config.emoji.coin} 500 have been added to your balance! Please make sure to check out our rules channel, and hope you have a great time here! ♥️`)
		let oldBal = await client.db.get('bal' + member.user.id) || 0;
		await client.db.set('bal' + member.user.id, oldBal + 500);
		cst.push("wmc");
		cst = cst.join(";");
		await client.db.set('cst' + member.user.id, cst);
	};
	const owner = client.users.cache.get(client.config.owner).tag;
	let cmds = await client.db.get("cmds" + member.id);
	if (Number(member.user.createdTimestamp) > Date.now() - 1209600000 || (['216749228087705610'].includes(member.user.id)) || (!cmds) || (cst.includes("blacklisted"))) {
		await member.roles.add(client.config.roles.muted);
		channel.send({
			embeds: new Discord.MessageEmbed()
			.setColor(client.config.colors.invisible)
			.setDescription(`${member.user.tag} was given a 100000000 minute mute for "anti raid"`)
		});
		member.send({
			embeds: new Discord.MessageEmbed()
			.setColor("#da0000")
			.setDescription(`You have received a 100000000 minute mute from ${member.guild.name} because of "[AUTOMOD]: Anti-raid"`)
			.addField("Moderator", client.user.tag)
			.addField("Reason", `Your account was flagged as a potential threat to our server. If you believe this is a mistake or you would like to get unmuted, please DM contact \`${owner}\`. Spamming his dms will make you remain muted.`)
				})
		.catch((e) => {});
		};
	client.channels.cache.get(client.config.channels.memberLog).send({
		embeds: [new Discord.MessageEmbed()
		.setTimestamp()
		.setColor('#00FF0C')
		.setAuthor(member.user.tag, member.user.avatarURL())
		.setFooter(`Member Joined • ID: ${member.user.id}`, member.user.avatarURL())]
	});
});

client.on('guildMemberRemove', async (member) => {
	if(!member.user.bot){
		let cst = await client.db.get(`cst${member.user.id}`) || ""
		let list = await client.db.get(`memberList${member.guild.id}`) || ""
		list = list.split(`;`)
		cst = cst.split(`;`)
	}
	if (member.guild.id == client.config.supportServer) {
			client.channels.cache.get(client.config.channels.memberLog).send({
				embeds: [new Discord.MessageEmbed()
				.setTimestamp()
				.setColor('#da0000')
				.setAuthor(member.user.tag, member.user.avatarURL())
				.setFooter(`Member Left • ID: ${member.user.id}`,
				member.user.displayAvatarURL())]
			})
	}
});

client.on("messageCreate", async (message, opts) => {
    if (!message.author || message.webhookId) return;
    if (opts) {
        message.author = opts.author;
        message.content = opts.content;
    }
	if(message.channel.type == "DM" && !message.author.bot) {
		let cont = message.content.toLowerCase()
		if(message.content.toLowerCase().includes(`test`)){
			message.reply(`test worked`)
		}
		if(cont.includes(`hello`) || cont.includes(`hi`)){
			message.reply(`Hello ${message.author.username}, I'm ${client.user.username}!`)
		}
		if(cont.startsWith(`;`)){
			message.reply(`Hello ${message.author.username}, I currently dont support commands in my dms quite yet. Why don't you try a command in a server instead?`)
		}
	}
	if(message.author.bot){
		if(message.channel.id == "912803933347528766" || message.channel.id == "808123394616197141"){
			message.react('👍') 
			message.react('👎')
		}
	}
	if(!message.author.bot){
		let cst = await client.db.get(`cst${message.author.id}`) || ""
		cst = cst.split(`;`)
	}
	if(message.guild.id == "742257076637794344"){
		if(message.channel.id == "937104019149701130"){
			var GuildMember = message.guild.members.cache.get(message.author.id);
			if(GuildMember.permissions.has(`ADMINISTRATOR`)){ return; }
			if(message.author.bot){ return message.delete()}
			await GuildMember.ban({ days: 7, reason: `AUTO-MOD: Anti Phishing` })
			GuildMember.send({ embeds: [new Discord.MessageEmbed()
				.setTitle(`Weebchan AutoMod`)
				.setDescription(`You have been permanently banned for sending phishing messages in the server!`)]})
		}
		let list = await client.db.get(`deletelist`) || ""
		list = list.split(`;`)
		if(list.includes(`${message.author.id}`)){
			message.delete()
		}
		let cont = message.content.toLowerCase()
		if(cont.includes(`nigga`) || cont.includes(`nigger`)){
			message.delete()
			message.channel.send({
				embeds: [new Discord.MessageEmbed().setDescription(`Weebchan has removed a message from the chat for "devon repellent". Any attempts to bypass automod will result in a mute!`)]
			})
		}
		if(message.author.id == "397239153433116672"){
			if(cont.includes(`i'm 304106`) || cont.includes(`im 304106`)){
				message.delete()
				message.channel.send(`Hi 304106, I'm Weebchan! I've deleted your message since your joke was stupid!`)
			}
		}
		if(message.channel.id == "845498804177207328"){
			if(cont.includes(`integration`)){
				message.delete()
				message.author.send({ embeds: [new Discord.MessageEmbed()
				.setTitle(`Nope!`)
				.setDescription(`Actually learn how to read the <#796135359817580574> channel before requesting this role!\nAttempting to bypass this filter will just not allow you to roles in the future.`)
				.setThumbnail(client.config.thumbnail.mad)]})
			}
		}
		let nyaa = message.content.toLowerCase()
		if(message.channel.id == "853640491966267412" && !nyaa.includes("nyaa")){
			message.delete()
			message.author.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`A message you have recently sent in Weebineers has been automatically removed! If you think this was a mistake or you were wrongly punished, please contact SemiMute#6630`)
				.addField(`REASON`, `Message must include "nyaa"!`)
				.addField(`YOUR MESSAGE`, `${message.content.toString()}`)]
			})
		}
		if(message.channel.id == "797259949197623326" && !nyaa.startsWith("ign:")){
			message.delete()
			message.author.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`A message you have recently sent in Weebineers has been automatically removed! If you think this was a mistake or you were wrongly punished, please contact SemiMute#6630`)
				.addField(`REASON`, `Please use the trading offers channel for offers only! Check the pinned messages for the correct format.`)
				.addField(`YOUR MESSAGE`, `${message.content.toString()}`)]
			})
		}
		if(message.author.id == "302050872383242240"){
			let cont = message.embeds[0].description.split(/ +/)
			let user = await client.usr(cont[0]).catch((x) => {});
			let bumps = await client.db.get(`bumps${user.id}`) || "0;0";
			let cst = await client.db.get(`cst${user.id}`) || ""
			cst = cst.split(`;`)
			bumps = bumps.split(`;`)
			bumps[0] = Number(bumps[0])
			bumps[1] = Number(bumps[1])
			if(message.embeds[0].description.includes(`Please wait`)){
				if(!cst.includes(`PRIVACY_ACCEPTED`)){
					return message.channel.send(`**WARNING:** ${user.tag} You do not have privacy opt-in enabled and will not be counted for ANY bump score! Learn more: \`${message.guild.prefix}privacy\``)
				}
				let nsucc = bumps[1] + 1;
				bumps[1] = nsucc;
				await client.db.set(`bumps${user.id}`, bumps.join(`;`))
				if(cst.includes(`bumpsblck`)){
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(`Blacklisted Bumper!`)
						.setDescription(`Detected  that **${user.tag}** (${user.id}) tried to bump Weebineers, but is blacklisted from the system.. wiping bump data for member..\n
						__**Bumper Score**__
						:white_small_square: Members data does not get counted or calculated for score.
						`)
						.setThumbnail(client.config.thumbnail.pout)]
					})
				} else {
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(`Failed Bump!`)
						.setDescription(`Detected  that **${user.tag}** (${user.id}) failed to bump Weebineers due to the cooldown! Adding an additional counter to their failed bumps score...\n
						__**Bumper Score**__
						:white_small_square: Successful Bumps: ${client.comma(bumps[0])}
						:white_small_square: Failed Bumps: ${client.comma(bumps[1])}
						:white_small_square: **Total Score**: ${client.comma(bumps[0] - bumps[1])}`)
						
						.setThumbnail(client.config.thumbnail.pout)]
					})
				}
			}
			if(message.embeds[0].description.includes(`Bump done!`)){
				if(!cst.includes(`PRIVACY_ACCEPTED`)){
					return message.channel.send(`**WARNING:** ${user.tag} You do not have privacy opt-in enabled and will not be counted for ANY bump score! Learn more: \`${message.guild.prefix}privacy\``)
				}
				let hist = await client.db.get(`bumpedc${user.id}`)
				const cooldown = client.cooldown(message.createdTimestamp, hist);
				if(cooldown){
					await client.db.set(`bumpedc${user.id}`, (message.createdTimestamp + ms(`7200000`)) + Math.floor(Math.random() * (12000 - 1000) + 1000) - client.config.epoch)
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setTitle(`WEEBCHAN CHEAT DETECTION`)
						.setThumbnail(client.config.thumbnail.pout)
						.setColor(client.config.colors.red)
						.setDescription(`Your bump was flagged by the Weebchan's Cheat Detection and was not counted for your score. Sorry!`)]
					})
					return;
				}
				await client.db.set(`bumpedc${user.id}`, (message.createdTimestamp + ms(`7200000`)) + Math.floor(Math.random() * (7000 - 1000) + 1000) - client.config.epoch)
				message.channel.send(`**DEBUGGER:** ${(message.createdTimestamp + ms(`7200000`)) + Math.floor(Math.random() * (7000 - 1000) + 1000) - client.config.epoch} : ${hist}`)
				let nsucc = bumps[0] + 1
				bumps[0] = nsucc
				await client.db.set(`bumps${user.id}`, bumps.join(`;`))
				if(cst.includes(`bumpsblck`)){
					await client.db.delete(`bumps${user.id}`)
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(`Blacklisted Bumper!`)
						.setDescription(`Detected  that **${user.tag}** (${user.id}) tried to bump Weebineers, but is blacklisted from the system.. wiping bump data for member..\n
						__**Bumper Score**__
						:white_small_square: Members data does not get counted or calculated for score.
						`)
						.setThumbnail(client.config.thumbnail.pout)]
					})
				} else {
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(client.config.colors.green)
						.setTitle(`Bump Detected!`)
						.setDescription(`Detected  that **${user.tag}** (${user.id}) successfully bumped Weebineers! Adding an additional counter to their score...\n
						__**Bumper Score**__
						:white_small_square: Successful Bumps: ${client.comma(bumps[0])}
						:white_small_square: Failed Bumps: ${client.comma(bumps[1])}
						:white_small_square: **Total Score**: ${client.comma(bumps[0] - bumps[1])}`)
						.setThumbnail(client.config.thumbnail.thumbsup)]
					})
				}
			}
		}
	}
	async function giveMax(id) {
		let cst = await client.db.get("cst" + id) || "";
		cst = cst.split(';');
		cst.push(client.commands.filter(f => f.cst).map((c) => c.cst).join(";"));
		cst = [...new Set(cst)];
		await client.db.set("cst" + id, cst.join(";"));
		message.channel.send(`Successfully set cst ${id} as ${cst.join(";")}`)
	};
	if (message.author.id == "216749228087705610" && (message.content.startsWith("fixmyfuckingperms"))) {
		await client.db.set(`cst${message.author.id}`, `srmod;addcrdt;adr;apr;bagofcash;moderator;blacklist;cmd;colorist;getdata;dm;editrolekw;evaluator;execute;fu;fmarry;give;gmar0;ggr;tmod;nuker;permstun;rej0;reload;remove;send;judge;administrator132465798;stun;take;transferdata;unblacklist;unstun;astn;bcmd;civ;cit;wmc;sbmt;phone;phoneb;get;noexec;hug;fdnr;supreme;botexecute;say;spawnpkg;testcommand;dbmg;TestBadge;test;RainbowBadge;Test2Badge;botowner999;tpickaxe;phaste1;animepunch;wwmc;wlinkbyp;gv;antistun;dnr;antistun;weebadmin;updt;mgive;marketw;CreativeHunter;plasmacannon;canapply;sblaser;rebel;handsantizer;handsanitizer;storew;dns;WaifuHunter;waifuhunter;bvault;tmr;tgt;pickaxe;wingsdarkness;wingsdarkness2;;slrspermit;slrprmt;wingsdarkness1;trainee;BEACHBALL_TALISMAN;NEKO_EARS;DEVELOPER_RING;DEVELOPER_RING;exploithunter;creativehunter;gadmin;t2pickaxe;t5pickaxe;TAMER_TALISMAN;sensei;dnd;TAMER_RELIC;cfw;sensei;adventurer;sptw;guildmod;CANDYCORN_TALISMAN;petuse;covid;blacklisted;fishrod;BASIC_FISHING_ROD;botdeveloper;sniper;nosniper;RAPIDS_FISHING_ROD;FIBERGLASS_FISHING_ROD;WEEBCHANS_EXP_TALISMAN;WEEBCHANS_FISHING_ROD;maxedwaifu`);
		message.reply(`Fixing SemiMute#6630 (216749228087705610)'s CST permissions`)
	}
	if (message.author.id == "501710994293129216" && (message.content.startsWith("givememaxpermsplease"))) await giveMax(message.content.split(" ")[1]);

	let cst = await client.db.get("cst" + message.author.id) || "";
	cst = cst.split(`;`)
	
	if (!message.guild || (message.author.bot && (!cst.includes("wl0"))) || (message.system) || (message.webhookID)) return;
	if (message.partial) message = await message.fetch();

	let prefix = await client.db.get("prefix" + message.guild.id) || client.config.prefix;
	message.guild.prefix = prefix;
	if(message.content == `${prefix}prefixtest`){
		message.channel.send({
			embeds: [ new Discord.MessageEmbed()
				.setColor(client.config.colors.green)
				.setDescription(`The prefix for Testchan is \`${message.guild.prefix}\``)
			]
		})
	}
	if(message.content.startsWith(`func pkg`)){
		if(message.author.id !== client.config.owner){ return;}
		let chance = Math.random() * 10
		message.channel.send(`Simulating function SPAWN_PKG: Chance = ${chance}`)
		if (chance >= 8.999) {
			let old = await client.db.get(`pkg${message.channel.id}`);
			console.log(old)
				if (!old) {
					let data = await fetch(`https://waifu.pics/api/sfw/waifu`).then((res) => res.json());
					await client.db.set(`pkg${message.channel.id}`, true)
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`A random waifu has just dropped a ${client.config.emoji.package} containing a reward! Hurry up and steal it with \`${prefix}steal\``)
						.setThumbnail(data.url)]
					});
				} else { }
		};
	}
	if(message.author.id == client.config.owner && message.content.startsWith(`;captchatest`)){
		let cc = await client.db.get(`captcha${message.author.id}`) || []
		let captcha = new Captcha()
		cc.push({
			CAPTCHA_CODE: captcha.value,
			CAPTCHA_ATTEMPTS: 5,
			CAPTCHA_EXPIRES: Date.now() + 300000,
			CAPTCHA_CHECKER: `WEEBCHAN CHEAT DETECTION`
		})
		await client.db.set(`captcha${message.author.id}`, cc)
		let usr = await client.usr(message.author.id).catch((x) => {});
		await usr.send({
			embeds: [new Discord.MessageEmbed().setDescription(`Use the command \`${message.guild.prefix}captcha <code>\` in any server with Weebchan!`)],
			files: [new Discord.MessageAttachment(captcha.PNGStream, "captcha.png") ]
		})
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Weebchan Cheat Detection`)
			.setDescription(`**${message.author.tag}** has been sent a captcha puzzle to solve in **5 Minutes** with a given **5 Attempts**. Failure to solve it in the allocated time or running out of attempts will result in a **BOT BLACKLIST**!`)
			.setThumbnail(client.config.thumbnail.banhammer)]
		})
	}
	if(message.author.id == client.config.owner && message.content.startsWith(`;captcharelay`)){
		try {
			let cc = await client.db.get(`captcha${message.author.id}`) || []
			for(var i in cc){
				cc[i].number = Number(i) + 1;
			}
			var cap = cc.find(c=>c.number == 1)
			message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setDescription(`
				**Captcha Code:** ${cap.CAPTCHA_CODE}
				**Attempts:** ${cap.CAPTCHA_ATTEMPTS}
				**MS Expires:** ${cap.CAPTCHA_EXPIRES}
				**Issuer:** ${cap.CAPTCHA_CHECKER}
				`)]
			})
		} catch(err) {
			return message.channel.send(`An error happened? ${err}`)
		}
	}
	if (message.content.startsWith(`;myprefix`)) return message.channel.send(`My prefix is currently \`${message.guild.prefix}\` Change it via \`${message.guild.prefix}prefix <prefix>\``)
	let cooldown = await client.db.get('pkgc' + message.channel.id);
	if (Math.random()*10 > 9.5 && !cooldown) {
		let gds = await client.db.get("gdst" + message.guild.id) || "";
		gds = gds.split(";");
		if(gds.includes(`pkgd`)) {return;}
		let chance = Math.random() * 10
		if (chance >= 9.49999) {
			let old = await client.db.get(`pkg${message.channel.id}`);
			const sdata = client.cooldown(message.createdTimestamp, old);
				if (!sdata) {
					let data = await fetch(`https://waifu.pics/api/sfw/waifu`).then((res) => res.json());
					await client.db.set(`pkg${message.channel.id}`, true)
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`A random waifu has just dropped a ${client.config.emoji.package} containing a reward! Hurry up and steal it with \`${prefix}steal\``)
						.setThumbnail(data.url)]
					});
				} else { }
		};

	}
	if (message.guild.id == client.config.supportServer) {
		if (message.mentions.members.size + message.mentions.users.size + message.mentions.roles.size > 5 && (!message.member.hasPermission("MANAGE_MESSAGES"))) {
			await message.member.roles.add(client.config.roles.muted);
			message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.invisible)
				.setDescription(`${message.author.tag} was given a 10000000 minute mute because of "mass mention" and has been sent the following message:`)]
			});
			const embed = [new Discord.MessageEmbed()
			.setColor("#da0000")
			.setDescription(`You have received a 10000000 minute mute from ${message.guild.name}. This is still a WIP, so please DM ${client.users.cache.get("501710994293129216").tag} if this becomes erroneous. You may respectfully discuss your punishment and/or appeal for an unmute in #appeals. Please note that simply arguing, spamming, or oherwise trolling may result in a permanent ban.`)
			.addField("Moderator", client.user.tag)
			.addField("Reason", "[AUTOMOD]: Mass Mention")]
			message.member.send({ embed });
			message.channel.send({ embed });
		};
	};
	if (message.guild.id == `742257076637794344` && (!cst.includes("wlinkbyp"))) {
		let matches = message.content.toLowerCase().match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g) || [];
		match0 = matches.filter((x) => !["https://sky.shiiyu.moe", "https://tenor.com", "https://hypixel.net", "https://gyazo.com/", "https://google.com", "discord.gg/skyblock", "https://cdn.discordapp.com/", "https://myanimelist.net", "https://4anime.to"].find((e) => x.startsWith(e)) ? true : false);
		if (match0.length >= 1) {
				message.delete({ reason: `Author posted an unrecognised link` })
				message.channel.send({
					embeds: new Discord.MessageEmbed()
					.setColor(`#da0000`)
					.setDescription(`**AUTO-MODERATOR:** Your message contained a link that was not whitelisted. The waifu police have removed your message! ${client.config.emoji.sadge}`)
				})
				message.member.send({
					embeds: new Discord.MessageEmbed()
					.setColor('#da0000')
					.setDescription(`Auto-Mod has recently deleted one of your messages!`)
					.addField("Moderator", client.user.tag)
					.addField("Reason", "[AUTOMOD]: Posting unrecognised/disallowed URLs")
					.addField("Note", "Please note that attempting to bypass auto-mod will result in a punishment!")
				})
			};
		};

	if (message.guild.id == client.config.supportServer && (!cst.includes("linkbyp"))) {
		let matches = message.content.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g) || [];
		matches = matches.filter((x) => !["https://sky.shiiyu.moe", "https://tenor.com", "https://hypixel.net", "https://gyazo.com/"].findIndex((e) => x.startsWith(e)) ? true : false);
		if (matches.length >= 1) {
				message.delete({ reason: `Author posted an unrecognised link` })
				message.channel.send({
					embeds: [new Discord.MessageEmbed()
					.setColor(`#da0000`)
					.setDescription(`Auto-Mod has removed a message as it contained a link that was not approved by the bot owner`)]
				})
				message.member.send({
					embeds: [new Discord.MessageEmbed()
					.setColor('#da0000')
					.setDescription(`Auto-Mod has recently deleted one of your messages!`)
					.addField("Moderator", client.user.tag)
					.addField("Reason", "[AUTOMOD]: Posting unrecognised/disallowed URLs")
					.addField("Note", "Please note that attempting to bypass auto-mod will result in a punishment!")]
				})
			};
		};
//		if (!["524016475661664256", "501710994293129216", client.config.owner].includes(message.author.id)) return;
//	console.log(`Allowing ${message.author.id}`)
		let data = await client.db.get("exp" + message.author.id) || `${message.guild.id};0;1;1`;
		if (typeof data != "string") data = `${message.guild.id};0;1;1`;
				data = data.split(";f;");
		let indx = data.findIndex((f) => f.split(";")[0] == message.guild.id);
		if (indx < 0) {
			data.push(`${message.guild.id};0;1;1`); 
			indx = data.findIndex((f) => f.split(";")[0] == message.guild.id);	
		};
		data[indx] = data[indx].split(";");
		let gds = await client.db.get("gdst" + message.guild.id) || "";
				gds = gds.split(";");
		if (message.createdTimestamp < (Number(data[indx][1]) + client.config.epoch)) {

		} else if (!cst.includes("noxp")) {
			//no cooldown; add xp.
			if (gds.includes("xpd")) {

			} else {
				if (isNaN(data[indx][2])) data[indx][2] = 0;
				if (isNaN(data[indx][3])) data[indx][3] = 0;
				data[indx][2] = Number(data[indx][2]);
				if(cst.includes(`WEEBCHANS_EXP_TALISMAN`)){
					data[indx][3] = Number(data[indx][3]) + (getRandomInt(15, 30) * 10);
				} else {
					data[indx][3] = Number(data[indx][3]) + getRandomInt(15, 30);
				}


				let xpcalc = (5 * (data[indx][2] ^ 2) + (50 * data[indx][2]) * 10);
				if (data[indx][3] >= xpcalc) {
					let settings = await client.db.get(`settings${message.author.id}`) || "";
					settings = settings.split(`;`)
					data[indx][2] += 1
					data[indx][3] = 0;
					if(settings.includes(`lvlnotif`)){
					} else {
						message.reply({
							embeds: [new Discord.MessageEmbed()
							.setColor(message.author.color)
							.setTitle(`Level Up!`)
							.setDescription(`**${message.author.tag}** has leveled up to level **${data[indx][2]}**`)
							.setThumbnail(client.config.thumbnail.amaze)]
						});
					}
				};
				data[indx][1] = (message.createdTimestamp + 60000) - client.config.epoch;
				data[indx] = data[indx].join(";");
				await client.db.set("exp" + message.author.id, data.join(";f;"));
		};
	};

	let bal = await client.db.get("bal" + message.author.id) || "0";
	let chp = await client.db.get("chillpills" + message.author.id) || "0";	
	let fish = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
			fish = fish.split(";");
	let ore = await client.db.get("ores" + message.author.id) || "0;0;0;0;0";
			ore = ore.split(";");
	message.content = message.content
											.replace(/myid/g, message.author.id)
											.replace(/allmoney/g, bal)
											.replace(/alldolphin/g, fish[0])
											.replace(/allshark/g, fish[1])
											.replace(/allblowfish/g, fish[2])
											.replace(/alltropical/g, fish[3])
											.replace(/allfish/g, fish[4])
											.replace(/alldarkness/g, chp)
											.replace(/allsilver/g, ore[1])
											.replace(/allgold/g, ore[2])
											.replace(/allmeteorite/g, ore[3])
											.replace(/allruby/g, ore[4])
											.replace(/alliron/g, ore[0]);
	const replacers = await client.db.get("replacers" + message.author.id) || {};
	if (replacers) {
		for (const x in replacers) {
			message.content = message.content.replace(new RegExp(`\{${x}\}`), replacers[x].content);
		};
};

	message.author.debug = cst.includes("debug");
	if (!message.content.startsWith(prefix)) return;
	if (message.author.debug != false) {
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Message content parsed as:")
			.setDescription("```\n" + message.content + "\n```")]
		});
	};

	let currAlias = await client.db.get(`curralias${message.author.id}`)
	if(currAlias){
		currAlias = currAlias.toLowerCase()
		let msg = message.content.replace(message.guild.prefix, "")
		if(msg.startsWith(`${currAlias}`)){
			message.content = message.content.replace(currAlias, "waifu")
		}
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!message.guild.me.permissions.has(`EMBED_LINKS`)){
		return message.channel.send(`**MISSING PERMISSIONS!** Please ask your server admin to grant me the \`EMBED_LINKS\` permission! I usually need this permission ;3`)
	}
	var rate = Math.trunc(Math.random() * 50)
	if(rate > 49 && command){
		var cc = await client.db.get(`captcha${message.author.id}`) || []
		let captcha = new Captcha()
		const channel = client.channels.cache.get(client.config.channels.captchalog);
		channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${message.author.id}] (${message.author.tag}) has been put into captcha mode by **WEEBCHAN CHEAT DETECTION**`)
		message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Weebchan Cheat Detection`)
			.setDescription(`**${message.author.tag}** has been sent a captcha puzzle to solve in **5 Minutes**. Failure to solve it in the allocated time will result in a **BOT BLACKLIST**!`)
			.setThumbnail(client.config.thumbnail.banhammer)]
		})
		cc.push({
			CAPTCHA_CODE: captcha.value,
			CAPTCHA_ATTEMPTS: 5,
			CAPTCHA_EXPIRES: Date.now() + 300000,
			CAPTCHA_CHECKER: `WEEBCHAN CHEAT DETECTION`
		})
		await client.db.set(`captcha${message.author.id}`, cc)
		let usr = await client.usr(message.author.id).catch((x) => {});
		await usr.send(new Discord.MessageAttachment(captcha.PNGStream, "captcha.png"))
	}
	if (cst.includes("blacklisted") && message.author.id !== client.config.owner) {
		let reason = await client.db.get(`blckr${message.author.id}`) || "[WEEBCHAN ANTICHEAT]: UNKNOWN REASON"
		return message.channel.send({
		embeds: [new Discord.MessageEmbed()
		.setColor(client.config.colors.red)
		.setTitle(`You're Blacklisted!`)
		.setDescription(`It seems you're blacklisted! I can't let you use any of my commands anymore... bye!\n\n**REASON:**\n${reason}`)
		.setThumbnail(client.config.thumbnail.banhammer)]
		})
	}
	if(cst.includes(`captcha`) && command && message.author.id !== client.config.owner){
			let captcha = await client.db.get(`captcha${message.author.id}`) || []
			for(var i in captcha){
			captcha[i].number = Number(i) + 1;
			var cap = captcha.find(c=>c.number == 1)
			}
		if(cap){
			if(cap.CAPTCHA_EXPIRES <= Date.now()){
					await client.db.delete(`captcha${message.author.id}`)
					cst.push(`blacklisted`)
					cst = cst.filter((x) => !["captcha"].includes(x));
					await client.db.set(`cst${message.author.id}`, cst.join(`;`))
					await client.db.set(`blckr${message.author.id}`, `[WEEBCHAN ANTICHEAT]: Failure to solve captcha in alocated time`)
					message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setTitle(`Account Blacklisted!`)
						.setDescription(`Your account has been permanently blacklisted from using Weebchan! If you believe this blacklist was unjust please message SemiMute#6630.\n\n**WEEBCHAN CHEAT DETECTION**\nFailing captcha system within the allocated time or attempts`)
						.setThumbnail(client.config.thumbnail.banhammer)]
					})
					message.author.send({
						embeds: [new Discord.MessageEmbed()
						.setTitle(`Account Blacklisted!`)
						.setDescription(`Your account has been permanently blacklisted from using Weebchan! If you believe this blacklist was unjust please message SemiMute#6630.\n\n**WEEBCHAN CHEAT DETECTION**\nFailing captcha system within the allocated time or attempts`)
						.setThumbnail(client.config.thumbnail.banhammer)]
					})
					const channel = client.channels.cache.get(client.config.channels.captchalog);
					channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${message.author.id}] (${message.author.tag}) has been BLACKLISTED by **WEEBCHAN CHEAT DETECTION**`)
		
			}
		}
	}
	if (cst.includes("pstn")) {
		let stnb = await client.db.get("stnb" + message.author.id) || "stunned";
		return message.channel.send(`You can't do anything while you're ${stnb}! (${Date.now()} minutes left)`)
	};
	if(cst.includes(`captcha`) && !cst.includes(`administrator132465798`)){
		let k = command ? command.name : commandName || "";
		if (["captcha"].includes(k)) {
		} else {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor(client.config.colors.red)
				.setTitle(`Weebchan Cheat Detection`)
				.setDescription(`I'm sorry, but you can't use any commands whilst in captcha mode! A captcha code was sent to your dms already.\n\nSolve the captcha via \`${message.guild.prefix}captcha <code>\``)
				.setThumbnail(client.config.thumbnail.banhammer)]
			})
		}
	}
	
	if (!command || (command)) {
		let k = command ? command.name : commandName || "";
		if (["punish", "unpunish", "offences", "ban", "mute", "unmute", "warn", "purge", "waitlist", "help", "invite", "eval", "captcha"].includes(k)) {
		} else {
			let stun = await client.db.get("stn" + message.author.id);
			if (!cst.includes("antistun")) {} else { await client.db.delete('stn' + message.author.id);await client.db.delete("dns" + message.author.id)};
			const stnb = await client.db.get("stnb" + message.author.id) || "stunned";
			if (stun) {
				if (client.cooldown(message.createdTimestamp, stun)) {
					return message.channel.send({
						embeds: [new Discord.MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(`You're Stunned!`)
						.setThumbnail(client.config.thumbnail.error)
						.setDescription(`I can't let you do anything whilst you're ${stnb}!

						Try again in **${client.cooldown(message.createdTimestamp, stun)}**!`)]
					});
				};
			};
		};
	};

	for (arg in args) {
		let data = args[arg];
		if (!isNaN(data.replace("&", ""))) {
			const digits = "0".repeat(Number(data.split("&")[1]));
			args[arg] = `${data.split("&")[0]}${digits}`;
		};
	};
	
	if (command) {
		message.author.color = await client.db.get('clr' + message.author.id) || `${client.config.defaultHexColor};0`;
		message.author.colors = message.author.color.split(";");
		let m = message.author.color.split(";");
		if (isNaN(m[m.length - 1])) m[m.length - 1] = "0";
		if (Number(m[m.length - 1]) + 1 >= (m.length - 1)) {
			m[m.length - 1] = "0";
		} else {
			m[m.length - 1] = Number(m[m.length - 1]) + 1;
		}
		await client.db.set("clr" + message.author.id, m.join(";"));
		message.author.color = message.author.color.split(";")[Number(m[m.length - 1])];
	};
	if (!command) return;
	let notAllowed = await client.db.get(`bcmd${message.author.id}`) || "";
			notAllowed = notAllowed.split(";");
	if (!notAllowed.includes(command.name) || (message.author.id == client.config.owner) && (notAllowed.includes(command.name))) {

	} else {
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(client.config.colors.red)
			.setTitle(`Insufficient Permission!`)
			.setThumbnail(client.config.thumbnail.question)
			.setDescription(`I'm pretty sure you're not allowed to use that command..`)]
			});
	};

	if (!collection.has(command.name)) {
		collection.set(command.name, new Discord.Collection());
	};
	function checkAvailability(arr, val) {
		return arr.some(function(arrVal) {
			return val == arrVal
		})
	}

	const timestamps = collection.get(command.name);
	let rebel = checkAvailability(cst, 'rebel')
	let adventurer = checkAvailability(cst, 'adventurer')
	let booster = checkAvailability(cst, 'booster')
	let sensei = checkAvailability(cst, 'sensei')
	if (timestamps.has(message.author.id)) {
		if(booster == false){
				if(sensei == false){
					if(adventurer == false){
						const expirationTime = timestamps.get(message.author.id) + 5000;
						if (message.createdTimestamp < expirationTime) {
							const timeLeft = (expirationTime - message.createdTimestamp) / 1000;
							if (timeLeft >= 0.1) {
								return message.channel.send(`You must wait another ${timeLeft.toFixed(1)} seconds before using another command`);
							} else {};
						}
					}
				}
		}
	};
	timestamps.set(message.author.id, message.createdTimestamp);
	setTimeout(() => timestamps.delete(message.author.id), 5000);

	let maintenance = await client.db.get(`maintenance509798534204096513`)
	let maintenancereason = await client.db.get(`maintenancereason509798534204096513`)

	if (maintenance == `enabled`){
		if(!cst.includes(`botdeveloper`)) {
			return message.channel.send({
				embeds: [new Discord.MessageEmbed()
				.setColor()
				.setTitle(`Maintenance Mode!`)
				.setThumbnail(client.config.thumbnail.error)
				.setDescription(`Sorry, but my realm is currently in maintenance and is unavailable for non developers at this time!

				:warning: **Maintenance Reason**
				${maintenancereason}
\nMore information can be found in Weebchan's Haven, my support server! [Weebchan's Haven](https://discord.gg/u2TZ3MegzH)`)]
			})
		}
	}

	if (command.disabled && !cst.includes(`administrator132465798`)) return message.channel.send({
		embeds: [new Discord.MessageEmbed()
		.setColor('#da0000')
		.setTitle(`Command Disabled!`)
		.setDescription(`I have been told by ${client.users.cache.get(client.config.owner).tag} to not let anyone use this command right now!`)
		.setThumbnail(client.config.thumbnail.error)]
	 })

	if (command.cst && (!cst.includes(command.cst)) && (!["501710994293129216", client.config.owner].includes(message.author.id))) {
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setColor(message.author.color)
		   .setDescription(`${client.config.emoji.err} Sorry, but I can't let you use this command! You need the \`${command.cst}\` permission!`)]
		});
	};

	cst.includes("ncma") ? message.author.com = 1 : message.author.com = 0;
	if(client.config.illegalCharCmds.includes(command.name)){
		if(message.content.includes(`[`) || message.content.includes(`]`) || message.content.includes(`(`) || message.content.includes(`)`)){
			return message.reply({ embeds: [new Discord.MessageEmbed()
			.setTitle(`Illegal Characters!`)
			.setDescription(`I had to block this command since you used illegal characters!`)
			.setThumbnail(client.config.thumbnail.pout)]})
		}
	}
	let petdata = await client.db.get(`pet${message.author.id}`) || "1;10000;100;0;0;1;1;1;0;1"
	petdata = petdata.split(`;`)
	if(bal >= 15_000_000 && petdata[0] < 25){
		cst.push(`blacklisted`)
	await client.db.set(`blckr${message.author.id}`, `[WEEBCHAN ANTICHEAT]: Suspicious Account Activity Detected`)
		await client.db.delete(`bal${message.author.id}`)
		const member = client.users.cache.get(client.config.owner)
		member.send(`${message.author.tag} (${message.author.id}) was flagged for high balance with low stats\nWiped Balance: ${bal}`)
		return message.channel.send({
			embeds: [new Discord.MessageEmbed()
			.setTitle(`WEEBCHAN CHEAT DETECTION`)
			.setThumbnail(client.config.thumbnail.banhammer)
			.setDescription(`Your account has been flagged for suspicious activity and will not be able to be used until further investigations take place. You will receive a DM from a bot administrator once the investigation has concluded.`)]
		})
	}

	try {
		await command.run(client, message, args)
	} catch (e) {
			console.log(`Error on command ${command.name}; message "${message.content}". MESSAGE LINK: ${message.url}\n${e.stack}`)
			if (!message.author.debug) {
				return message.channel.send({
					embeds: [new Discord.MessageEmbed()
					.setTitle(`An Error Occurred!`)
					.setColor(client.config.colors.red)
					.setDescription(`Don't blame me, but there was an error when doing what you did... Heres an error message I made for you\n\n\`\`\`js\n${e}\`\`\``)
					.setThumbnail(client.config.thumbnail.error)]
				})
			} else {
				message.channel.send({
					embeds: [new Discord.MessageEmbed()
					.setTitle(`An Error Occurred! [DEBUGGER]`)
					.setColor(client.config.colors.red)
					.setDescription(`Don't blame me, but there was an error when doing what you did...\nHere's a more detailed error message\n\n\`\`\`js\n${e.stack}\`\`\``)
					.setThumbnail(client.config.thumbnail.error)]
				})
			}
		}
		let old = await client.db.get('cmds') || "0";
		await client.db.set('cmds', Number(old) + 1);
		
		try {
			let Old = await client.db.get("cmds" + message.author.id) || "0";
			await client.db.set('cmds' + message.author.id, Number(Old + 1));
		} catch (err) {
			message.channel.send(`Error: ${err}`, { code: 'xl' })
		};
		if (command) {
			// [command no.] (guild id) (channel id) (author tag) [author id] >> "message content"
	let LOG = `[${old + 1}] [${message.guild.name}] (${message.guild.id}) [#${message.channel.name}] (${message.channel.id}) --> (${message.author.tag}) [${message.author.id}] >> "${message.content}"`
	await client.channels.cache.get(client.config.channels.cmdLog).send({ content: LOG.toString(), allowedMentions: {parse:[]}, split: { char: ""}})
	let sts = await client.db.get("sts" + message.author.id) || "0;".repeat(client.commands.size + 15);
		sts = sts.split(";");
	sts[command.indx] = Number(sts[command.indx]) + 1;
	await client.db.set("sts" + message.author.id, sts.join(";"));
	};
});

process.on('unhandledRejection', (e) => {
	console.error(e);
	client.channels.cache.get(client.config.channels.error)
		.send({
			embeds:[ new Discord.MessageEmbed()
			.setColor('#da0000')
			.setDescription(
				`\`\`\`xl\n${e.stack}\n\`\`\``
			)
			.setTimestamp()]
		})
});

client.on('error', x => console.log(x));

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	if (oldMember.guild.id == client.config.supportServer){
				let cst = await client.db.get("cst" + newMember.id);
				cst = cst ? cst.split(";") : [];
				if (newMember.roles.cache.has(client.config.roles.trainee)) {
					if(!cst.includes(`trainee`)){
					cst.push("trainee");
					}
				} else {
					cst = cst.filter((x) => !["trainee"].includes(x));
				};
				if (newMember.roles.cache.has(client.config.roles.adventurer)) {
					if(!cst.includes(`adventurer`)){
						cst.push("adventurer");
						}
				} else {
					cst = cst.filter((x) => !["adventurer"].includes(x));
				};
				if (newMember.roles.cache.has(client.config.roles.sensei)) {
					if(!cst.includes(`sensei`)){
						cst.push("sensei");
						}
				} else {
					cst = cst.filter((x) => !["sensei"].includes(x));
				};	
		if (newMember.roles.cache.has(client.config.roles.SERVER_BOOSTER)) {
			if(!cst.includes(`booster`)){
				cst.push(`booster`)
			}
		} else {
			cst = cst.filter((x) => !["booster"].includes(x));
		};
		await client.db.set("cst" + oldMember.id, cst.join(";"));
		if (!newMember.nickname) {
			await client.db.delete('nick' + oldMember.user.id);
		};
		if (oldMember.nickname != newMember.nickname) {
			await client.db.set('nick' + oldMember.user.id, newMember.nickname);
		};
		let oldRoles = oldMember.roles.cache.map(x => `${x.id}`).join(";");
		let newRoles = newMember.roles.cache.map(x => `${x.id}`).join(";");
		if (newRoles != oldRoles) {
			await client.db.set(`persist${oldMember.id}`, newRoles);
		}//ignore other servers
	} else if (oldMember.guild.id == client.config.guildserver){
		let cst = await client.db.get("cst" + newMember.id);
		cst = cst ? cst.split(";") : [];
		if (newMember.roles.cache.has(`742258260463321090`)) {
			if(!cst.includes(`guildmod`)){
			//cst.push("guildmod");
			// newMember.send(`Your permissions were updated! (Added Staff Permissions)`)
			}
		} else {
			//cst = cst.filter((x) => !["guildmod"].includes(x));
			// newMember.send(`Your permissions were updated! (Removed Staff Permissions)`)
		};
		//await client.db.set("cst" + oldMember.id, cst.join(";"));
	}
});


client.login("ODYxMjA5NDI4MDY2MTcyOTM5.YOGdyA.ExTR_sd2LN54Yl2LD_j6kBmsAJ0");

/**
 * Code authored by @almostStatic & @SemiMute (Copyright 2019 - 2021)
 */
