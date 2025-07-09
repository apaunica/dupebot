const fetch = require("node-fetch");

async function extractKeywords(text) {
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that extracts short, useful keywords for bug de-duplication."
    },
    {
      role: "user",
      content: `Extract the key terms from this bug report to help search for duplicates:\n\n"${text}".\n\nOnly return comma-separated keywords.`
    }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.5,
      max_tokens: 60
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]?.message?.content) {
    console.error("❌ OpenAI response error:", data);
    throw new Error("OpenAI failed to return expected output");
  }

  const rawKeywords = data.choices[0].message.content;
  return rawKeywords.split(",").map(k => k.trim()).filter(Boolean);
}

module.exports = { extractKeywords };
