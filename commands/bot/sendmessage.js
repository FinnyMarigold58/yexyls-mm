module.exports.name = "sendmessage";
module.exports.description = "Send the announcement message";
module.exports.usage = "sendmessage";

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (message, args, client) => {
  const db = client.db.get(`${message.guild.id}`);
  //Anouncement Embed
  const embed = new MessageEmbed({
    description: db.announceMessage,
    title: "Request a Middleman",
    color: "GREY",
    timestamp: new Date(),
    footer: {
      text: `${message.guild.name} | `,
      iconURL: message.guild.iconURL(),
    },
    author: {
      iconURL: message.guild.iconURL(),
    },
  });

  // MessageButton to request
  const messageButton = new MessageButton({
    label: "Request a Middleman",
    customId: "request",
    style: "SUCCESS",
  });

  //Add button to actionrow
  const actionRow = new MessageActionRow().addComponents(messageButton);

  //Send message
  message.guild.channels
    .resolve(db.announceChannel)
    .send({ embeds: [embed], components: [actionRow] });
};
