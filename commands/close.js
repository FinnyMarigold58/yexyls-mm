//Command structure
module.exports.command = {
  name: "close",
  description: "Close current ticket",
};

module.exports.run = async (interaction, client) => {
  if (!client.db.has(`${interaction.guildId}`))
    return interaction.reply("Bot not set up have an administrator run /setup");
  if (
    interaction.channel.parentId ==
    client.db.get(interaction.guildId).ticketCategory
  ) {
    interaction.reply({ content: "Closing ticket..." });
    await sleep(3000);
    return interaction.channel.delete();
  } else {
    return interaction.reply({
      content: "You can't close this ticket.",
      emphemeral: true,
    });
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
