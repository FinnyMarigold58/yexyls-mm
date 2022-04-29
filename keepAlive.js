//Import webserver requrements
const express = require("express");
const app = express();
const port = 3000;

//When the server is opened respond with a message
app.get("/", (req, res) => res.send("Hello World!"));

//Start the server
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
