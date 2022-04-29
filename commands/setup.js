const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

/* Db Schema

{
  announceChannel: Snowflake,
  ticketCategory: Snowflake,
  helperRoles: Array<Snowflake>,
}
*/

//Command structure
module.exports.command = {
  name: "setup",
  description: "Setup the bot",
  options: [
    {
      type: "CHANNEL",
      name: "channel",
      description: `The channel where the open ticket message will be put.`,
      required: true,
      channelTypes: ["GUILD_TEXT"],
    },
    {
      type: "CHANNEL",
      name: "category",
      description: `The category where the tickets will be put.`,
      required: true,
      channelTypes: ["GUILD_CATEGORY"],
    },
    {
      type: "STRING",
      name: "rolelist",
      description: `The role ids that can help with tickets. (Seperated by spaces)`,
      required: true,
    },
  ],
};

module.exports.run = async (interaction, client) => {
  //If user doesn't have permission
  if (!interaction.member.permissions.has("ADMINISTRATOR"))
    return interaction.reply({
      content: "You need to have administator permission to run this command.",
    });

  //Get command options
  const channel = interaction.options.getChannel("channel");
  const ticketCategory = interaction.options.getChannel("category");
  const helperRoles = interaction.options.getString("rolelist");

  //Get database
  const db = client.db;

  //Prepare permission data
  let rolearray = helperRoles.split(" ");

  //Update database

  db.set(`${interaction.guildId}`, {
    announceChannel: channel.id,
    ticketCategory: ticketCategory.id,
    helperRoles: rolearray,
  });

  //Reply to user with success message
  interaction.reply({ content: `Setup complete, making embeded message now!` });

  //Anouncement Embed
  const embed = new MessageEmbed({
    description: `__MM Rules/Guidelines__
  **Before you create a ticket, Here are the rules you should take notice of:**
 
  ・Make sure the user you are trading with is in the server.
  ・Do not ping any Middleman, wait patiently for one to come.
  ・Make sure the other trader agrees on using Middleman.
  ・Timewasters/Trolling/Not vouching the middleman will lead to @Middleman Ban.
 
  __What we don't middleman__
  ・Nitro
  ・Roblox Giftcards
  ・Accounts
  ・Discord Servers`,
    title: "Request a Middleman",
    color: "GREY",
    timestamp: new Date(),
    footer: {
      text: `Yexyl's MM Service | `,
      iconURL: interaction.guild.iconURL(),
    },
    author: {
      iconURL: interaction.guild.iconURL(),
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
  channel.send({ embeds: [embed], components: [actionRow] });
};
