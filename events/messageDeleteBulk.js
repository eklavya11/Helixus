const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const hastebin = require("hastebin-gen");

const moment = require('moment');

module.exports = async (bot, messages) => {
    const guild = messages.first().guild;
    const channel = messages.first().channel;
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${guild.id}'`, async (err, rows) => {
            let {
                MESSAGEDELETEBULK: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated = "true") {
                        if (logsSettings[0].messagedeletebulk === "true") {
                            bot.db.query(`SELECT * FROM LogsIgnore WHERE guildID='${guild.id}' AND channelID='${channel.id}'`, async (err, ignore) => {
                                if (!ignore[0] || ignore[0].ignored === "false") {
                                    if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                        const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                        let embed = new MessageEmbed()
                                            .setDescription(lang.deleted(messages, channel))
                                            .addField(lang.deletedBy, lang.unknownUser, true)
                                            .addField("Messages", "?")
                                            .setColor("RANDOM")
                                            .setTimestamp();

                                        let msg = lang.header
                                        messages.forEach((m) => {
                                            let content;
                                            if (m.attachments.first() && !m.content) content = lang.contentWithoutMessage(m.attachments.first().proxyURL);
                                            else if (m.attachments.first() && m.content) content = lang.contentWithMessage(m.attachments.first().proxyURL, m.content);
                                            else if (m.content) content = m.content;
                                            else content = lang.noContent
                                            msg += `${m.author.tag} (${m.author.id}) | ${m.id} | ${moment(m.createdAt).format("DD MMMM Y, HH:mm:ss")} | ${content}\n`;
                                        });



                                        await setTimeout(async () => {
                                            const logs = await guild.fetchAuditLogs({
                                                limit: 5,
                                                type: 73
                                            }).catch(() => {
                                                return
                                            });
                                            if (!logs) return;

                                            const log = logs.entries.first()
                                            const executor = guild.members.cache.get(log.executor.id);


                                            if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                                embed.fields[0].value = executor
                                                embed.fields[1].value = await hastebin(msg, {
                                                    extension: "txt"
                                                });
                                                await webhook.send(embed);
                                            } else {
                                                embed.fields[1].value = await hastebin(msg, {
                                                    extension: "txt"
                                                });
                                                await webhook.send(embed);
                                            }
                                        }, 1000)
                                    }
                                }
                            });
                        }
                    }
                }
            }
        })
    })
}