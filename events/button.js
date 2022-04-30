//Requirements
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

//MessageButton event handler
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    //Get specific command
    switch (interaction.customId) {
      case "request":
        //Grab db info
        const db = client.db.get(interaction.guildId);
        if (!db.nextTicket) db.nextTicket = 1;
        client.db.set(interaction.guildId, db);
        const dbcategory = db.ticketCategory;
        const category = await interaction.guild.channels.fetch(dbcategory);

        for (i in db.blacklistedRoles) {
          let roleId = db.blacklistedRoles[i];

          if (interaction.member.roles.cache.has(roleId)) {
            return interaction.reply({
              ephemeral: true,
              content:
                "You can't create a ticket because you have a blacklisted role.",
            });
          }
          continue;
        }

        //Check if person already has a ticket
        if (
          category.children.find(
            (c) =>
              c.name.split("-")[0] === interaction.user.username.toLowerCase()
          )
        )
          return interaction.reply({
            ephemeral: true,
            content: "You already have a ticket open.",
          });

        //Create ticket
        const permisions = [
          {
            id: interaction.user.id,
            type: "member",
            allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: interaction.guildId,
            type: "role",
            deny: ["VIEW_CHANNEL"],
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
          `${interaction.user.username}-${db.nextTicket}`,
          { permissionOverwrites: permisions }
        );

        const closeButton = new MessageButton({
          label: `Close`,
          emoji: "🔒",
          customId: `closeTicket`,
          style: "SECONDARY",
        });
        const row = new MessageActionRow().addComponents(closeButton);
        const embed = new MessageEmbed({
          description: `•A Middleman will be with you shortly please fill out the format below

          •Example
          You:NFR Snow Owl For Candy Set
          Other Trader:!"Mizo#5663 or ID
          To close this ticket press the cancel button`,
        });
        ticketChannel.send({
          content: `${
            interaction.user
          } Welcome. Welcome, Fill in the format while your waiting for a ${db.helperRoles
            .map((id) => `<@&${id}>`)
            .join()}. If a middleman doesn't arrive in 20 minutes, please ping an online middleman.`,
          embeds: [embed],
          components: [row],
        });

        interaction.reply({
          ephemeral: true,
          content: `Ticket opened! ${ticketChannel}`,
        });
        client.db.add(`${interaction.guildId}.nextTicket`, 1);
        break;
      case "closeTicket":
        //Delete channel
        interaction.channel.delete();
        break;
    }
  });
};
