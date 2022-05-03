console.log("Booting...");

//Requirements
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});
const token = process.env.TOKEN;
const fs = require("fs");

//Keepalive for repl.it
require("./keepAlive.js");

//Database
const db = require("quick.db");
client.db = db;

//Commands
client.commands = new Collection();
fs.readdir("./commands/", (err, files) => {
  files.forEach((file) => {
    let path = `./commands/${file}`;
    fs.readdir(path, (err, files) => {
      if (err) console.error(err);
      let jsfile = files.filter((f) => f.split(".").pop() === "js");
      if (jsfile.length <= 0) {
        console.error(`Couldn't find commands in the ${file} category.`);
        return;
      }
      jsfile.forEach((f, i) => {
        let props = require(`./commands/${file}/${f}`);
        props.category = file;
        try {
          client.commands.set(props.name, props);
          if (props.aliases)
            props.aliases.forEach((alias) => client.commands.set(alias, props));
        } catch (err) {
          if (err) console.error(err);
        }
      });
    });
  });
});

client.slashCommands = new Collection();
fs.readdir("./slashCommands/", (err, files) => {
  if (err) console.error(err);
  let jsfile = files.filter((f) => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find slash commands.");
  }
  jsfile.forEach((f, i) => {
    let props = require(`./slashCommands/${f}`);
    console.log(`Loaded slash command ${f}`);
    client.slashCommands.set(props.command.name, props);
  });
});

//Events
fs.readdir(`./events/`, (err, files) => {
  for (file in files) {
    let event = files[file];
    require(`./events/${event}`)(client);
  }
});

//Log into Discord Bot
client.login(token);

//Run when bot is ready
client.on("ready", () => {
  console.log(`Logged into: ${client.user.tag}`);

  // Update slash commands
  const cmds = [];
  client.slashCommands.forEach((props) => {
    cmds.push(props.command);
  });

  // client.guilds
  //   .fetch("911173629427978311")
  //   .then((guild) => {
  //     guild.commands.set(cmds);
  //   })
  //   .then(console.log);

  // client.application.commands.set(cmds).then(console.log);
});

if (process.env.DEBUG == true) client.on("debug", console.log);

console.log("Booted!");
