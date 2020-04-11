module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);

  if (message.guild.me.voice.channel.members.size === 1) await message.guild.me.voice.channel.leave();
  else {
    if (!message.member.voice.channel)
    return message.channel.send(bot.lang.musique.stop.nochannel);
  if (!serverQueue) return message.channel.send(bot.lang.musique.stop.nomusic);
  serverQueue.songs = []
  await serverQueue.connection.dispatcher.end();
//  if (message.guild.me.voice.channel) await message.guild.me.voice.channel.leave();
  }
 
  return message.channel.send(bot.lang.musique.stop.stopped);
};
module.exports.help = {
  name: "stop",
  aliases: ["leave"],
  catégorie: "Musique",
  helpcaté: "musique"
};
