module.exports.command = {
  name: "blacklist",
  description: "Blacklist a role from using tickets",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "Add a role to the blacklist",
      options: [
        {
          type: "ROLE",
          name: "blacklistrole",
          description: "The role to blacklist",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "Remove a role from the blacklist",
      options: [
        {
          type: "ROLE",
          name: "blacklistrole",
          description: "The role to remove from the blacklist",
          required: true,
        },
      ],
    },
  ],
};

module.exports.run = async (interaction, client) => {
  if (!client.db.has(interaction.guildId))
    return interaction.reply({ content: `Bot not set up` });

  const helpers = client.db.get(interaction.guildId).helperRoles;
  const memberIsHelper = helpers.some((role) =>
    interaction.member.roles.cache.has(role)
  );

  if (!memberIsHelper)
    return interaction.reply({
      content: `You don't have permission to use this command`,
    });

  const subcommand = interaction.options.getSubcommand();
  const blacklistRole = interaction.options.getRole("blacklistrole");
  const db = client.db.get(interaction.guildId);

  switch (subcommand) {
    case "add":
      if (db.blacklistedRoles.includes(blacklistRole.id))
        return interaction.reply({
          content: `This role is already blacklisted`,
        });
      db.blacklistedRoles.push(blacklistRole.id);
      client.db.set(interaction.guildId, db);
      interaction.reply({
        content: `Added ${blacklistRole.name} to the blacklist`,
      });
      break;
    case "remove":
      if (!db.blacklistedRoles.includes(blacklistRole.id))
        return interaction.reply({ content: `This role is not blacklisted` });
      db.blacklistedRoles.splice(
        db.blacklistedRoles.indexOf(blacklistRole.id),
        1
      );
      client.db.set(interaction.guildId, db);
      interaction.reply({
        content: `Removed ${blacklistRole.name} from the blacklist`,
      });
      break;
  }
};
