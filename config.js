const delay = require("delay");
const { MessageEmbed } = require("discord.js");

const config = {
	functions: {
		/**
		 * Blacklists a user from being able to use Weebchan
		 * @param {string} user // User ID that should get blacklisted
		 * @param {string} reason // Reason that the user is being blacklisted
		 * @param {boolean} anticheat // Should this punishment be marked as ANTICHEAT?
		 * @param {string} channel // Channel ID
		 */
		blacklist: async function(user, reason, anticheat, channel){
			const usr = this.users.cache.get(user)
			let cst = await this.db.get(`cst${usr.id}`) || ""
			cst = cst.split(`;`)

			await this.db.set(`blckr${usr.id}`, `${anticheat ? `[WEEBCHAN ANTICHEAT]: ${reason}` : `${reason}`}`)
			cst.push(`blacklisted`)
			await this.db.set(`cst${usr.id}`, cst.join(`;`))

			const channelSend = this.channels.cache.get(channel)
			channelSend.send({ embeds: [new MessageEmbed()
			.setColor(this.config.colors.green)
			.setThumbnail(this.config.thumbnail.thumbsup)
			.setDescription(`Successfully blacklisted **${usr.tag}** (${usr.id}) and sent them the following message:`)]})

			const blckMSG = new MessageEmbed()
			.setTitle(`Weebchan Services`)
			.setDescription(`You have been **BLACKLISTED** from interacting with the realm of Weebchan. If you feel that this punishment was false, please message SemiMute#6630.`)
			.addField(`Reason`, `${anticheat ? `[WEEBCHAN ANTICHEAT]: ${reason}` : `${reason}`}`)
			.setThumbnail(this.config.thumbnail.banhammer)

			usr.send({ embeds: [blckMSG]}).catch((e) => {});
			channelSend.send({ embeds: [blckMSG] }).catch((e) => {});
		},
		/**
		 * Summons a Weebchan entity into a specified channel
		 * @param {string} channel channel to be summoned to
		 * @param {string} entity entity ID to be summoned
		 * @param {string} type type: Valid - PUBLIC, PERSONAL
		 * @param {string} user Required if type PERSONAL (Generally message author)
		 */
		summon: async function (channel, entity, type, user) {
			const indx = Object.values(this.config.entities).findIndex((c) => c.NAME == entity)
            const boss = Object.values(this.config.entities)[indx];
			let PUBLIC = await this.db.get(`entity${channel}`)
			let PERSONAL = await this.db.get(`entity${user}`)
			let item = this.getItem(`${boss.ATTRIBUTES.WEAPON}`)
			if(PUBLIC){
				console.log(`SYSTEM: Attempted spawning entity ${boss.NAME} with type ${boss.TYPE} as type PUBLIC but was unable to`)
				return this.channels.cache.get(channel).send(`**ERROR**: Attempted to spawn an entity to type CHANNEL entity${channel}, but there already was one!`)
			}
			if(PERSONAL){
				console.log(`SYSTEM: Attempted spawning entity ${boss.NAME} with type ${boss.TYPE} as type PERSONAL but was unable to`)
				return this.channels.cache.get(channel).send(`**ERROR**: Attempted to spawn an entity to type USER entity${user}, but there already was one!`)
			}

			if(type == "PERSONAL"){
				let usr = await this.usr(user).catch((x) => {});
				if(!usr){
					throw new TypeError(`[WEEBCHAN]: User ID was either invalid or missing whilst attempting to bind an entity with type PERSONAL`)
				}
				let cst = await this.db.get(`cst${usr.id}`) || "";
				cst = cst.split(`;`)
				let data = await this.db.get('pet' + usr.id) || "1;10000;100;0;0;1;1;1;0;1"
				if (usr.bot || cst.includes(`maxedwaifu`)) {
					data = this.config.maxedPet;
				}
				data = data.split(`;`)
				const currAlias = await this.db.get("curralias" + usr.id) || "default";
				let emojis;
				let display;
				if (currAlias) {
					const aliases = require('./petaliases.json');
					const names = Object.keys(aliases);
					if (names.includes(currAlias)) {
						display = aliases[currAlias].DISPLAY_NAME;
						selected = display;
						emojis = aliases[currAlias].EMOJIS;
					} else {
						selected = "default";
						display = "Waifu";
						emojis = this.config.defaults.PET_EMOJIS;
					}
				}
				let pn = await this.db.get(`petname${usr.id}`) || display;
				display = pn;

				let level = data[0]


				const msg = await this.channels.cache.get(channel).send({
					embeds: [new MessageEmbed()
					.setTitle(`Unidentified Enemy!`)
					.setThumbnail(this.config.thumbnail.thinking)
					.setDescription(`${usr.tag}'s **[Lvl ${level}] ${display}** senses an enemy presence closing in on their location....`)]
				})
				await delay(5000)
				msg.edit({
					embeds: [new MessageEmbed()
						.setTitle(`Enemy Identified!`)
						.setThumbnail(this.config.thumbnail.suprise)
						.setDescription(`**Weebchan** helps **[Lvl ${level}] ${display}** identify the enemy, and recognises the unidentified enemy as **${boss.NAME_PROPER}**... ${display} begins the research, uncovering the secrets of this enemy...`)]
				})
				return;
			} else if(type == "PUBLIC"){
				const msg = await this.channels.cache.get(channel).send({
					embeds: [new MessageEmbed()
					.setDescription(`Thinking publicly....`)]
				})
				await delay(4000)
				msg.edit({
					embeds: [new MessageEmbed()
					.setDescription(`Thinking Done!`)]
				})
				await this.db.set(`entity${channel}`, `${boss.NAME};${boss.HEALTH};${boss.ATTRIBUTES.STRENGTH};${boss.ATTRIBUTES.INTELLIGENCE};${boss.ATTRIBUTES.WEAPON}`)
				return;
			} else {
				throw new TypeError(`[WEEBCHAN]: Invalid type! Valid types include: PUBLIC, PERSONAL`)
			}
				this.channels.cache.get(channel).send({
					embeds: [new MessageEmbed()
					.setDescription(`A player has awoken **${boss.NAME_PROPER}** with the difficulty of **${boss.DIFFICULTY}** in <#${channel}>!
	
					"*${boss.DESCRIPTION}*"
					
					__**STATS**__
					:white_small_square: **Health:** ${boss.ATTRIBUTES.HEALTH}
					:white_small_square: **Strength** ${boss.ATTRIBUTES.STRENGTH}
					:white_small_square: **Intelligence** ${boss.ATTRIBUTES.INTELLIGENCE}
					:white_small_square: **Type:** \`${boss.TYPE}\`
					:white_small_square: **Weapon** ${item.NAME_PROPER}
					`)
					
					.setTitle(`Entity has been Summoned!`)]
				})
				if(user){
					channel = user
				}
				await this.db.set(`entity${id}`, `${boss.NAME};${boss.HEALTH};${boss.ATTRIBUTES.STRENGTH};${boss.ATTRIBUTES.INTELLIGENCE};${boss.ATTRIBUTES.WEAPON}`)
		},
		percentage: function (val, max, min=0){
			const range = max - min;
			const value = val - min;
			let percent = (100.0 * value / range / 100) * 100
			return `${percent.toFixed(2)}%`;
		
		},
		capital: function (str) {
            return str[0].toUpperCase() + str.slice(1);
		},
		/**
		 * Shows element in inspcted format 
		 * @param {any} element Element to be inspected 
		 * @param {number} penetrate How deep to penetrate through element
		 */
		Inspect: function (element, penetrate) {
			return require("util").inspect(element, { depth: isNaN(penetrate) ? 1000000000000000000000000 : Number(penetrate) });
		},
		/**
		 * Gets an array of items in the database based off rarity and type
		 * @param {string} rarity // Rarity of item to search
		 * @param {string} type // Type of item to search
		 */ 
		getByRarity: function (rarity, type){
			var items = Object.values(client.config.items).filter((c) => c.RARITY == rarity)
			if(!items){
				throw new TypeError(`[WEEBCHAN] Rarity type "${rarity}" returned with no results`)
			}
			var typeSort = Object.values(items).filter((c) => c.TYPE == type)
			if(!typeSort){
				throw new TypeError(`[WEEBCHAN] Item type "${type}" returned with no results`)
			}
			return typeSort
		},
		/**
		 * Extracts the ID of a mentioned user from its raw content 
		 * @param {string} mention String to extract mention ID from
		 */
		getID: function (mention) {
			if (!mention) return;
			const matches = mention.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			const id = matches[1];
			return id;			
		},
		/**
		 * 
		 * @param {number} amount Amount of fish that the colleciton will gain
		 * @param {string} type Type of fish the amount will be added to
		 */
		addFishCollection: async function (amount, type) {
			let fishingCollection = await client.db.get(`fishingColl${message.author.id}`) || `0;0;f;0;0;f;0;0;f;0;0;f;0;0`
			fishingCollection = fishingCollection.split(`;f;`)
	
			let fishColl = fishingCollection[0]
			fishColl = fishColl.split(`;`)
			let dolphColl = fishingCollection[1]
			dolphColl = dolphColl.split(`;`)
			let sharkColl = fishingCollection[2]
			sharkColl = sharkColl.split(`;`)
			let pufferColl = fishingCollection[3]
			pufferColl = pufferColl.split(`;`)
			let tropicColl = fishingCollection[4]
			tropicColl = tropicColl.split(`;`)

			if(type == ":fish:"){
				fishColl[1] = fishColl[1] + amtGained
				if (fishColl[0] >= 10) return;
				let levelups = 0;
				let loops = 0;
				client.config.reqs.forEach((collReq) => {
					if (fishColl[1] - collReq <= 0) {
						levelups = loops + 1 - level;
					} else {
						loops += 1;
					}
				});
				for (i = 0; i < levelups; i++) {
					message.channel.send(`**DEBUGGER:** LEVELED UP COLLECTION! ${level - 1} -> ${level}`)
				};
				return;
			} else if(type == ":dolphin:"){
				dolphColl[1] = dolphColl[1] + amtGained
			} else if(type == ":shark:"){
				sharkColl[1] = sharkColl[1] + amtGained
			} else if(type == ":blowfish:"){
				pufferColl[1] = pufferColl[1] + amtGained
			} else if(type == ":tropical_fish:"){
				tropicColl[1] = tropicColl[1] + amtGained
			}
			
			await client.db.set(`fishingColl${message.author.id}`, `${fishColl.join(`;`)};f;${dolphColl.join(`;`)};f;${sharkColl.join(`;`)};f;${pufferColl.join(`;`)};f;${tropicColl.join(`;`)}`)
		},
		/**
		 * 
		 * @param {string} name
		 */
		checkItem: function (name) {
			const indx = Object.values(this.config.items).findIndex((c) => c.NAME == name)
			const vitem = Object.values(this.config.items)[indx];
			if(!vitem){
				throw new TypeError(`[WEEBCHAN] Provided item was found as undefined in the item database!`)
			}
			if(vitem.DISABLED == true){
				throw new TypeError(`[WEEBCHAN] Item is currently disabled`)
			}
			if(vitem.HIDDEN == true){
				throw new TypeError(`[WEEBCHAN] Item is currently hidden`)
			}
		},
		getInventoryString: async function (user) {
			let WINGS = await this.db.get(`WINGS${user}`) || "NONE"
			let NECKLACE = await this.db.get(`NECKLACE${user}`) || "NONE"
			let BRACELET = await this.db.get(`BRACELET${user}`) || "NONE"
			let RING = await this.db.get(`RING${user}`) || "NONE"
			let TALISMAN = await this.db.get(`TALISMAN${user}`) || "NONE;NONE;NONE;NONE;NONE"
			TALISMAN = TALISMAN.split(`;`)
			let WEAPON = await this.db.get(`WEAPON${user}`) || "NONE"
			let FISHING_ROD = await this.db.get(`FISHING_ROD${user}`) || "NONE"
			let PICKAXE = await this.db.get(`PICKAXE${user}`) || "NONE"

			let inv = []
			if(WINGS !== "NONE"){inv.push(WINGS)}
			if(NECKLACE !== "NONE"){inv.push(NECKLACE)}
			if(BRACELET !== "NONE"){inv.push(BRACELET)}
			if(RING !== "NONE"){inv.push(RING)}
			for(const i of TALISMAN){
				if(i !== "NONE"){
					inv.push(i)
				}
			}
			if(WEAPON !== "NONE"){inv.push(WEAPON)}
			if(FISHING_ROD !== "NONE"){inv.push(FISHING_ROD)}
			if(PICKAXE !== "NONE"){inv.push(PICKAXE)}
			return inv;
		},
		/**
		 * Checks if the item has the attribute of ACCOUNT_BOUND
		 * @param {string} item // String to check the item database with
		 */
		checkAccountBound: function (name){
			const indx = Object.values(this.config.items).findIndex((c) => c.NAME == name)
			const vitem = Object.values(this.config.items)[indx];
			if(!vitem){
				throw new TypeError(`[WEEBCHAN] Provided item was found as undefined in the item database!`)
			}
			if(vitem.ACCOUNT_BOUND == true){
				throw new TypeError(`[WEEBCHAN] Item contains ACCOUNT_BOUND attribute`)
			}
		},
		/**
		 * Gets the item data from the database
		 * @param {string} item // String to extract item information from
		 */
		getItem: function (item){
			const indx = Object.values(this.config.items).findIndex((c) => c.NAME == item)
			const vitem = Object.values(this.config.items)[indx];
			if(!vitem){
				throw new TypeError(`[WEEBCHAN] Provided item was found as undefined in the item database!`)
			}
			return vitem;
		},
		/**
		 * Gets the power level of a users waifu
		 * @param {string} user // User ID to get the power level of
		 */
		getPowerLevel: async function (user) {
			// Obtains the users equipped items
			let cst = await this.db.get(`cst${user}`) || ""
			cst = cst.split(`;`)
			let WINGS = await this.db.get(`WINGS${user}`)
			let NECKLACE = await this.db.get(`NECKLACE${user}`)
			let BRACELET = await this.db.get(`BRACELET${user}`)
			let RING = await this.db.get(`RING${user}`)
			let TALISMAN = await this.db.get(`TALISMAN${user}`) || "NONE;NONE;NONE;NONE;NONE"
			TALISMAN = TALISMAN.split(`;`)
			let WEAPON = await this.db.get(`WEAPON${user}`)
			let FISHING_ROD = await this.db.get(`FISHING_ROD${user}`)
			let PICKAXE = await this.db.get(`PICKAXE${user}`)
			let POWER_LEVEL = 0

			// Adds all equipped items to the array
			let ITEMS = []
			if(WINGS){ ITEMS.push(WINGS) }
			if(NECKLACE){ ITEMS.push(NECKLACE)}
			if(BRACELET){ ITEMS.push(BRACELET) }
			if(RING){ ITEMS.push(RING)}
			if(TALISMAN){for(const i of TALISMAN){ ITEMS.push(i)}}
			if(WEAPON){ITEMS.push(WEAPON)}
			if(FISHING_ROD){ITEMS.push(FISHING_ROD)}
			if(PICKAXE){ITEMS.push(PICKAXE)}

			// Determines the Power Level of the player out of all equipped items
			for(const i of ITEMS){
				const indx = Object.values(this.config.items).findIndex((c) => c.NAME == i)
				const vitem = Object.values(this.config.items)[indx];
				if(!vitem.ATTRIBUTES){
					vitem.ATTRIBUTES = {}
				}
				let plevel = `${vitem.ATTRIBUTES.POWER_LEVEL ? vitem.ATTRIBUTES.POWER_LEVEL : 0}`
				plevel = Number(plevel)
				POWER_LEVEL = POWER_LEVEL + plevel
			}
			return POWER_LEVEL;
		},
		/**
		 * 
		 * @param {string} olditem Old Item to remove power level
		 * @param {string} newitem New Item to add power level
		 * @param {string} user User to check Inventory 
		 */
		getNewPowerLevel: async function (olditem, newitem, user) {
			let power = await this.getPowerLevel(user)
			const indx = Object.values(this.config.items).findIndex((c) => c.NAME == olditem)
			const vitem = Object.values(this.config.items)[indx];
			if(!vitem){
				throw new TypeError(`[WEEBCHAN]: Provided item was found as undefined in the item database!`)
			}
			if(!vitem.ATTRIBUTES){
				vitem.ATTRIBUTES = {}
			}
			power = power - Number(`${vitem.ATTRIBUTES.POWER_LEVEL ? vitem.ATTRIBUTES.POWER_LEVEL : 0}`)
			const items = Object.values(this.config.items).findIndex((c) => c.NAME == newitem)
			const nvitem = Object.values(this.config.items)[items];
			if(!nvitem){
				throw new TypeError(`[WEEBCHAN]: Provided item was found as undefined in the item database!`)
			}
			if(!vitem.ATTRIBUTES){
				vitem.ATTRIBUTES = {}
			}
			power = power + Number(`${vitem.ATTRIBUTES.POWER_LEVEL ? vitem.ATTRIBUTES.POWER_LEVEL : 0}`)
			return power;
		},
		/**
		 * 
		 * @param {string} user 
		 * @returns 
		 */
		getBonusStats: async function (user) {
			// Obtains the users equipped items
			let cst = await this.db.get(`cst${user}`) || ""
			cst = cst.split(`;`)
			let WINGS = await this.db.get(`WINGS${user}`)
			let NECKLACE = await this.db.get(`NECKLACE${user}`)
			let BRACELET = await this.db.get(`BRACELET${user}`)
			let RING = await this.db.get(`RING${user}`)
			let TALISMAN = await this.db.get(`TALISMAN${user}`) || "NONE;NONE;NONE;NONE;NONE"
			TALISMAN = TALISMAN.split(`;`)
			let WEAPON = await this.db.get(`WEAPON${user}`)
			let FISHING_ROD = await this.db.get(`FISHING_ROD${user}`)
			let PICKAXE = await this.db.get(`PICKAXE${user}`)
			let POWER_LEVEL = 0

			// Adds all equipped items to the array
			let ITEMS = []
			if(WINGS){ ITEMS.push(WINGS) }
			if(NECKLACE){ ITEMS.push(NECKLACE)}
			if(BRACELET){ ITEMS.push(BRACELET) }
			if(RING){ ITEMS.push(RING)}
			if(TALISMAN){for(const i of TALISMAN){ ITEMS.push(i)}}
			if(WEAPON){ITEMS.push(WEAPON)}
			if(FISHING_ROD){ITEMS.push(FISHING_ROD)}
			if(PICKAXE){ITEMS.push(PICKAXE)}

			let stats = "0;0;0;0;0"
			stats = stats.split(`;`)
			stats[0] = Number(stats[0])
			stats[1] = Number(stats[1])
			stats[2] = Number(stats[2])
			stats[3] = Number(stats[3])
			stats[4] = Number(stats[4])

			for(const i of ITEMS){
				const indx = Object.values(this.config.items).findIndex((c) => c.NAME == i)
				const vitem = Object.values(this.config.items)[indx];
				if(!vitem){
					throw new TypeError(`[WEEBCHAN]: Invalid or Legacy Items Detected; Please use the migrate command to stay up to date with item changes.`)
				}
				if(vitem.ATTRIBUTES){
					if(!vitem.ATTRIBUTES.INTELLIGENCE){
					} else{
						stats[0] = stats[0] + Number(vitem.ATTRIBUTES.INTELLIGENCE)
					}
					if(!vitem.ATTRIBUTES.ENDURANCE){
					} else {
						stats[1] = stats[1] + Number(vitem.ATTRIBUTES.ENDURANCE)
					}
					if(!vitem.ATTRIBUTES.STRENGTH){
					} else {
						stats[2] = stats[2] + Number(vitem.ATTRIBUTES.STRENGTH)
					}
					if(!vitem.ATTRIBUTES.AFFECTION){
					} else {
						stats[3] = stats[3] + Number(vitem.ATTRIBUTES.AFFECTION)
					}
					if(!vitem.ATTRIBUTES.DEXTERITY){
					} else {
						stats[4] = stats[4] + Number(vitem.ATTRIBUTES.DEXTERITY)
					}
				}
			}
			stats = stats.join(`;`)
			return stats
		},
				/**
		 * 
		 * @param {string} user 
		 * @param {string} pet 
		 * @returns 
		 */
		addGhostStats: async function(user, pet){
			let bstats = await this.getBonusStats(user)
			bstats = bstats.split(`;`)
			pet = pet.split(`;`)
			let bintel = parseInt(bstats[0])
			let bendur = parseInt(bstats[1])
			let bstr = parseInt(bstats[2])
			let baffec = parseInt(bstats[3])
			let bdex = parseInt(bstats[4])

			let affec = parseInt(pet[8]);
			let intel = parseInt(pet[5]);
			let endur = parseInt(pet[6]);
			let str = parseInt(pet[7]);
			let dex = parseInt(pet[9]);

			pet[5] = intel + bintel
			pet[6] = endur + bendur
			pet[7] = str + bstr
			pet[8] = affec + baffec
			pet[9] = dex + bdex
			pet = pet.join(`;`)
			return pet
		},
		/**
		 * 
		 * @param {string} user 
		 * @param {object} pet 
		 * @returns 
		 */
		delGhostStats: async function(user, pet){
			let bstats = await this.getBonusStats(user)
			bstats = bstats.split(`;`)
			pet = pet.split(`;`)
			let bintel = Number(bstats[0])
			let bendur = Number(bstats[1])
			let bstr = Number(bstats[2])
			let baffec = Number(bstats[3])
			let bdex = Number(bstats[4])

			let affec = Number(pet[8]);
			let intel = Number(pet[5]);
			let endur = Number(pet[6]);
			let str = Number(pet[7]);
			let dex = Number(pet[9]);

			pet[5] = intel - bintel
			pet[6] = endur - bendur
			pet[7] = str - bstr
			pet[8] = affec - baffec
			pet[9] = dex - bdex
			pet = pet.join(`;`)
			return pet
		},
		/**
		 * Inserts comma to a string; acts as a thousands separator 
		 * @param {string} x String in which to insert commas.
		 */
		comma: function (x) {
			if (!x) return "0";
			if (x == "undefined") return "0";
			return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		},
		/**
		 * Applies digit trimming to a `str` instance
		 * @param {string} str String to show digits; may be NaN
		 */
		digits: function (bal) {
			if (!bal || (bal == "0")) return "0";
			bal = String(bal).toLowerCase().replace("+", "").replace("-", "");
			if (bal.includes("e")) {
				if (isNaN(bal.split("e")[1])) {
					return this.comma(bal);
				};
				let digits = Number(bal.split("e")[1]);
						digits -= 15;
				if (digits <= 0) {
					return this.comma(bal);
				};
				return `${this.comma(bal.split("e")[0].replace(".", "") + "0".repeat(20 - bal.split("e")[0].replace(".", "").length))}... [${digits} digits]`;
			} else {
				return this.comma(bal);
		}
		},
		/**
		 * This function will add hyphens to a string every X characters; view [the article type thingy](https://repl.it/talk/share/Insert-Hyphens-in-JavaScript-String/50244) for additional information.
		 * @param {string} str The string to hyphenify
		 * @param {number} interval The interval of which to add hyphens to the string 
		 * @param {object} options Options to be applied.
		 * @returns {string} String<hyphenified> Hyphenified String
		 */
		hyphen: function (str, interval, options) {
			if (!options) {
				options = {
					/**
					 * Whether or not to reomve whitespaces from the string 
					 */
					removeWhiteSpaces: true,
					/**
					 * Whether or not to inc new line
					 */
					includeNewLine: false
				};
			};
			if (typeof options !== 'object') {
				throw new TypeError("options must be of type object");
			};
			if (!str) return null;
			if (!interval) {
				interval = 1;
			};
			interval = Number(interval);
			str = str.toString();
			if (options.removeWhiteSpaces) {
				//remove whitespaces: 
				str = str.replace(/ +/g, '');
			};
			let matches;
			if (options.includeNewLine) {
				matches = str.match(new RegExp('.{1,' + interval + '}', 'gs')); 
			} else {
				matches = str.match(new RegExp('.{1,' + interval + '}', 'g')); 
			};
			if (!matches) return null;
			return matches.join('-');
		},		
		/**
		 * Calculates the cooldown and returns a mesage.
		 * @param {Date} now
		 * @param {Date} future when the "cooldown" is to be lifted
		 * @returns {String} message containing cooldown information
		 */
		cooldown: function (now, future) {
			now = Number(now);
			future = Number(future) + this.config.epoch;
			if (((now - future) / 100) >= 0) return false; 
			var d = Math.abs(now - future) / 1000;
			var r = {};
			var s = {
					years: 31536000,
					months: 2592000,
					weeks: 604800,
					days: 86400,
					hours: 3600,
					minutes: 60,
					seconds: 1
			};

			Object.keys(s).forEach(function(key){
					r[key] = Math.floor(d / s[key]);
					d -= r[key] * s[key];
			});
			r = Object.entries(r).filter((x) => x[1] > 0);
			if (r.length < 1) return false;
			function ls(arr) {
				return arr.map((elmt) => arr.indexOf(elmt) == (arr.length - 1) ? `and ${elmt}` : elmt)
			};
			return r.length >= 2 ? ls(r.map((x) => `${x[1]} ${x[1] == 1 ? x[0].slice(0, -1) : x[0]}`)).join(", ") : r.map((g) => `${g[1]} ${g[1] == 1 ? g[0].slice(0, -1) : g[0]}`).join(', ');
		},

		/**
		 * Removes the exponent ("E") on numbers expressed in scientific notation
		 * @returns Returns the number, expressed in its extended form
		 */
		noExponents: function (x) {
    var data = String(x).split(/[eE]/);
    if (data.length == 1) return data[0]; 

    let z = '';
		let sign = x < 0 ? '-' : '';
    let str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while (mag--) z += '0';
    return str + z;
		},
		/**
		 * Stuns a user whilst performing required validatory actions beforehand
		 * @param {String} id Snowflake ID of the user who must be stunned
		 * @param {Number} amt amount of minutes which the user must be stunned
		 */
		stn: async function (id, amt, client) {
			let user = await client.users.fetch(id)
				.catch((x) => {});
			if (!user) return false;
			let dns = await client.db.get("dns" + id);
					dns = isNaN(dns) ? 0 : Number(dns);
					dns = dns + client.config.epoch;
			if (dns && (Date.now() < dns)) return;
			let ms = amt * 60 * 1000; 
			await client.db.set("stn" + id, (Date.now() + ms) - 1580218249992);
			return true;
		},
		scd: function (last, cdAmt, now) {
			last = Number(last);
			last = last + 1580218249992;
			const expirationTime = last + cdAmt;
			if (now < expirationTime) {
				let s = (expirationTime - now) / 1000;
				return Math.trunc(s) == 0 ? 1 : Math.trunc(s);
			} else {
				return;
			};
		},
		wpnd: function (data) {
			//"type;tier;used;stunr;stnv;xp;parts;dur;blm"
			data = Array.isArray(data) ? data : data.split(";");
			//sniper allows you to target specific items
			let types = ["Pistol", "Supressed Pistol", "Rifle", "Sniper"]
			return {
				"type": types[data[0]],
				"tier": "✪".repeat(data[1]),
				"used": data[2],//used x times
				"stunrange": [data[3].split("-")[0], data[3].split("-")[1]],//data[2] - 10 minutes stun range
				"stnv": data[4],
				"xp": data[5],
				"nextLevel": Number(data[1]) * 5000,
				"parts": data[6],
				"durability": data[7],//uses: data[3]*1000
				"blm": data[8]
			}
		},
		text2Binary: function(string) {
			return string.split("").map((char) => {
					return char.charCodeAt(0).toString(2);
			}).join(" ");
		},
		dm: async function (client, opts) {
			// client<client>
			// opts { id: ID, message: "", clr : "" }
			let user = await client.users.fetch(opts.id);
			let em = new MessageEmbed()
							.setColor(opts.color)
							.setDescription(`${opts.message}`)
			if(opts.thumbnail){
				em.setThumbnail(`${opts.thumbnail}`)
			}
			if(opts.title){
				em.setTitle(`${opts.title}`)
			}
			let cst = await client.db.get("cst" + user.id) || "";
					cst = cst.split(";");
			if (!cst.includes("dnd")) {
				const channel = client.users.cache.get(user.id)
				channel.send({embeds: [em]}).catch((e) => {});
			};
			const sendmsg = client.channels.cache.get(opts.send)
			sendmsg.send({ embeds: [em] })
		}
	},
	config: {
		maxedPet: '9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999;9999999999',
		inv: "https://discord.com/oauth2/authorize?client_id=861209428066172939&scope=bot&permissions=314369",
		prefix: ";",
		upgr: [ "int;intellect;5", "end;endurance;6", "str;strength;7", "dex;dexterity;9" ],
		epoch: 1580218249992,
		defaultHexColor: "#00aaaa",
		ssInvite: "https://discord.gg/4vywAnZDXT",
		supportServer: "808086568815558687",//ID 
		goodFriends: [""],
		upgr: [ "int;intellect;5", "end;endurance;6", "str;strength;7", "dex;dexterity;9" ],
		owner: '216749228087705610',
		x: 1594726151239,//last time rules were updated
		reqs: [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600, 209715200, 419430400, 838860800, 1677721600, 3355443200, 6710886400, 13421772800, 26843545600, 53687091200, 107374182400, 214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800, 109951162777600, 219902325555200, 439804651110400, 879609302220800, 1759218604441600, 3518437208883200, 7036874417766400, 14073748835532800, 28147497671065600, 56294995342131200, 112589990684262400, 225179981368524800, 450359962737049600],    
		maxLvl: 50,
		blacklistedtags: [`loli`, `lolicon`, `shota`, `shotacon`, `vore`, `gore`, `underage`, `oppai loli`],
		guildserver: "742257076637794344",
		version: "v0.6.0",
		footerIMG: "https://i.gyazo.com/3880bccf289a05334caafb3104437d54.jpg",
		illegalCharCmds: ["waifualias", "lootbox", "8ball", "addreplacer", "viewreplacer", "removereplacer"],
    boostPay: 5000,
	thumbnail: {
		error: "https://cdn.discordapp.com/attachments/862044784687972383/901281941184204800/Illustration14.png",
		scroll: "https://cdn.discordapp.com/attachments/862044784687972383/901291868288086096/Illustration18.png",
		banhammer: "https://cdn.discordapp.com/attachments/862044784687972383/915387028588359690/Illustration44.png",
		amaze: "https://cdn.discordapp.com/attachments/862044784687972383/901269210548830279/Illustration13.png",
		question: "https://cdn.discordapp.com/attachments/862044784687972383/901274845302624256/Illustration11.png",
		thumbsup: "https://cdn.discordapp.com/attachments/862044784687972383/901301722817912882/Illustration21.png",
		kiss: "https://cdn.discordapp.com/attachments/756814298906361918/901305158019985449/Untitled_Artwork.png",
		lewd: "https://cdn.discordapp.com/attachments/862044784687972383/915387061098409984/Illustration45.png",
		pout: "https://cdn.discordapp.com/attachments/862044784687972383/915386987769393202/Illustration42.png",
		wave: "https://cdn.discordapp.com/attachments/862044784687972383/915387091607748648/Illustration46.png",
		mad: "https://cdn.discordapp.com/attachments/862044784687972383/915387128521850890/Illustration43.png",
		fuckyou: "https://cdn.discordapp.com/attachments/862044784687972383/915387167851814942/Illustration37.png",
		suprise: "https://cdn.discordapp.com/attachments/862044784687972383/915390236983451689/Illustration47.png",
		cool: "https://cdn.discordapp.com/attachments/862044784687972383/915386930416455760/Illustration5.png",
		pat: "https://cdn.discordapp.com/attachments/798670292573618238/919737079150313492/iu9r8_1.png",
		fish: "https://cdn.discordapp.com/attachments/862044784687972383/946914467856412672/Illustration.png",
		cooldown: "https://cdn.discordapp.com/attachments/862044784687972383/947255664298823760/Illustration5giugk.png",
	},
		channels: {
			transactions: "808123384381964328",
			spamCat: "808123328081821696",
			appNotifs: "808123385568559144",
			appCat: "808123329058701362",
			bug: '808123386169524256',
			general: "808123360655573022",
			ready: "808123387426766898",
			reconnecting: "806835322537115648",
			error: "808123388333785138",
			rateLimit: "808123390346133564",
			guildLogs: "808123391223005214",
			memberLog: "808123392054132757",
			modlog: "808123376912171090",
			set: "808123393936195674",
			suggestions: '808123394616197141',
			msgLogs: "808123378094702663",
			boostAnnCh: "808146919946715137",
			bugLog: "808123395581542411",
			cmdLog: "808123396625137684",
			weebgen: "756814298906361918",
			captchalog: "914583750447341609"
			
		},
		roles: {
			SERVER_BOOSTER: "808322101927870504",
			applicant: "808123276860981268",
			judge: '808123278983561246',
			businessman: "808123277943111680",
			updates: '808123279923347476',
      boostRole: "7808143818544250891",
			db: "808123280988176384",
			nerd: "808123281852203038",
			civilian: "808123282586599434",
			admin: "808123264136249395",
			mod: { trial: "808123266677080084", normal: "808123265947926578" },
			rebel: "808123283353632778",
			sarg: "806836572904620043",
			staff: "808123284670382081",
			cit: "808123285916221530",
    	blacklistedRole: "808123288131469322",
			col: "808123286982361138", //add col to list
			supreme: "808123288991170591",
			warrior: "808123289595019275",
			human: "808123273451143168",
			memberRole: "808123273451143168",
			muted: '808123318557081661',
			civ: '808123282586599434',
			botDeveloper: "808123275698765835",
			srmod: "808123264789381162",
			coolkid: "808123290215907402",
			booster: "808143818544250891",
			giveawayping: "808123310810333214",
			verified: "828479150771535882",
			// PATREON
			trainee: "834843067244347403",
			adventurer: "834843070067507211",
			sensei: "834843070063050833",
		},
		/**
		 * All the emojis which are to be used by the client 
		 */
		emoji: {
			tick: '<:tick:806864873517613088>',
			err: '<:red:806861801458892860>',
			mobile_phone: '<:phone:838628172509347860>',
			phonebook: '<:Book:818839047400456223>',
			chill: '<:PotionOfDarkness:818822983165542451>',
			loading: "<a:Loading:881604196544151594>",
			target: "<:target:800399225488932864>",
			heart: "<a:WaifuHealth:830172018443026523>",
			waifuamaze: "<:amaze:773417043927105537>",
			pickaxe: ":pick:",
			stone: "<:stone:807189793050067005>",
			waifu: "<:WeebChan:832363728690741298>",
			sadge: "<:cry:798006260020412439>",
			coin: "<:coin:889957389535694898>",
			rainbowdance: "<a:RainbowDance:790461343898533909>",
			permit: "<:permit:818839060965097492>",
			rainbow: "<a:rainbow:818841627636400128>",
			vault: "<:bankvault:818843550892032072>",
			package: "<:pkg:819089158399066122>",
			patreon: "<:Patreon:835036598792880148>",
			sake: "<:Sake:819097578376659014>",
			/*
			EMOTES FOR BADGE REWARDS
			*/
			testbadge1: "<a:RainbowDance:790461343898533909>",
			bcmd: "<:bcmd:817541167004123156>",
			staff: "<:staff:817619613113909258>",
			booster: "<a:booster:817541153288749107>",

			// ACHIEVEMENTS
			nekolover: "<:nekohug:829772207797305374>",
			// HUNTER BADGES
			waifuhunter: "<a:SenkoEnergy:823126824955412501>",
			BUG_HUNTER_RANK: "<:BUG_HUNTER_RANK:926240397989117992>",
			/*
			EMOTES FOR PICKAXE TIERS
			*/
			t1pickaxe: "<:t1pickaxe:818814600010793000>",
			t2pickaxe: "<:t2pickaxe:818814908291612672>",
			t3pickaxe: "<:t3pickaxe:818814922095853578>",
			t4pickaxe: "<:t4pickaxe:818814937324453907>",
			t5pickaxe: "<:t5pickaxe:818815016560099328>",
			t6pickaxe: "<:t6pickaxe:818815029944123422>",
			/*
			NEW ORE EMOTES
			*/
			t1ore: "<:t1ore:818816277887713290>",
			t2ore: "<:t2ore:818816291049308161>",
			t3ore: "<:t3ore:818816305452417075>",
			t4ore: "<:t4ore:818816319410667520>",
			t5ore: "<:t5ore:818816332401344522>",

			t1rod: "<:t1rod:818838230220537896>",
			/*
			POTION EMOTES
			*/
			phaste: "<:potionofhaste:818960960949714976>",
			lhealth: "<:Lesser_Healing_Potion:820901903319433267>",
			health: "<:Healing_Potion:820901914459635712>",
			ghealth: "<:Greater_Healing_Potion:820901927898447892>",
			pmystery: "<:Potion_of_Mystery:822352150653829121>",
			DREAM_CATCHER_POTION: "<:DREAM_CATCHER_POTION:892589577179631636>",
			/*
			CONSUMABLES
			*/
			STAT_MODIFIER_ONE: ":arrow_backward:",
			STAT_MODIFIER_ALL: ":rewind:",
			/*
			INVENTORY ITEMS
			*/
			darkness: "<:WingsOfDarkness:827023418602815508>",
			darkness2: "<:WingsOfDarkness2:827023408281550858>",

			NEKO_EARS: "<:NEKO_EARS:851647986647564298>",
			TAMER_TALISMAN: "<a:TAMER_TALISMAN:858709891698655293>",
			TAMER_RELIC: "<a:TAMER_RELIC:858720345136955432>",
			/*
			TALISMAN
			*/
			BEACHBALL_TALISMAN: "<:BEACHBALL_TALISMAN:847575048625061979>",
			CANDYCORN_TALISMAN: "<:CANDYCORN_TALISMAN:892587498537123880>",
			/*
			WEAPONS
			*/
			plasmacannon: "<:Orbital_Cannon:827387338917281803>",
			plasmaammo: "<:Plasma_Ammo:827392594883510332>",
						/*
			LOOTBOXES
			*/
			solar: "<:SolarChest:844055985379475476>",
			summer: "<:SummerBox:844411450940325929>",
						/*
			CUSTOM EMOTES
			*/
			weebsip: "<:weebsip:861423264526237706>",
			sleep: "<a:sleep:884240374497943553>"

			// ITEMS


		},
		colors: {
			green: '#4bc46b',
			red: '#f56c6c',
			invisible: "#36393e",
			common: "#4cbb17",
			uncommon: "#4CBB17",
			rare: "#07b7c2",
			item: "#ff00ff",
			artifact: "#fff68f",
			relic: "#990000",
			poseffect: "#089415",
			negeffect: "#ff7373",
		},
		ofncs: {
			"1": [ "Spam", 1 ],
			"2": [ "Excessive Mentions", 1 ],
			"3": [ "Begging", 1 ],
			"4": [ "Impersonating Staff", 1 ],
			"5": [ "Discrimination", 1 ],
			"6": [ "Advertising", 3 ],
			"7": [ "NSFW", 2 ],
			"8": [ "Threats", 2 ],
			"9": [ "Joking about Mental Illnesses (or any other disability)", 3 ],
			"10": [ "Disrespecting Privacy", 3 ],
			"11": [ "Exploiting Glitches", 3 ],
			"12": [ "Bypassing Punishments via the means of alts", 3 ],
			"13": [ "Leaving server to evade punishments (before punished; not after)", 3 ],
			"14": [ "Excessively Rude", 1 ]
		},
		entities:  {
			// IMMORTAL OBJECTS
			WEEBCHAN: {
				NAME: "WEEBCHAN",
				NAME_PROPER: "Weebchan",
				TYPE: "IMMORTAL ENTITY",
				DIFFICULTY: "DEATH WISH",
				DESCRIPTION: "Just your average catgirl",
				ATTRIBUTES: {
					LEVEL: "999999",
					HEALTH: "∞",
					STRENGTH: "∞",
					INTELLIGENCE: "∞",
					IMMORTAL: true,
					INSTANT_DEATH: true,
					DOUBLE_DAMAGE: true,
					WEAPON: "WEEBCHANS_EXCALIBUR"
				},
			},
			SEMIMUTE: {
				NAME: "SEMIMUTE",
				NAME_PROPER: "SemiMute",
				TYPE: "IMMORTAL ENTITY",
				DIFFICULTY: "DEATH WISH",
				DESCRIPTION: "Game Master of the realm",
				ATTRIBUTES: {
					LEVEL: "999999",
					HEALTH: "∞",
					STRENGTH: "9999999",
					INTELLIGENCE: "999999",
					IMMORTAL: true,
					INSTANT_DEATH: false,
					DOUBLE_DAMAGE: true,
					WEAPON: "WEEBCHANS_EXCALIBUR"
				}
			},
			// 
			ANCIENT_MINION_MAGE: {
				NAME: "ANCIENT_MINION_MAGE",
				NAME_PROPER: "Ancient Minion Mage",
				TYPE: "ENTITY",
				DIFFICULTY: "DIFFICULT",
				DESCRIPTION: "ᔑ ᒲ╎リ╎𝙹リ ℸ ̣ ⍑ᔑℸ ̣  ᓭᒷ∷⍊ᒷᓭ ℸ ̣ ⍑ᒷ ᔑリᓵ╎ᒷリℸ ̣  𝙹リᒷᓭ",
				ATTRIBUTES: {
					LEVEL: "10",
					HEALTH: "10000",
					STRENGTH: "5",
					INTELLIGENCE: "15",
					IMMORTAL: false,
					INSTANT_DEATH: false,
					DOUBLE_DAMAGE: false,
					REGENERATION: true,
					WEAPON: "NONE"
				},
			},
		},
		items: {
			// PLACEHOLDER ITEM
			NONE: {
				NAME: "NONE",
				NAME_PROPER: "NONE",
				RARITY: "GHOST_ITEM",
				TYPE: "UNIVERSAL",
				DESCRIPTION: "Nothing to see here :eyes:",
				USAGE: "Placeholder inventory item",
				ADDED: "v0.6.0",
				EMOJI: "INVALID",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			//
			// WINGS
			// RARITY: UNCOMMON
			//
			WINGS_OF_DARKNESS: {
				NAME: "WINGS_OF_DARKNESS",
				NAME_PROPER: "Wings of Darkness",
				RARITY: "UNCOMMON",
				TYPE: "WINGS",
				DESCRIPTION: "The essence of darkness itself",
				USAGE: "Boosts the amount of ores gained whilst mining",
				ADDED: "v0.2.0",
				EMOJI: "<:WingsOfDarkness:827023418602815508>",
				COST: "45000",
				REQUIREMENT: "PLAYER_PURCHASED_WINGS_OF_DARKNESS",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				}
			},
			//
			// WINGS
			// RARITY: RARE
			//
			WINGS_OF_THE_VOID: {
				NAME: "WINGS_OF_THE_VOID",
				NAME_PROPER: "Wings of the Void",
				RARITY: "RARE",
				TYPE: "WINGS",
				DESCRIPTION: "Forged from the depths of the void",
				USAGE: "Boosts the amount of ores gained whilst mining",
				ADDED: "v0.2.0",
				EMOJI: "<:WingsOfDarkness2:827023408281550858>",
				COST: "Forge Upgraded",
				REQUIREMENT: "PLAYER_UPGRADED_WINGS_OF_DARKNESS",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				}
			},
			// 
			// NECKLACE
			// RARITY: RARE
			//
			PINK_PENDANT: {
				NAME: "PINK_PENDANT",
				NAME_PROPER: "Pink Pendant",
				RARITY: "RARE",
				TYPE: "NECKLACE",
				DESCRIPTION: "I feel a strange pull towards it",
				USAGE: "Gain more affection on dates with your waifu",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Artifact rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				}
			},
			//
			//	NECKLACE
			//	RARITY: MYTHIC
			//
			SHARK_TOOTH: {
				NAME: "SHARK_TOOTH",
				NAME_PROPER: "Shark Tooth",
				RARITY: "MYTHIC",
				TYPE: "NECKLACE",
				DESCRIPTION: "This will scare the fishes into submission",
				USAGE: "Income from common fishing drops is doubled",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Item rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				}
			},
			//
			//	NECKLACE
			//	RARITY: LEGENDARY
			//
			FORTUNAS_BLESSING: {
				NAME: "FORTUNAS_BLESSING",
				NAME_PROPER: "Fortunas' Blessing",
				RARITY: "LEGENDARY",
				TYPE: "NECKLACE",
				DESCRIPTION: "A Relic from ancient times that brings wealth and prosperity",
				USAGE: "Income from fishing drops is multiplied by 1.5x",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Relic rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				}
			},
			//
			// BRACELET
			// RARITY: LEGENDARY
			//
			ARTIFACT_OF_TIME: {
				NAME: "ARTIFACT_OF_TIME",
				NAME_PROPER: "Artifact of Time",
				RARITY: "LEGENDARY",
				TYPE: "BRACELET",
				DESCRIPTION: "An ancient artifact lost at sea with the power to bend time to benefit the wielder",
				USAGE: "Reduces some cooldowns by 1/4",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Artifact rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				}
			},
			//
			// RING
			// RARITY: RARE
			//
			RING_OF_TRANSFORMATION: {
				NAME: "RING_OF_TRANSFORMATION",
				NAME_PROPER: "Ring of Transformation",
				RARITY: "RARE",
				TYPE: "RING",
				DESCRIPTION: "Rumored to turn Lead into Gold but not quite that effective",
				USAGE: "Catching trash now gives a small coin bonus",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Item rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			//
			// RING
			// RARITY: MYTHIC
			//
			HEALING_RING: {
				NAME: "HEALING_RING",
				NAME_PROPER: "Ring of Healing",
				RARITY: "MYTHIC",
				TYPE: "RING",
				DESCRIPTION: "I can use one of these the next time a shark bites off my head",
				USAGE: "Has a 50% to negate all negative status effects from fishing",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Artifact rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			//
			// RING
			// RARITY: LEGENDARY
			//
			KING_MIDAS_RING: {
				NAME: "KING_MIDAS_RING",
				NAME_PROPER: "King Midas' Ring",
				RARITY: "LEGENDARY",
				TYPE: "RING",
				DESCRIPTION: "UNKNOWN",
				USAGE: "Grants the **Midas' Touch** waifu ability",
				ADDED: "UNKNOWN",
				EMOJI: "UNKNOWN",
				COST: "UNKNOWN",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				},
			},
			//
			// TALISMAN
			// RARITY: RARE
			//
			TAMER_TALISMAN: {
				NAME: "TAMER_TALISMAN",
				NAME_PROPER: "Tamer Talisman",
				RARITY: "RARE",
				TYPE: "TALISMAN",
				DESCRIPTION: "Your connection with your waifu will strengthen with this!",
				USAGE: "Grants a bonus to waifu experience gain",
				ADDED: "v0.4.0",
				EMOJI: "<a:TAMER_TALISMAN:858709891698655293>",
				COST: "RNG from training",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			CAPSULE_OF_FORGOTTEN_MEMORIES: {
				NAME: "CAPSULE_OF_FORGOTTEN_MEMORIES",
				NAME_PROPER: "Capsule of Forgotten Memories",
				RARITY: "RARE",
				TYPE: "TALISMAN",
				DESCRIPTION: "Blissful memories trapped for all of time",
				USAGE: "Stroking your waifu gives bonus affection",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Item rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			//
			// TALISMAN
			// RARITY: MYTHIC
			//
			TAMER_RELIC: {
				NAME: "TAMER_RELIC",
				NAME_PROPER: "Tamer Relic",
				RARITY: "MYTHIC",
				TYPE: "TALISMAN",
				DESCRIPTION: "A more refined tamer talisman...",
				USAGE: "Grants a bonus to waifu experience gain",
				ADDED: "v0.4.0",
				EMOJI: "<a:TAMER_RELIC:858720345136955432>",
				COST: "RNG from training",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			CHARM_OF_THE_DEEP: {
				NAME: "CHARM_OF_THE_DEEP",
				NAME_PROPER: "Charm of the Deep",
				RARITY: "MYTHIC",
				TYPE: "TALISMAN",
				DESCRIPTION: "An ancient sigil emblazoned with the symbol of a Kraken",
				USAGE: "Negates the ability to fish trash rarity items",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Relic rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			//
			// TALISMAN
			// RARITY: LEGENDARY
			//
			BEACHBALL_TALISMAN: {
				NAME: "BEACHBALL_TALISMAN",
				NAME_PROPER: "Beachball Talisman",
				RARITY: "LEGENDARY",
				TYPE: "TALISMAN",
				DESCRIPTION: "Part of the Summer 2021 update",
				USAGE: "Boosts the amount of coins when stealing from waifus",
				ADDED: "v0.3.2",
				EMOJI: "<:BEACHBALL_TALISMAN:847575048625061979>",
				COST: "RNG from Summer Lootbox",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "5"
				},
			},
			//
			// TALISMAN
			// RARITY: SPECIAL
			//
			COINFLIP_TALISMAN: {
				NAME: "COINFLIP_TALISMAN",
				NAME_PROPER: "Coinflip Talisman",
				RARITY: "SPECIAL",
				TYPE: "TALISMAN",
				DESCRIPTION: "Only the masters of RNG hold this talisman",
				USAGE: "Grants an unfair advantages with coinflipping",
				ADDED: "UNRELEASED",
				EMOJI: "<:coin:889957389535694898>",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			WEEBCHANS_EXP_TALISMAN: {
				NAME: "WEEBCHANS_EXP_TALISMAN",
				NAME_PROPER: "Weebchan's EXP Talisman",
				RARITY: "SPECIAL",
				TYPE: "TALISMAN",
				DESCRIPTION: "Gain considerable favor with Weebchan",
				USAGE: "Grants an unfair advantage with server levels",
				ADDED: "UNKNOWN",
				EMOJI: "UNKNOWN",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			WEEBCHANS_POWER_SUPRESSOR: {
				NAME: "WEEBCHANS_POWER_SUPRESSOR",
				NAME_PROPER: "Weebchan's Power Supressor",
				RARITY: "SPECIAL",
				TYPE: "TALISMAN",
				DESCRIPTION: "Train with Weebchan to deal with massive amounts of power",
				USAGE: "Grants the ability to equip any item regardless of power level cap",
				ADDED: "UNKNOWN",
				EMOJI: "UNKNOWN",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "-999999999999"
				},
				ACCOUNT_BOUND: true,
			},
			WEEBCHANS_STAT_AMPLIFIER: {
				NAME: "WEEBCHANS_STAT_AMPLIFIER",
				NAME_PROPER: "Weebchan's Stat Amplifier",
				RARITY: "SPECIAL",
				TYPE: "TALISMAN",
				DESCRIPTION: "An ancient relic that makes a waifu have godly powers",
				USAGE: "Grants waifu massive amounts of powers",
				ADDED: "UNKNOWN",
				EMOJI: "UNKNOWN",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "-100",
					INTELLIGENCE: "999999999",
					ENDURANCE: "999999999",
					STRENGTH: "999999999",
					AFFECTION: "999999999",
					DEXTERITY: "999999999"
				},
				ACCOUNT_BOUND: true,
			},
			WEEBCHANS_EXCALIBUR: {
				NAME: "WEEBCHANS_EXCALIBUR",
				NAME_PROPER: "Weebchan's Excalibur",
				RARITY: "SPECIAL",
				TYPE: "WEAPON",
				DESCRIPTION: "Weebchan's legendary sword that is told to bring peace to her realm. Inscribed on its blade is: ꖌᒷᒷ!¡ᒷ∷ 𝙹⎓ ℸ ̣ ⍑ᒷ !¡ᒷᔑᓵᒷ, ᒲᔑꖌᒷ∷ 𝙹⎓ ℸ ̣ ⍑ᒷ ∴𝙹∷ꖎ↸",
				USAGE: "Grants the powers of Weebchan herself",
				ADDED: "v0.7.0",
				EMOJI: "UNKNOWN",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "-100",
					DOUBLE_STRIKE: true,
					INSTANT_DEATH: true,
					INTELLIGENCE: "999999999",
					ENDURANCE: "999999999",
					STRENGTH: "999999999",
					AFFECTION: "999999999",
					DEXTERITY: "999999999"
				},
				ACCOUNT_BOUND: true,
			},
			DEVELOPER_RING: {
				NAME: "DEVELOPER_RING",
				NAME_PROPER: "Developer Ring",
				RARITY: "SPECIAL",
				TYPE: "TALISMAN",
				DESCRIPTION: "*The most skilled blacksmiths worked on this ring, bringing wealth and prosperity to their countries*",
				USAGE: "Grants unfair advantages occasionally",
				ADDED: "v0.1.0",
				EMOJI: ":ring:",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			//
			// SPECIAL TYPE
			// RARITY: SPECIAL
 			//
			NEKO_EARS: {
				NAME: "NEKO_EARS",
				NAME_PROPER: "Neko Ears",
				RARITY: "SPECIAL",
				TYPE: "SPECIAL",
				DESCRIPTION: "Channels your inner catgirl instincts",
				USAGE: "COLLECTIBLE",
				ADDED: "UNRELEASED",
				EMOJI: "<:NEKO_EARS:851647986647564298>",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_WAIFU_ALIAS_NEKO",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			CREATIVE_HUNTER: {
				NAME: "CREATIVE_HUNTER",
				NAME_PROPER: "Creative Hunter",
				RARITY: "SPECIAL",
				TYPE: "SPECIAL",
				DESCRIPTION: "A masterpiece.... Truely a magnificent artwork",
				USAGE: "COLLECTIBLE",
				ADDED: "UNKNOWN",
				EMOJI: ":bulb:",
				COST: "A creative idea....",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			CAT_EARS: {
				NAME: "CAT_EARS",
				NAME_PROPER: "Cat Ears",
				RARITY: "SPECIAL",
				TYPE: "SPECIAL",
				DESCRIPTION: "A pair of cat ears… I wonder who these belonged to",
				USAGE: "COLLECTIBLE",
				ADDED: "v0.6.0",
				EMOJI: "NONE",
				COST: "Relic rarity fishing loot",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
			},
			BIRTHDAY_CAKE_1: {
				NAME: "BIRTHDAY_CAKE_1",
				NAME_PROPER: "Weebchan's Chocolate Cake",
				RARITY: "SPECIAL",
				TYPE: "SPECIAL",
				DESCRIPTION: "1st Edition of Weebchan's Birthday Cake",
				USAGE: "COLLECTIBLE",
				ADDED: "Weebchan's First Birthday",
				EMOJI: "<:BIRTHDAY_CAKE_1:931703185343660032>",
				COST: "UNKNOWN",
				REQUIREMENT: "PLAYER_CLAIMED_BIRTHDAY_1",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},
			//
			// FISHING_ROD
			// RARITY: COMMON
			//
			BASIC_FISHING_ROD: {
				NAME: "BASIC_FISHING_ROD",
				NAME_PROPER: "Basic Fishing Rod",
				RARITY: "COMMON",
				TYPE: "FISHING_ROD",
				DESCRIPTION: "A basic pole with some string on it",
				ADDED: "v0.0.0",
				EMOJI: "<:t1rod:818838230220537896>",
				COST: "UNKNOWN",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "6"
				},
				COOLDOWN: "5",
				LUCK: "0",
				DURABILITY: "0",
				ACCOUNT_BOUND: true
			},
			//
			// FISHING_ROD
			// RARITY: RARE
			//
			FANCY_FISHING_ROD: {
				NAME: "FANCY_FISHING_ROD",
				NAME_PROPER: "Fancy Fishing Rod",
				RARITY: "RARE",
				TYPE: "FISHING_ROD",
				DESCRIPTION: "A fishing rod with a bit of style",
				USAGE: "It's a fishing rod... you fish with it...",
				ADDED: "v0.6.0",
				EMOJI: "<:FANCY_FISHING_ROD:918708638003122178>",
				COST: "UNKNOWN",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "8"
				},
				COOLDOWN: "4",
			},
			//
			// FISHING_ROD
			// RARITY: MYTHIC
			//
			FIBERGLASS_FISHING_ROD: {
				NAME: "FIBERGLASS_FISHING_ROD",
				NAME_PROPER: "Fiberglass Fishing Rod",
				RARITY: "MYTHIC",
				TYPE: "FISHING_ROD",
				DESCRIPTION: "A metallic-looking fishing rod that appears to bend in impossible ways",
				USAGE: "It's a fishing rod... you fish with it...",
				ADDED: "v0.6.0",
				EMOJI: "<:FIBERGLASS_FISHING_ROD:918708651030626356>",
				COST: "UNKNOWN",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "10"
				},
				COOLDOWN: "3",
			},
			//
			// FISHING_ROD
			// RARITY: LEGENDARY
			//
			RAPIDS_FISHING_ROD: {
				NAME: "RAPIDS_FISHING_ROD",
				NAME_PROPER: "Rod of the Rapids",
				RARITY: "LEGENDARY",
				TYPE: "FISHING_ROD",
				DESCRIPTION: "The very essence of the waters",
				USAGE: "It's a fishing rod... you fish with it...",
				ADDED: "v0.6.0",
				EMOJI: "<:RAPIDS_FISHING_ROD:918708622781992960> ",
				COST: "UNKNOWN",
				REQUIREMENT: "NONE",
				ATTRIBUTES: {
					POWER_LEVEL: "12"
				},
				COOLDOWN: "1",
			},
			//
			// FISHING_ROD
			// RARITY: SPECIAL
			//
			WEEBCHANS_FISHING_ROD: {
				NAME: "WEEBCHANS_FISHING_ROD",
				NAME_PROPER: "Weebchan's Fishing Rod",
				RARITY: "SPECIAL",
				TYPE: "FISHING_ROD",
				DESCRIPTION: "Some say this fishing rod is an ancient relic of the past, granting power beyond ones comprehension",
				USAGE: "Gives an unfair advantage with fishing",
				ADDED: "v0.6.0",
				EMOJI: "<:WEEBCHANS_FISHING_ROD:918708728256143380>",
				COST: "UNOBTAINABLE",
				REQUIREMENT: "PLAYER_BOT_DEVELOPER",
				COOLDOWN: "0",
				ATTRIBUTES: {
					POWER_LEVEL: "0"
				},
				ACCOUNT_BOUND: true,
			},

		},
		fisheffects: {
			NONE: {
				ID: "NONE",
				NAME: "No Effect",
				DESCRIPTION: "If only I had a fishing effect...",
				RARITY: "INVALID",
				USAGE: "Does literally nothing..",
			},
			GOLDEN_WORM: {
				ID: "GOLDEN_WORM",
				NAME: "Golden Worm",
				DESCRIPTION: "This looks tasty... maybe I'll try it",
				RARITY: "POSITIVE",
				USAGE: "Negates fishing cooldown",
			},
			LUCKY_CHARM: {
				ID: "LUCKY_CHARM",
				NAME: "Lucky Charm",
				DESCRIPTION: "How on earth did I catch cereal?",
				RARITY: "POSITIVE",
				USAGE: "Doubles coin earnings",
			},
			BLACK_ROCK: {
				ID: "BLACK_ROCK",
				NAME: "Black Rock",
				DESCRIPTION: "This looks ominous",
				RARITY: "POSITIVE",
				USAGE: "Removes the ability to catch common or lower",
			},
			SEAFOAM_SOUP: {
				ID: "SEAFOAM_SOUP",
				NAME: "Seafoam Soup",
				DESCRIPTION: "This looks tasty… maybe I’ll try it",
				RARITY: "NEGATIVE",
				USAGE: "Gives you a 30% chance for the fish to escape",
			},
			POISONOUS_PUFFERFISH: {
				ID: "POISONOUS_PUFFERFISH",
				NAME: "Poisonous Pufferfish",
				DESCRIPTION: "I hear this is a delicacy In Japan",
				RARITY: "NEGATIVE",
				USAGE: "Gives you a sickness that lasts 10 minutes",
			},
			BLACK_ROCK2: {
				ID: "BLACK_ROCK2",
				NAME: "Black Rock",
				DESCRIPTION: "This looks ominous",
				RARITY: "NEGATIVE",
				USAGE: "You can only catch garbage on your next trip",
			},
		},
		fishloot: {
			// TRASH TIER
			SEAWEED: {
				ID: "SEAWEED",
				NAME: "Seaweed",
				DESCRIPTION: "Why would I want this again",
				RARITY: "TRASH",
				WORTH: "0",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			OLD_WALKING_CANE: {
				ID: "OLD_WALKING_CANE",
				NAME: "Old Walking Cane",
				DESCRIPTION: "This must be what Moses used to cross the Red Sea… or not",
				RARITY: "TRASH",
				WORTH: "0",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			MAP_IN_A_BOTTLE: {
				ID: "MAP_IN_A_BOTTLE",
				NAME: "Map in a Bottle",
				DESCRIPTION: "Welp… the bottle wasn’t insulated",
				RARITY: "TRASH",
				WORTH: "0",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			HAIR: {
				ID: "HAIR",
				NAME: "Hair",
				DESCRIPTION: "This isn't even catgirl hair...",
				RARITY: "TRASH",
				WORTH: "0",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			COAL: {
				ID: "COAL",
				NAME: "Coal",
				DESCRIPTION: "All I want for Christmas… is you",
				RARITY: "TRASH",
				WORTH: "0",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			// COMMON TIER
			TUNA: {
				ID: "TUNA",
				NAME: "Tuna",
				DESCRIPTION: "My catgirl will like this",
				RARITY: "COMMON",
				WORTH: "18",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			SALMON: {
				ID: "SALMON",
				NAME: "Salmon",
				DESCRIPTION: "Better hide this before the bears come",
				RARITY: "COMMON",
				WORTH: "17",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			A_FISH: {
				ID: "A_FISH",
				NAME: "A fish",
				DESCRIPTION: "Why is this item so indescriptive… must be lazy devs",
				RARITY: "COMMON",
				WORTH: "14",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			PIKE: {
				ID: "PIKE",
				NAME: "Pike",
				DESCRIPTION: "“Which came first, the fish or the weapon",
				RARITY: "COMMON",
				WORTH: "12",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			// RARE
			SWORDFISH: {
				ID: "SWORDFISH",
				NAME: "Swordfish",
				DESCRIPTION: "This will make a great weapon… oh wait it’s a fish",
				RARITY: "RARE",
				WORTH: "19",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			BLOBFISH: {
				ID: "BLOBFISH",
				NAME: "Blobfish",
				DESCRIPTION: "Why is it... so ugly",
				RARITY: "RARE",
				WORTH: "22",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			IRON_NUGGET: {
				ID: "IRON_NUGGET",
				NAME: "Iron Nugget",
				DESCRIPTION: "Maybe I can find a use for this",
				RARITY: "RARE",
				WORTH: "25",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			ANCHOR: {
				ID: "ANCHOR",
				NAME: "Anchor",
				DESCRIPTION: "Someone will be pissed when they can’t find their boat tomorrow",
				RARITY: "RARE",
				WORTH: "28",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			CONCH_SHELL: {
				ID: "CONCH_SHELL",
				NAME: "Conch Shell",
				DESCRIPTION: "I can scam an orphan with this. Nice.",
				RARITY: "RARE",
				WORTH: "24",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			// ITEM
			FANCY_FISHING_ROD: {
				ID: "FANCY_FISHING_ROD",
				NAME: "Fancy Fishing Rod",
				DESCRIPTION: "Ooh, shiny // Your cast time is decreased to 5 minutes",
				RARITY: "ITEM",
				WORTH: "0",
				PERMISSION: "FANCY_FISHING_ROD",
				AMOUNT: "1",
				TYPE: "FISHING_ROD",
				LUCK: "3"
			},
			
			SHARK_TOOTH: {
				ID: "SHARK_TOOTH",
				NAME: "Shark Tooth",
				DESCRIPTION: "This will scare the fishes into submission",
				RARITY: "ITEM",
				WORTH: "0",
				PERMISSION: "SHARK_TOOTH",
				AMOUNT: "1",
				TYPE: "TALISMAN",
			},
			
			RING_OF_TRANSFORMATION: {
				ID: "RING_OF_TRANSFORMATION",
				NAME: "Ring of Transformation",
				DESCRIPTION: "Rumored to turn Lead into Gold but not quite that effective // Catching trash now gives a small coin bonus",
				RARITY: "ITEM",
				WORTH: "0",
				PERMISSION: "RING_OF_TRANSFORMATION",
				AMOUNT: "1",
				TYPE: "RING",
			},
			CAPSULE_OF_FORGOTTEN_MEMORIES: {
				ID: "CAPSULE_OF_FORGOTTEN_MEMORIES",
				NAME: "Capsule of Forgotten Memories",
				DESCRIPTION: "Blissful memories trapped for all of time // Stroking your waifu gives bonus affection",
				RARITY: "ITEM",
				WORTH: "0",
				PERMISSION: "CAPSULE_OF_FORGOTTEN_MEMORIES",
				AMOUNT: "1",
				TYPE: "TALISMAN",
			},
			// ARTIFACT
			FIBERGLASS_FISHING_ROD: {
				ID: "FIBERGLASS_FISHNG_ROD",
				NAME: "Fiberglass Rod",
				DESCRIPTION: "A metallic-looking fishing rod that appears to bend in impossible ways // Your cast time is decreased to 4 minutes. Your line break chance is set to 0%",
				RARITY: "ARTIFACT",
				WORTH: "0",
				PERMISSION: "FIBERGLASS_FISHING_ROD",
				AMOUNT: "1",
				TYPE: "FISHING_ROD",
				LUCK: "5"
			},
			ARTIFACT_OF_TIME: {
				ID: "ARTIFACT_OF_TIME",
				NAME: "Artifact of Time",
				DESCRIPTION: "As they say, time is money // Reduces some cooldowns by a quarter",
				RARITY: "ARTIFACT",
				WORTH: "0",
				PERMISSION: "ARTIFACT_OF_TIME",
				AMOUNT: "1",
				TYPE: "NECKLACE",
			},
			PINK_PENDANT: {
				ID: "PINK_PENDANT",
				NAME: "Pink Pendant",
				DESCRIPTION: "I feel a strange pull towards it // Gain more affection on dates with your waifu",
				RARITY: "ARTIFACT",
				WORTH: "0",
				PERMISSION: "PINK_PENDANT",
				AMOUNT: "1",
				TYPE: "NECKLACE",
			},
			
			HEALING_RING: {
				ID: "HEALING_RING",
				NAME: "Ring of Healing",
				DESCRIPTION: "I can use one of these the next time a shark bites off my head",
				RARITY: "ARTIFACT",
				WORTH: "0",
				PERMISSION: "HEALING_RING",
				AMOUNT: "1",
				TYPE: "RING",
			},
			
			SHATTERED_PEARL: {
				ID: "SHATTERED_PEARL",
				NAME: "Shattered Pearl",
				DESCRIPTION: "This would be worth a lot more if it wasn’t smashed",
				RARITY: "ARTIFACT",
				WORTH: "186",
				PERMISSION: "NONE",
				AMOUNT: "1",
				TYPE: "INSTANT_MONEY",
			},
			
			DUCT_TAPE: {
				ID: "DUCT_TAPE",
				NAME: "Duct Tape",
				DESCRIPTION: "Duct tape can fix everything, including my relationships  // The next Shattered Pearl you obtain is worth triple",
				RARITY: "ARTIFACT",
				WORTH: "0",
				PERMISSION: "DUCT_TAPE",
				AMOUNT: "1",
				TYPE: "CONSUMABLE",
			},
			// RELIC
			RAPID_FISHING_ROD: {
				ID: "RAPIDS_FISHING_ROD",
				NAME: "Rod of the Rapids",
				DESCRIPTION: "A slim wooden rod with mysterious engravings along its side that seems to warp in the air // Your cooldown is reduced to 2 minutes. You cannot fail to catch.",
				RARITY: "RELIC",
				WORTH: "0",
				PERMISSION: "RAPIDS_FISHING_ROD",
				AMOUNT: "1",
				TYPE: "FISHING_ROD",
				LUCK: "7"
			},
			
			CHARM_OF_THE_DEEP: {
				ID: "CHARM_OF_THE_DEEP",
				NAME: "Charm of the Deep",
				DESCRIPTION: "An ancient sigil emblazoned with the symbol of a Kraken // You will no longer catch trash items",
				RARITY: "RELIC",
				WORTH: "0",
				PERMISSION: "CHARM_OF_THE_DEEP",
				AMOUNT: "1",
				TYPE: "TALISMAN",
			},
			
			FORTUNAS_BLESSING: {
				ID: "FORTUNAS_BLESSING",
				NAME: "Fortunas' Blessing",
				DESCRIPTION: "A Relic from ancient times that brings wealth and prosperity // Caught items are worth 1.5x",
				RARITY: "RELIC",
				WORTH: "0",
				PERMISSION: "FORTUNAS_BLESSING",
				AMOUNT: "1",
				TYPE: "NECKLACE",
			},
			
			CAT_EARS: {
				ID: "CAT_EARS",
				NAME: "Cat Ears",
				DESCRIPTION: "A pair of cat ears… I wonder who these belonged to",
				RARITY: "RELIC",
				WORTH: "0",
				PERMISSION: "CAT_EARS",
				AMOUNT: "1",
				TYPE: "COLLECTIBLE",
			},
		},
		foods: {
			dolp: {
				name: "dolphin",
				key: "fsh;0",
				emoji: ":dolphin:",
				gives: {
					hp: 100,
					en: 10,
				}
			},
			sh: {
				name: "shark",
				key: "fsh;1",
				emoji: ":shark:",
				gives: {
					hp: 0,
					en: 50
				}
			},
			blow: {
				name: "blowfish",
				key: "fsh;2",
				emoji: ":blowfish:",
				gives: {
				hp: 0,
				en: 15
				}
			},
			trop: {
				name: "tropical_fish",
				key: "fsh;3",
				emoji: ":tropical_fish:",
				gives: {
					hp: 0,
					en: 35
				}
			},
			f: {
				name: "fish",
				key: "fsh;4",
				emoji: ":fish:",
				gives: {
					hp: 0,
					en: 55
				}
			},
			lhealth: {
				name: "lhealth",
				key: "lhealth",
				emoji: "<:Lesser_Healing_Potion:820901903319433267>",
				gives: {
					hp: 500,
					en: 0
				}
			},
			health: {
				name: "health",
				key: "health",
				emoji: "<:Healing_Potion:820901914459635712>",
				gives: {
					hp: 1000,
					en: 0
				}
			},
			ghealth: {
				name: "ghealth",
				key: "ghealth",
				emoji: "<:Greater_Healing_Potion:820901927898447892>",
				gives: {
					hp: 1500,
					en: 0
				}
			},
			sake: {
				name: "sake",
				key: "sake",
				emoji: "<:Sake:819097578376659014>",
				gives: {
					hp: 10000,
					en: 100
				}
			},
			dream: {
				name: "dream",
				key: "dcatcher",
				emoji: "<:DREAM_CATCHER_POTION:892589577179631636>",
				gives: {
				hp: 10000,
					en: 100
				}
			},
			milk: {
				name: "milk",
				key: "milk",
				emoji: ":milk:",
				gives: {
					hp: 0,
					en: 75,
				}
			},
			mystery: {
				name: "mystery",
				key: "pmystery",
				emoji: "<:Potion_of_Mystery:822352150653829121>",
				gives: {
					hp: 0,
					en: 0
				}
			},
			dark: {
				name: "dark",
				key: "chillpills",
				emoji: "<:PotionOfDarkness:818822983165542451>",
				gives: {
					hp: 100,
					en: 100
				}
			}
		},
	},	
};

config.config.ditems = [`muted;Muted;${config.config.roles.muted};99999999999999999`];

config.config.defaults = {
	PET_EMOJIS: [ config.config.emoji.heart, "<:1608118557017h:788731915662262313>", "<:1608118557017e:788732489253781515>", "<:1608118557017xp:788733317221842955>", "<:1608118557017c:788733484306399282>", "<:1608118557017int:788734034280841217>", "<:1608118557017str:788734988823691265>", "<a:1608118557017affec:788735503436349451>", "<:sip:861748374487564339>", "https://cdn.discordapp.com/attachments/832373120798162966/832384095479922728/TestPFP.jpg" ]
};

config.config.cstSpecials = [
	[ "tmod", config.config.roles.mod.trial ],
	[ "moderator", config.config.roles.mod.normal ],
	[ "srmod", config.config.roles.srmod ],
	[ "civ", config.config.roles.civ ],
	[ "cit", config.config.roles.cit ],
	[ "updt", config.config.roles.updates ]
];

module.exports = config;