const fetch = require("node-fetch");

async function extractKeywords(text) {
  const HOST = "https://corp-prod-eadp-ai-llm.data.ea.com/deepseek-r1-distill";

  const response = await fetch(`${HOST}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "", // <- if required, add model name or leave empty if default
      max_tokens: 1000,
      stream: false,
      messages: [
        {
          role: "user",
          content: `Extract the most relevant keywords from this bug report to help identify duplicates:\n\n"${text}"\n\nReturn a comma-separated list of keywords only.`
        }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]?.message?.content) {
    console.error("❌ EA LLM response error:", data);
    throw new Error("EA LLM did not return expected output");
  }

  const rawKeywords = data.choices[0].message.content;
  return rawKeywords.split(",").map(k => k.trim()).filter(Boolean);
}

module.exports = { extractKeywords };
