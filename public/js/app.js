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

// Refresh every second for the clock
setInterval(refreshDisplay, 1000);
refreshDisplay();

// --- Camera feed ---
async function initCamera() {
  try {
    const res = await fetch("/api/camera/constraints");
    const constraints = await res.json();
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById("camera").srcObject = stream;
  } catch (err) {
    console.error("Camera init failed:", err);
  }
}

initCamera();

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
