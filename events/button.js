//Requirements
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const fs = require("fs");

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
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
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
            allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
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
        //Check user permissions
        if (!client.db.has(`${interaction.guildId}`))
          return interaction.reply({
            content: "Bot not set up have an administrator run /setup",
          });

        const helpers = client.db.get(`${interaction.guildId}`).helperRoles;
        const memberIsHelper = helpers.some((role) =>
          interaction.member.roles.cache.has(role)
        );

        if (!memberIsHelper)
          return interaction.reply({
            content: "You don't have permission to use this command",
            ephemeral: true,
          });
        //Check channel category
        if (
          interaction.channel.parentId ==
          client.db.get(interaction.guildId).ticketCategory
        ) {
          interaction.reply({ content: "Closing ticket..." });
          await sleep(1000);
          let channelData = interaction.channel.name.split("-");
          let newPermissions = [
            { id: interaction.guildId, type: "role", deny: ["SEND_MESSAGES"] },
          ];
          const user = await interaction.guild.members.cache.find(
            (member) => member.user.username.toLowerCase() == channelData[0]
          );
          interaction.channel.edit({
            name: `closed-${channelData[1]}`,
            permissionOverwrites: newPermissions,
          });

          interaction.channel.permissionOverwrites.edit(user, {
            VIEW_CHANNEL: null,
          });

          const transcript = new MessageButton({
            label: "Transcript",
            emoji: "📝",
            style: "SECONDARY",
            customId: "ticket-transcript",
          });
          const openb = new MessageButton({
            label: "Open",
            emoji: "🔓",
            style: "SECONDARY",
            customId: "ticket-open",
          });
          const deleteb = new MessageButton({
            label: "Delete",
            emoji: "🗑",
            style: "SECONDARY",
            customId: "ticket-delete",
          });
          const row = new MessageActionRow().addComponents(
            transcript,
            openb,
            deleteb
          );
          interaction.channel.send({
            embeds: [
              new MessageEmbed({
                description: `Ticket closed by ${interaction.user}`,
                color: "YELLOW",
              }),
            ],
            components: [row],
          });
        } else {
          return interaction.reply({
            content: "You can't close this ticket.",
            ephemeral: true,
          });
        }
        break;
      case "ticket-transcript":
        const channel = interaction.channel;

        const newFile = await discordTranscripts.createTranscript(channel, {
          returnBuffer: true,
        });

        if (
          !(await fs.existsSync(`./public/transcripts/${interaction.guildId}`))
        ) {
          await fs.mkdirSync(`./public/transcripts/${interaction.guildId}`, {
            recursive: true,
          });
        }

        await fs.writeFileSync(
          `./public/transcripts/${interaction.guildId}/${
            interaction.channel.name.split("-")[1]
          }.html`,
          newFile
        );

        const membed = new MessageEmbed({
          color: "GREEN",
          author: {
            name: `New Transcript`,
            iconURL: interaction.guild.iconURL(),
          },
          fields: [
            {
              name: "Ticket Name",
              value: `ticket-${interaction.channel.name.split("-")[1]}`,
            },
            {
              name: "Direct Transcript",
              value: `[Click Here](https://mmbot.ga/transcripts/${
                interaction.guildId
              }/${interaction.channel.name.split("-")[1]}.html)`,
            },
          ],
        });

        interaction.reply({
          files: [
            `./public/transcripts/${interaction.guildId}/${
              interaction.channel.name.split("-")[1]
            }.html`,
          ],
          embeds: [membed],
        });
        break;
      case "ticket-open":
        const user = await interaction.channel.permissionOverwrites.cache.find(
          (perm) => perm.allow.has("SEND_MESSAGES", false)
        );

        interaction.channel.permissionOverwrites
          .edit(interaction.guildId, {
            SEND_MESSAGES: true,
          })
          .catch((err) => console.log(err));
        // interaction.channel.permissionOverwrites
        //   .edit(user.id, {
        //     VIEW_CHANNEL: true,
        //   })
        //   .catch((err) => console.log(err));

        interaction.reply(
          `Ticket reopened! Please add the user back to this ticket.`
        );
        break;
      case "ticket-delete":
        interaction.channel.delete();
        break;
    }
  });
};

//Function to pause code for x milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
