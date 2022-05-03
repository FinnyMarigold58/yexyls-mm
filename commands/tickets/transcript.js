const discordTranscripts = require("discord-html-transcripts");
const fs = require("fs");

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

  console.log(
    `Transcript of ${
      message.channel.name
    } generated. Link: http://localhost:3000/transcripts/${message.guildId}/${
      message.channel.name.split("-")[1]
    }.html`
  );
};
