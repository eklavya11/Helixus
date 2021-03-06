const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

module.exports = async (bot, guild) => {
    const wb = new WebhookClient(bot.config.webhook.joinleaves.id, bot.config.webhook.joinleaves.password);

    const promises = [bot.shard.fetchClientValues("guilds.cache.size")];

    Promise.all(promises).then((res) => {
        const guilds = res[0].reduce((prev, guild) => prev + guild, 0);

        let e = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("**A server added the bot!**")
            .setDescription(`Server: **${guild.name}** (\`${guild.id}\`)\nMade by **${guild.owner.user.tag}** (\`${guild.owner.id}\`)\nMembers: **${guild.memberCount}**\n\nI am now in **${guilds}** guilds!`)
            .setThumbnail(guild.iconURL({
                size: 256
            }))
            .setTimestamp();
        wb.send(e);
    })
}