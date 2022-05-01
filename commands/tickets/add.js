module.exports.name = "add";
module.exports.description = "Add a user to a ticket.";
module.exports.usage = "add <user>";
module.exports.args = true;

module.exports.run = async (message, args, client) => {
  if (!client.db.has(message.guild.id))
    return message.channel.send("No ticket database found. Run /setup");
  const db = client.db.get(message.guild.id);

  if (
    !message.channel.parentId ||
    !message.channel.parentId == db.ticketCategory
  )
    return message.channel.send(
      "You can only use this command in a ticket channel."
    );

  if (!args[0]) return message.channel.send("Please provide a user to add.");

  const user = await getUser(args[0], message);

  if (!user) return message.channel.send("Could not find user.");

  message.channel.permissionOverwrites.create(user, { VIEW_CHANNEL: true });

  return message.reply({ content: `Added ${user.user.tag} to the ticket.` });
};

const getUser = (input, message) => {
  if (!input) return null;
  input.replace(/([<@!>])+/g, "");
  let target = message.guild.members.resolve(input);
  if (target == null) {
    target = message.guild.members.cache.find(
      (member) =>
        member.user.tag === input ||
        member.user.id === input ||
        member.user.username === input ||
        (member.nickname !== null && member.nickname === input)
    );
  }
  if (target == null) {
    target = message.guild.members.cache.find(
      (member) =>
        member.user.username.toLowerCase() + "#" + member.user.discriminator ===
          input.toLowerCase() ||
        member.user.username.toLowerCase() === input.toLowerCase() ||
        (member.nickname !== null &&
          member.nickname.toLowerCase() === input.toLowerCase())
    );
  }
  if (target == null) {
    target = message.guild.members.cache.find(
      (member) =>
        member.user.username.startsWith(input) ||
        member.user.username.toLowerCase().startsWith(input.toLowerCase())
    );
  }
  if (target == null) {
    target = message.guild.members.cache.find(
      (member) =>
        (member.nickname !== null && member.nickname.startsWith(input)) ||
        (member.nickname !== null &&
          member.nickname.toLowerCase().startsWith(input.toLowerCase()))
    );
  }
  if (target == null) {
    target = message.guild.members.cache.find(
      (member) =>
        member.user.username.toLowerCase().includes(input.toLowerCase()) ||
        (member.nickname !== null &&
          member.nickname.toLowerCase().includes(input.toLowerCase()))
    );
  }
  return target;
};
