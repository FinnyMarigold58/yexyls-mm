//Slash command handler
module.exports = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      //Run command logic
      client.commands.get(interaction.commandName).run(interaction, client);
    }
  });
};
