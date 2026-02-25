const express = require("express");
const path = require("path");
const tts = require("./src/tts");
const camera = require("./src/camera");
const display = require("./src/display");
const tony = require("./src/tony");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML / CSS / JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Optional API token auth when exposed beyond local network
app.use("/api", (req, res, next) => {
  const expectedToken = process.env.MIRROR_API_TOKEN;
  if (!expectedToken) return next();
  if (req.get("x-mirror-token") !== expectedToken) {
    return res.status(401).json({ error: "unauthorized" });
  }
  return next();
});

// --- API routes ---

// Display data (greeting, date, time)
app.get("/api/display", (_req, res) => {
  try {
    res.json({
      greeting: display.getGreeting("Tony"),
      date: display.getDate(),
      time: display.getTime(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Camera constraints for the client
app.get("/api/camera/constraints", (_req, res) => {
  try {
    res.json(camera.getConstraints());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/heartbeat", (_req, res) => {
  res.json({
    calendar: [{ title: "No upcoming events", time: "--:--" }],
    weather: { summary: "Weather unavailable", temperature: "--" },
    news: [{ title: "No headlines available yet" }],
    proactive: null,
  });
});

app.post("/api/tony/chat", async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });

  try {
    const response = await tony.chat(text);
    return res.json({ response });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
});

app.get("/api/tony/greeting", (_req, res) => {
  try {
    res.json({ message: "Tony says: Welcome back." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/tony/proactive", (_req, res) => {
  try {
    res.json({ message: "Tony says: No new alerts right now." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Text-to-speech: speak provided text
app.post("/api/tts/speak", async (req, res) => {
  const { text, voice, speed } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });
  try {
    await tts.speak(text, voice, speed);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Text-to-speech: stop speaking
app.post("/api/tts/stop", (_req, res) => {
  tts.stop();
  res.json({ ok: true });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Smart Mirror running at http://localhost:${PORT}`);
  });
}

module.exports = app;
