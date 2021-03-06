const Command = require("../../structures/Command");
const {
    canModifyQueue
} = require("../../structures/Utils");

module.exports = class StopCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'stop',
            description: 'Stops the music and clears the queue.',
            usage: "stop",
            type: 'music'
        });
    }

    async run(message, args) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply(message.guild.lang.COMMANDS.STOP.noQueue).catch(console.error);

        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(message.guild.lang.COMMANDS.STOP.success(message.author))
    }
}