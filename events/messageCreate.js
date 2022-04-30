const prefix = "$";

module.exports = (client) => {
  //When receiving a message
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return; //Ignore bots and dms

    //If user mentions bot
    if (message.content === `<@${client.user.id}>`)
      return message.author.send({
        content: `Hey! My prefix is ${prefix}, you can ask for \`${prefix}help\` if you ever need.`,
      });

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
      client.commands.get(commandName) || //DO NOT PUT ;
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command) return; //If such command doesn't exist, ignore it

    //Ignore guild-only commands inside DMs
    if (message.channel.type == "DM") {
      return;
    }

    //Check if that command needs arguments

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }
      return message.channel.send({ content: reply });
    }

    // //Execute command if everything is ok
    // try {
    //     command.run(message, args, client)
    // } catch (error) {
    //     console.error(error)
    //     message.reply("Something went wrong...")
    // }

    await command.run(message, args, client)?.catch((error) => {
      console.error(error);
      message.channel.send({
        content: `An error has accured, the devs have been notified.`,
      });
    });
  });
};
