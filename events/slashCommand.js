module.exports = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      client.commands.get(interaction.commandName).run(interaction, client);
    }
  });
};
