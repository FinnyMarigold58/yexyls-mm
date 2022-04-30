const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

/* Db Schema

{
  announceChannel: Snowflake,
  ticketCategory: Snowflake,
  helperRoles: Array<Snowflake>,
  blacklistedRole: Array<Snowflake>,
}
*/

//Command structure
module.exports.name = "setup";
module.exports.description = "Setup the bot";
module.exports.usage =
  "setup <openMessageAnnouncementChannel> <ticketCategory> <helperRoles>";

//Code to run when slash command is called
module.exports.run = async (message, args, client) => {
  //If user doesn't have permission
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.reply({
      content: "You need to have administator permission to run this command.",
    });

  //Get command options
  const channel = args[0];
  const ticketCategory = args[1];
  const helperRoles = args[2];

  //Get database
  const db = client.db;

  //Prepare permission data
  let rolearray = helperRoles.split(" ");

  //Update database

  db.set(`${message.guildId}`, {
    announceChannel: channel,
    ticketCategory: ticketCategory,
    helperRoles: rolearray,
    blacklistedRoles: [],
  });

  //Reply to user with success message
  message.reply({ content: `Setup complete, making embeded message now!` });

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
    .resolve(channel)
    .send({ embeds: [embed], components: [actionRow] });
};
