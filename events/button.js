module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
      case "request":
        const db = client.db.get(interaction.guildId);
        const dbcategory = db.ticketCategory;
        const category = await interaction.guild.channels.fetch(dbcategory);

        if (
          category.children.find(
            (c) =>
              c.name ===
              `ticket-${interaction.user.tag.replace("#", "").toLowerCase()}`
          )
        )
          return interaction.reply({
            ephemeral: true,
            content: "You already have a ticket open.",
          });

        const permisions = [
          {
            id: interaction.user.id,
            type: "member",
            allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "SEND_MESSAGES"],
          },
        ];
        db.helperRoles.forEach((role) => {
          permisions.push({
            id: role,
            type: "role",
            allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "SEND_MESSAGES"],
          });
        });
        const ticketChannel = await category.createChannel(
          `ticket-${interaction.user.tag}`,
          { permissionOverwrites: permisions }
        );
        ticketChannel.send({
          content: `${interaction.user}
          Fill in the format below while waiting for @Other Middleman.
          \`The trade:\`
          \`The other trader's user/ID:\``,
        });

        interaction.reply({
          ephemeral: true,
          content: `Ticket opened! ${ticketChannel}`,
        });
        break;
    }
  });
};
