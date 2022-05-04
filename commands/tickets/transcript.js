const discordTranscripts = require("discord-html-transcripts");
const fs = require("fs");
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports.name = "transcript";
module.exports.description = "Generate a transcript of channel messages.";
module.exports.usage = "transcript";

module.exports.run = async (message, args, client) => {
  const channel = message.channel;

  const newFile = await discordTranscripts.createTranscript(channel, {
    returnBuffer: true,
  });

  if (!(await fs.existsSync(`./public/transcripts/${message.guildId}`))) {
    await fs.mkdirSync(`./public/transcripts/${message.guildId}`, {
      recursive: true,
    });
  }

  await fs.writeFileSync(
    `./public/transcripts/${message.guildId}/${
      message.channel.name.split("-")[1]
    }.html`,
    newFile
  );

  const embed = new MessageEmbed({
    color: "GREEN",
    author: { name: `New Transcript`, iconURL: message.guild.iconURL() },
    fields: [
      {
        name: "Ticket Name",
        value: `ticket-${message.channel.name.split("-")[1]}`,
      },
      {
        name: "Direct Transcript",
        value: `[Click Here](https://mmbot.ga/transcripts/${message.guildId}/${
          message.channel.name.split("-")[1]
        }.html)`,
      },
    ],
  });

  message.reply({
    files: [
      `./public/transcripts/${message.guildId}/${
        message.channel.name.split("-")[1]
      }.html`,
    ],
    embeds: [embed],
  });
};
