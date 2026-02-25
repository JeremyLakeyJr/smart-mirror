/* Smart Mirror client-side logic */

// --- Display widgets ---
async function refreshDisplay() {
  try {
    const res = await fetch("/api/display");
    const data = await res.json();
    document.getElementById("greeting").textContent = data.greeting;
    document.getElementById("date").textContent = data.date;
    document.getElementById("time").textContent = data.time;
  } catch (err) {
    console.error("Display refresh failed:", err);
  }
}

function setTonyResponse(message) {
  document.getElementById("tony-response").textContent = message;
}

// Refresh every second for the clock
setInterval(refreshDisplay, 1000);
refreshDisplay();

// --- Camera feed ---
async function initCamera() {
  try {
    const res = await fetch("/api/camera/constraints");
    const constraints = await res.json();
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const camera = document.getElementById("camera");
    camera.srcObject = stream;
    initFaceGreeting(camera);
  } catch (err) {
    console.error("Camera init failed:", err);
  }
}

initCamera();

async function sendTonyText(text) {
  if (!text) return;
  try {
    const res = await fetch("/api/tony/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setTonyResponse(`Tony says: ${data.response || data.error || "No response."}`);
  } catch (err) {
    console.error("Tony request failed:", err);
    setTonyResponse("Tony says: I could not process that request.");
  }
}

async function refreshHeartbeatWidgets() {
  try {
    const res = await fetch("/api/heartbeat");
    const data = await res.json();
    document.getElementById("calendar-list").innerHTML = (data.calendar || [])
      .map((item) => `<li>${item.time || ""} ${item.title || ""}</li>`)
      .join("");
    document.getElementById("weather-text").textContent = `${data.weather?.summary || ""} ${data.weather?.temperature || ""}`.trim();
    document.getElementById("news-list").innerHTML = (data.news || [])
      .map((item) => `<li>${item.title || ""}</li>`)
      .join("");
  } catch (err) {
    console.error("Heartbeat refresh failed:", err);
  }
}

setInterval(refreshHeartbeatWidgets, 60000);
refreshHeartbeatWidgets();

async function refreshProactiveUpdate() {
  try {
    const res = await fetch("/api/tony/proactive");
    const data = await res.json();
    if (data.message) setTonyResponse(data.message);
  } catch (err) {
    console.error("Proactive update failed:", err);
  }
}

setInterval(refreshProactiveUpdate, 45000);

function initVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    document.getElementById("tts-input").value = transcript;
    sendTonyText(transcript);
  };

  document.getElementById("voice-listen").addEventListener("click", () => recognition.start());
}

function initFaceGreeting(videoEl) {
  if (!("FaceDetector" in window) || !videoEl) return;
  const detector = new FaceDetector();
  let lastGreetingAt = 0;

  setInterval(async () => {
    try {
      const faces = await detector.detect(videoEl);
      if (!faces.length || Date.now() - lastGreetingAt < 30000) return;
      const res = await fetch("/api/tony/greeting");
      const data = await res.json();
      if (data.message) {
        setTonyResponse(data.message);
        lastGreetingAt = Date.now();
      }
    } catch (err) {
      console.error("Face greeting failed:", err);
    }
  }, 5000);
}

document.getElementById("tony-send").addEventListener("click", async () => {
  const text = document.getElementById("tts-input").value.trim();
  await sendTonyText(text);
});

initVoiceInput();

// --- TTS controls ---
document.getElementById("tts-speak").addEventListener("click", async () => {
  const text = document.getElementById("tts-input").value.trim();
  if (!text) return;
  try {
    await fetch("/api/tts/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("TTS speak failed:", err);
  }
});

document.getElementById("tts-stop").addEventListener("click", async () => {
  try {
    await fetch("/api/tts/stop", { method: "POST" });
  } catch (err) {
    console.error("TTS stop failed:", err);
  }
});
