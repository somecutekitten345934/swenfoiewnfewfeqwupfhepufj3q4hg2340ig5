const { MessageEmbed, MessageAttachment } = require("discord.js");
const Captcha = require(`@haileybot/captcha-generator`)
const pms = require(`pretty-ms`);

module.exports = {
	name: "captcha",
	aliases: ['captcha'],
	category: 'utl',
	description: 'Allows you to prove you are not a bot!',
	async run(client, message, args) {
        if(message.author.id == client.config.owner && args[0] == "forcecheck"){
            var user = await client.usr(args[1]).catch((x) => {});
            if(!user){
                return message.channel.send(`Please provide a user to force a captcha to`)
            }
            let cst = await client.db.get(`cst${user.id}`)
            cst = cst.split(`;`)
            var cc = await client.db.get(`captcha${user.id}`) || []
        var captcha = new Captcha()
            if(cst.includes(`captcha`)){
                
            } else{
                cst.push(`captcha`)
                await client.db.set(`cst${user.id}`, cst.join(`;`))
            }
            if(!cc){
                cc.push({
                    CAPTCHA_CODE: captcha.value,
                    CAPTCHA_ATTEMPTS: 5,
                    CAPTCHA_EXPIRES: Date.now() + 300000,
                    CAPTCHA_CHECKER: `${message.author.tag}`
                })
                await client.db.set(`captcha${user.id}`, cc)
            } else {
                var cc = []
                cc.push({
                    CAPTCHA_CODE: captcha.value,
                    CAPTCHA_ATTEMPTS: 5,
                    CAPTCHA_EXPIRES: Date.now() + 300000,
                    CAPTCHA_CHECKER: `${message.author.id}`
                })
                await client.db.set(`captcha${user.id}`, cc)
            }
            message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Event Success!`)
                .setDescription(`I've successfully force started event **CAPTCHA_CHECK** on user **${user.tag}** (${user.id})`)
                .setThumbnail(client.config.thumbnail.thumbsup)]
            })
            user.send({
                embeds: [new MessageEmbed().setDescription(`Use the command \`${message.guild.prefix}captcha <code>\` in any server with Weebchan!`)],
                files: [new MessageAttachment(captcha.PNGStream, "captcha.png") ]
            })
            const channel = client.channels.cache.get(client.config.channels.captchalog);
            channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${user.id}] (${user.tag}) has been checked by ${message.author.tag}`)
            return;
        }
        var cap = await client.db.get(`captcha${message.author.id}`)
        var cst = await client.db.get(`cst${message.author.id}`) || ""
        cst = cst.split(`;`)
        if(!cap){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.red)
                .setTitle(`Access Denied!`)
                .setDescription(`I'm sorry, but in order to use this command, you must first be in **CAPTCHA MODE**`)
                .setThumbnail(client.config.thumbnail.mad)]
            })
        }
        if(!args.length){
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.red)
                .setTitle(`Invalid Code!`)
                .setDescription(`I'm not really sure what captcha code you want me to check... give me a code!`)
                .setThumbnail(client.config.thumbnail.question)]
            })
        }
        for(var i in cap){
            cap[i].number = Number(i) + 1;
        }
        var captcha = cap.find(c=>c.number == 1)
        console.log(captcha.CAPTCHA_ATTEMPTS)
        var arg = args[0].toLowerCase()
        var code = captcha.CAPTCHA_CODE.toLowerCase()
        if(code == arg){
            cst = cst.filter((x) => !["captcha"].includes(x));
            await client.db.set(`cst${message.author.id}`, cst.join(`;`))
            await client.db.delete(`captcha${message.author.id}`)
            const channel = client.channels.cache.get(client.config.channels.captchalog);
            channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${message.author.id}] (${message.author.tag}) Successfully has passed the captcha test`)
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Passed Captcha!`)
                .setDescription(`Thank you for passing the captcha test. You can now use the bot again!`)
                .setThumbnail(client.config.thumbnail.thumbsup)]
            })
        } else {
            if(captcha.CAPTCHA_ATTEMPTS <= 0){
                await client.db.delete(`captcha${message.author.id}`)
                cst.push(`blacklisted`)
                cst = cst.filter((x) => !["captcha"].includes(x));
                await client.db.set(`cst${message.author.id}`, cst.join(`;`))
                await client.db.set(`blckr${message.author.id}`, `[WEEBCHAN ANTICHEAT]: Failure to solve captcha in alocated time`)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                    .setTitle(`Account Blacklisted!`)
                    .setDescription(`Your account has been permanently blacklisted from using Weebchan! If you believe this blacklist was unjust please message SemiMute#6630.\n\n**WEEBCHAN CHEAT DETECTION**\nFailing captcha system within the allocated time`)
                    .setThumbnail(client.config.thumbnail.banhammer)]
                })
                const channel = client.channels.cache.get(client.config.channels.captchalog);
                channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${message.author.id}] (${message.author.tag}) has been BLACKLISTED by **WEEBCHAN CHEAT DETECTION**`)
                return;
            }
            const channel = client.channels.cache.get(client.config.channels.captchalog);
            channel.send(`[${message.guild.name}] (${message.guild.id}) [${message.channel.name}] (${message.channel.id}) --> [${message.author.id}] (${message.author.tag}) failed their captcha`)
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setTitle(`Invalid Captcha!`)
                .setDescription(`The captcha code "${args[0]}" was incorrect, please check dms for the code and try again!\n\nCaptcha Expires in **${pms(captcha.CAPTCHA_EXPIRES - Date.now(), { verbose: true })}**`)]
            })
        }
    }
}