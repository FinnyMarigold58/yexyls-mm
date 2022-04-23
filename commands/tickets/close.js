module.exports.command = {
  name: "close",
  description: "Close current ticket",
  defaultPermission: false,
};

module.exports.run = async (interaction, client) => {
  if (
    interaction.channelId == client.db.get(interaction.guildId).announceChannel
  ) {
    interaction.channel.send({ content: "Closing ticket..." });
    await sleep(3000);
    return interaction.channel.delete();
  } else {
    return interaction.channel.send({
      content: "You can't close this ticket.",
      emphemeral: true,
    });
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
