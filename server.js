const express = require("express");
const path = require("path");
const tts = require("./src/tts");
const camera = require("./src/camera");
const display = require("./src/display");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML / CSS / JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --- API routes ---

// Display data (greeting, date, time)
app.get("/api/display", (_req, res) => {
  res.json({
    greeting: display.getGreeting("Tony"),
    date: display.getDate(),
    time: display.getTime(),
  });
});

// Camera constraints for the client
app.get("/api/camera/constraints", (_req, res) => {
  res.json(camera.getConstraints());
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
