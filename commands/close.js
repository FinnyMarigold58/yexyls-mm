//Command structure
module.exports.command = {
  name: "close",
  description: "Close current ticket",
};

//Code to run when command is called
module.exports.run = async (interaction, client) => {
  //Check user permissions
  if (!client.db.has(`${interaction.guildId}`))
    return interaction.reply("Bot not set up have an administrator run /setup");
  //Check channel category
  if (
    interaction.channel.parentId ==
    client.db.get(interaction.guildId).ticketCategory
  ) {
    interaction.reply({ content: "Closing ticket..." });
    await sleep(1000);
    return interaction.channel.delete();
  } else {
    return interaction.reply({
      content: "You can't close this ticket.",
      ephemeral: true,
    });
  }
};

//Function to pause code for x milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
