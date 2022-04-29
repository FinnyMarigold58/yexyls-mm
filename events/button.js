//Requirements
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js")

//MessageButton event handler
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    //Get specific command
    switch (interaction.customId) {
      case "request":
        //Grab db info
        const db = client.db.get(interaction.guildId);
        const dbcategory = db.ticketCategory;
        const category = await interaction.guild.channels.fetch(dbcategory);

        for (i in db.blacklistedRoles) {
          let roleId = db.blacklistedRoles[i]

          if (interaction.member.roles.cache.has(roleId)) {
            return interaction.reply({ ephemeral: true, content: "You can't create a ticket because you have a blacklisted role." })
            break
          }
          continue
        }

        //Check if person already has a ticket
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

        //Create ticket
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

        const closeButton = new MessageButton({
          label: `Close`,
          emoji: "🔒",
          customId: `closeTicket`,
          style: "SECONDARY"
        })
        const row = new MessageActionRow().addComponents(closeButton)
        const embed=  new MessageEmbed({description: `A middleman will be with you shortly.
        Please fill out the format below.
        
        Example:
        Deak: NFR Snow Olw for Candy set
        Other trander: bosco#1111 or ID
        To close this ticket press the button`})
        ticketChannel.send({
          content: `${interaction.user} Welcome. Please kindly wait for the ${db.helperRoles.map((id) => `<@${id}>`).join()} to arrive. If a middleman doesn't arrive in 20 minutes, please ping an online middleman.`,
          components: [row]
        });

        interaction.reply({
          ephemeral: true,
          content: `Ticket opened! ${ticketChannel}`,
        });
        break;
      case closeTicket:
        //Delete channel
         interaction.channel.delete()
         break
    }
  });
};
