module.exports.name = "setmessage";
module.exports.description = "Set the announcement message";
module.exports.usage = "setmessage <message>";
module.exports.args = true;

module.exports.run = async (message, args, client) => {
  //If user doesn't have permission
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.reply({
      content: "You need to have administator permission to run this command.",
    });
  const db = client.db.get(`${message.guild.id}`);
  db.announceMessage = args.join("");
  client.db.set(`${message.guild.id}`, db);
  return message.reply({
    content: "Announcement message set.",
  });
};
