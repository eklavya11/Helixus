const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const hastebin = require("hastebin-gen");

const moment = require('moment');

module.exports = async (bot, message) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${message.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${message.guild.id}'`, async (err, rows) => {
            let {
                MESSAGEDELETE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated = "true") {
                        if (logsSettings[0].messagedelete === "true") {
                            bot.db.query(`SELECT * FROM LogsIgnore WHERE guildID='${message.guild.id}' AND channelID='${message.channel.id}'`, async (err, ignore) => {
                                if (!ignore[0] || ignore[0].ignored === "false") {
                                    if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                        const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                        let embed = new MessageEmbed()
                                            .setAuthor(message.author.tag, message.author.avatarURL())
                                            .setDescription(lang.deleted(message))
                                            .addField(lang.deletedBy, message.author, true)
                                            .setColor("RANDOM")
                                            .setTimestamp();

                                        if (message.attachments.first()) {
                                            if (!message.content) embed.addField(lang.attachment, message.attachments.first().proxyURL);
                                            else {
                                                if (message.content.length > 1023) {
                                                    embed.addField(lang.content, await hastebin(message.content, {
                                                        extension: "txt"
                                                    }));
                                                    embed.addField(lang.attachment, message.attachments.first().proxyURL);
                                                } else {
                                                    embed.addField(lang.content, message.content);
                                                    embed.addField(lang.attachment, message.attachments.first().proxyURL);
                                                }
                                            }
                                        } else {
                                            if (message.content.length > 1023) embed.addField(lang.content, await hastebin(message.content, {
                                                extension: "txt"
                                            }));
                                            else embed.addField(lang.content, message.content);
                                        }

                                        await setTimeout(async () => {
                                            const logs = await message.guild.fetchAuditLogs({
                                                limit: 5,
                                                type: 72
                                            }).catch(() => {
                                                return
                                            });
                                            if (!logs) return;

                                            const log = logs.entries.first()
                                            const executor = message.guild.members.cache.get(log.executor.id);

                                            if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                                embed.fields[0].value = executor

                                                await webhook.send(embed);
                                            } else {
                                                await webhook.send(embed);
                                            }
                                        }, 1000)
                                    }
                                }
                            })
                        }
                    }
                }
            }
        })
    })
}