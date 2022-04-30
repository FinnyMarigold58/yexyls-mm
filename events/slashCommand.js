//Slash command handler
module.exports = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      //Run command logic
      client.slashCommands
        .get(interaction.commandName)
        .run(interaction, client);
    }
  });
};
