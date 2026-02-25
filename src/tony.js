const http = require("http");
const https = require("https");

function requestJson(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === "https:" ? https : http;
    const body = JSON.stringify(payload);

    const req = transport.request(
      parsed,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const statusCode = res.statusCode || 500;
          let parsedData = {};
          if (data) {
            try {
              parsedData = JSON.parse(data);
            } catch {
              parsedData = { raw: data };
            }
          }
          if (statusCode < 200 || statusCode >= 300) {
            return reject(
              new Error(parsedData.error?.message || parsedData.error || "OpenClaw request failed")
            );
          }
          return resolve(parsedData);
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function chat(text) {
  const apiUrl = process.env.OPENCLOW_API_URL || "https://api.openclaw.ai/v1/chat/completions";
  const apiKey = process.env.OPENCLOW_API_KEY;
  if (!apiKey) {
    throw new Error("OpenClaw API key is not configured");
  }

  const payload = {
    model: process.env.OPENCLOW_MODEL || "tony",
    messages: [{ role: "user", content: text }],
  };

  const data = await requestJson(apiUrl, payload, { Authorization: `Bearer ${apiKey}` });
  return (
    data.choices?.[0]?.message?.content ||
    data.response ||
    data.reply ||
    "Tony did not return a response."
  );
}

module.exports = { chat };
