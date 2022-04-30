const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");

module.exports = {
  name: "eval",
  description: "Run some code lines.",
  usage: `eval <code...>`,
  run: async (message, args, client) => {
    if (message.content.includes("TOKEN"))
      return await message.channel.send({
        content: "Trying to get token, aren't you? 😏",
      });
    if (!["263472056753061889"].includes(message.author.id)) return;
    try {
      if (!args[0]) return message.channel.send("undefined", { code: "js" });

      let codeArr = args.slice(0).join(" ").split("\n");
      if (!codeArr[codeArr.length - 1].startsWith("return"))
        codeArr[codeArr.length - 1] = `return ${codeArr[codeArr.length - 1]}`;

      const code = `async () => { ${codeArr.join("\n")} }`;

      let out = await eval(code)();
      if (typeof out !== "string") out = require("util").inspect(out);
      out = out.replace(process.env.TOKEN, "[TOKEN REDACTED]");

      message.channel.send({ content: `Typeof output: **${typeof out}**` });
      message.channel.send({
        content: `\`\`\`js\n${out ? out.slice(0, 2000) : "null"}\n\`\`\``,
      });
    } catch (err) {
      message.channel.send({
        content: "An error occurred when trying to execute this command.",
      });
      console.log(err);
      return message.channel.send({ content: `\`\`\`js\n${err}\`\`\`` });
    }
  },
};
