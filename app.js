const express = require("express");
const bodyParser = require("body-parser");
const slackRoutes = require("./routes/slackEvents");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/slack/events", slackRoutes);

app.post("/", (req, res) => {
  console.log("🔥 Test endpoint hit!", req.body);
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`⚡ DupeBot is live on port ${PORT}`);
});
