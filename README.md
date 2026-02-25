# Smart Mirror – Tony AI

A Node.js smart mirror application with **voice (TTS + speech recognition)**, **camera**, and **Tony AI** integration, built for Tony Al.

## Features

- **Live camera feed** – streams the device camera directly onto the mirror display via the browser MediaDevices API.
- **Text-to-Speech (TTS)** – type any message and have the mirror speak it aloud using the system speech engine (powered by the `say` npm package).
- **Voice input** – Web Speech API voice capture for hands-free commands (for example: “What’s the weather?”).
- **Tony AI chat route** – backend route forwards text/voice commands to OpenClaw and returns Tony responses.
- **Mirror display widgets** – real-time clock, date, calendar, weather, news, and Tony status.
- **REST API** – simple endpoints for display data, camera constraints, and TTS control.
- **Dark mirror UI** – full-screen, black-background interface designed for two-way mirror setups.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | 16 or later |
| npm         | 8 or later  |
| A camera    | USB webcam or Raspberry Pi Camera Module |
| Speakers    | For TTS audio output |

> **Raspberry Pi users:** make sure the camera is enabled (`sudo raspi-config` → Interface Options → Camera) and that a speaker or headphones are connected.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/JeremyLakeyJr/smart-mirror.git
cd smart-mirror

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open **http://localhost:3000** in a Chromium-based browser (camera access requires a secure context or localhost).

## Project Structure

```
smart-mirror/
├── server.js            # Express server & API routes
├── src/
│   ├── tts.js           # Text-to-speech module (say)
│   ├── camera.js        # Camera constraints helper
│   └── display.js       # Display widget helpers (greeting, date, time)
├── public/
│   ├── index.html       # Mirror UI
│   ├── css/style.css    # Dark theme styles
│   └── js/app.js        # Client-side camera, TTS & display logic
├── test/
│   └── test.js          # Basic module tests
├── package.json
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/display` | Returns greeting, date, and time JSON |
| GET    | `/api/heartbeat` | Returns calendar, weather, news, and proactive data payload |
| GET    | `/api/camera/constraints` | Returns MediaStream constraints for the client |
| POST   | `/api/tony/chat` | Sends text command to Tony via OpenClaw |
| GET    | `/api/tony/greeting` | Returns Tony greeting used for face-detection trigger |
| GET    | `/api/tony/proactive` | Returns proactive Tony status update text |
| POST   | `/api/tts/speak` | Speaks the provided `text` (JSON body: `{ "text": "Hello" }`) |
| POST   | `/api/tts/stop` | Stops any speech in progress |

### OpenClaw Configuration

Set the following environment variables before starting the server:

```bash
export OPENCLOW_API_KEY="your-openclaw-api-key"
export OPENCLOW_API_URL="https://api.openclaw.ai/v1/chat/completions" # optional
export OPENCLOW_MODEL="tony" # optional
```

If `OPENCLOW_API_KEY` is missing, Tony chat requests return an error response.

## Dependencies

- **[express](https://expressjs.com/)** – lightweight web server
- **[say](https://github.com/Marak/say.js)** – cross-platform text-to-speech

## Running Tests

```bash
npm test
```

## Hardware Setup (Optional)

For a physical smart mirror build:

1. **Two-way mirror glass** – placed in front of the LCD panel.
2. **LCD screen** – mounted behind the mirror.
3. **Raspberry Pi** (or any machine running Node.js) – drives the application.
4. **USB webcam / Pi Camera** – for the live camera feed.
5. **Speakers / 3.5 mm audio** – for TTS output.

### Raspberry Pi Camera + Audio Notes

- Enable camera support with `sudo raspi-config` (Interface Options).
- For Pi Camera Module on Bullseye/Bookworm, ensure `libcamera` is installed and camera works with `libcamera-hello`.
- Confirm default audio output using `aplay -l` and configure output (HDMI/3.5mm) with `raspi-config` or `amixer`.

### Kiosk Auto-Start on Raspberry Pi

Use a systemd service to launch the app at boot:

```ini
# /etc/systemd/system/smart-mirror.service
[Unit]
Description=Smart Mirror Node App
After=network.target

[Service]
WorkingDirectory=/home/pi/smart-mirror
ExecStart=/usr/bin/npm start
Restart=always
Environment=OPENCLOW_API_KEY=your-key
User=pi

[Install]
WantedBy=multi-user.target
```

Then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable smart-mirror
sudo systemctl start smart-mirror
```

### Security / Privacy

- API routes support optional token auth with `MIRROR_API_TOKEN`. When set, send `x-mirror-token` header on API calls.
- Keep the mirror on a trusted local network whenever possible.

## License

MIT
