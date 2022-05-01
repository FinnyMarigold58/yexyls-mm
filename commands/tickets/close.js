//Command structure
module.exports.name = "close";
module.exports.description = "Close a ticket";
module.exports.usage = "close";

//Code to run when command is called
module.exports.run = async (message, args, client) => {
  //Check user permissions
  if (!client.db.has(`${message.guildId}`))
    return message.reply({
      content: "Bot not set up have an administrator run /setup",
    });

  const helpers = client.db.get(`${message.guildId}`).helperRoles;
  const memberIsHelper = helpers.some((role) =>
    message.member.roles.cache.has(role)
  );

  if (!memberIsHelper)
    return message.reply({
      content: "You don't have permission to use this command",
    });
  //Check channel category
  if (
    message.channel.parentId == client.db.get(message.guildId).ticketCategory
  ) {
    message.reply({ content: "Closing ticket..." });
    await sleep(1000);
    let channelData = message.channel.name.split("-");
    let newPermissions = [
      { id: message.guildId, type: "role", deny: ["SEND_MESSAGES"] },
    ];
    const user = await message.guild.members.cache.find(
      (member) => member.username.toLowerCase() == channelData[0]
    );
    message.channel.edit({
      name: `closed-${channelData[1]}`,
      permissionOverwrites: newPermissions,
    });
    console.log(user);
    // message.channel.permissionOverwrites.delete(user);
  } else {
    return message.reply({
      content: "You can't close this ticket.",
      ephemeral: true,
    });
  }
};

//Function to pause code for x milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
