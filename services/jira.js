const fetch = require("node-fetch");

const JIRA_BASE = process.env.JIRA_BASE_URL;
const JIRA_AUTH = "Basic " + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString("base64");

async function searchJira(keywords) {
  const jql = `summary ~ "${keywords}" AND statusCategory != Done ORDER BY created DESC`;
  const response = await fetch(`${JIRA_BASE}/rest/api/3/search?jql=${encodeURIComponent(jql)}`, {
    headers: {
      Authorization: JIRA_AUTH,
      Accept: "application/json"
    }
  });

  const data = await response.json();
  return data.issues || [];
}

module.exports = { searchJira };
