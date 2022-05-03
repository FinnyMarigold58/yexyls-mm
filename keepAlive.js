//Import webserver requrements
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public/transcripts"));
//When the server is opened respond with a message
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/transcripts/:serverId/:ticketNumber", (req, res) => {
  res.sendFile(
    `${req.params.serverId}/${req.params.ticketNumber.split(".")[0]}.html`,
    {
      root: "./public/transcripts",
    }
  );
});

//Start the server
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
