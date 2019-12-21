module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) url = message.attachments.first().url;
  else if (message.mentions.users.first())
    url = message.mentions.users.first().avatarURL();
  else url = args[0] ? args[0] : message.author.avatarURL();

  const m = await message.channel.send("Please wait...");

  get(`https://hapi.helixus.fr/v1/brazzers?url=${url}`, {
    headers: { Authorization: bot.config.helixusapi },
    responseType: "arraybuffer"
  })
    .then(res => {
      return message.channel
        .send("Generated with HelixusAPI (docs.helixus.fr)", {
          file: { attachment: res.data, name: "brazzers.png" }
        })
        .then(() => m.delete());
    })
    .catch(err => message.reply(err.message));
};
module.exports.help = {
  name: "brazzers",
  catégorie: "Images",
  helpcaté: "images"
};