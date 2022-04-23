/* Db Schema

{
  announceChannel: Snowflake,
  ticketCategory: Snowflake,
  helperRoles: Array<Snowflake>,
}
*/

(module.exports.command = {
  name: "setup",
  description: "Setup the bot",
  defaultPermission: false,
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
      name: "ticketCategory",
      description: `The category where the tickets will be put.`,
      required: true,
      channelTypes: ["GUILD_CATEGORY"],
    },
    {
      type: "ROLE",
      name: "helperRoles",
      description: `The role ids that can help with tickets. (Seperated by spaces)`,
      required: true,
    },
  ],
}),
  (module.exports.run = async (interaction, client) => {
    const channel = interaction.options.getChannel("channel");
    const ticketCategory = interaction.options.getChannel("ticketCategory");
    const helperRoles = interaction.options.getRoles("helperRoles");

    const db = client.db.get(interaction.guildId);
    db.announceChannel = channel.id;
    db.ticketCategory = ticketCategory.id;
    let rolearray = helperRoles.split(" ");
    db.helperRoles = rolearray.map((role) => role.id);

    client.db.set(interaction.guildId, db);

    let permlist = [];

    rolearray.forEach((role) =>
      permlist.push({ id: role.id, type: "role", permission: true })
    );
  });
