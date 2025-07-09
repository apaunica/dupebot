const fetch = require("node-fetch");

async function postSearchResults(issues, channel, thread_ts) {
  const token = process.env.SLACK_BOT_TOKEN;

  const text = issues.length
    ? issues.slice(0, 5).map(i => `• <${process.env.JIRA_BASE_URL}/browse/${i.key}|${i.key}>: ${i.fields.summary}`).join("\n")
    : "_No similar bugs found in Jira._";

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      channel,
      thread_ts,
      text: `🔍 *Possible Jira matches:*\n${text}`
    })
  });
}

module.exports = { postSearchResults };
