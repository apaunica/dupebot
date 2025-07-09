const fetch = require("node-fetch");

async function extractKeywords(text) {
  const prompt = `Extract key terms from this bug report to help search for duplicates:\n\n"${text}"\n\nOnly return key terms, comma-separated.`;

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      max_tokens: 60,
      temperature: 0.5,
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]?.text) {
    console.error("❌ OpenAI response error:", data);
    throw new Error("OpenAI failed to return expected output");
  }

  const rawKeywords = data.choices[0].text;
  return rawKeywords.split(",").map(k => k.trim()).filter(Boolean);
}

module.exports = { extractKeywords };
