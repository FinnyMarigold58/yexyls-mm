module.exports.args = true;
module.exports.name = "blacklist";
module.exports.description = "Blacklist a role from creating tickets";
module.exports.usage = "blacklist add/remove <roleid>";

module.exports.run = async (message, args, client) => {
  if (!client.db.has(message.guildId))
    return message.reply({ content: `Bot not set up` });

  const helpers = client.db.get(message.guildId).helperRoles;
  const memberIsHelper = helpers.some((role) =>
    message.member.roles.cache.has(role)
  );

  if (!memberIsHelper)
    return message.reply({
      content: `You don't have permission to use this command`,
    });

  const subcommand = args[0];
  const blacklistRole = args[1];
  const db = client.db.get(message.guildId);

  switch (subcommand) {
    case "add":
      if (db.blacklistedRoles.includes(blacklistRole))
        return message.reply({
          content: `This role is already blacklisted`,
        });
      db.blacklistedRoles.push(blacklistRole);
      client.db.set(message.guildId, db);
      message.reply({
        content: `Added ${message.guild.roles.resolve(
          blacklistRole
        )} to the blacklist`,
      });
      break;
    case "remove":
      if (!db.blacklistedRoles.includes(blacklistRole))
        return message.reply({ content: `This role is not blacklisted` });
      db.blacklistedRoles.splice(db.blacklistedRoles.indexOf(blacklistRole), 1);
      client.db.set(message.guildId, db);
      message.reply({
        content: `Removed ${message.guild.roles.resolve(
          blacklistRole
        )} from the blacklist`,
      });
      break;
    default:
      message.reply({
        content: `Invalid subcommand. Valid subcommands are: add, remove`,
      });
      break;
  }
};
