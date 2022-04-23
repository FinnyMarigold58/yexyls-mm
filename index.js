console.log("Booting...");
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const client = new Client({ intents: ["GUILDS"] });
const token = process.env.TOKEN;
const fs = require("fs");

const db = require("quick.db");
client.db = db;

client.commands = new Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  for (file in files) {
    let f = files[file];
    fs.readdir(`./commands/${f}`, (err, files) => {
      if (err) return console.error(err);
      files = files.filter((f) => f.split(".").pop() === "js");
      if (files.length === 0) return console.log(`No commands in ${f}`);
      console.log(`Found ${files.length} commands in ${f}`);
      for (fi in files) {
        let fi = files[fi];
        let props = require(`./commands/${f}/${fi}`);
        client.commands.set(props.command.name, props);
      }
    });
  }
});

fs.readdir(`./events/`, (err, files) => {
  for (file in files) {
    let event = files[file];
    require(`./events/${event}`)(client);
  }
});

client.login(token);

client.on("ready", () => {
  console.log(`Logged into: ${client.user.tag}`);
});
