console.log("🔔 Incoming Slack event:", req.body);

const express = require("express");
const router = express.Router();
const { searchJira } = require("../services/jira");
const { extractKeywords } = require("../services/openai");
const { postSearchResults } = require("../services/slack");

router.post("/", async (req, res) => {
  const { type, challenge, event } = req.body;

  if (type === "url_verification") {
    return res.send({ challenge });
  }

  if (event && event.type === "app_mention") {
    const userText = event.text.replace(/<@[^>]+>/, "").trim();
    const channel = event.channel;
    const threadTs = event.thread_ts || event.ts;

    try {
      const keywords = await extractKeywords(userText);
      const issues = await searchJira(keywords);
      await postSearchResults(issues, channel, threadTs);
    } catch (err) {
      console.error("❌ Error handling mention:", err);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
