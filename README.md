# Smart Mirror – Tony AI

A Node.js smart mirror application with **voice (TTS)** and **camera** integration, built for Tony Al.

## Features

- **Live camera feed** – streams the device camera directly onto the mirror display via the browser MediaDevices API.
- **Text-to-Speech (TTS)** – type any message and have the mirror speak it aloud using the system speech engine (powered by the `say` npm package).
- **Mirror display widgets** – real-time clock, date, and personalised greeting.
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
| GET    | `/api/camera/constraints` | Returns MediaStream constraints for the client |
| POST   | `/api/tts/speak` | Speaks the provided `text` (JSON body: `{ "text": "Hello" }`) |
| POST   | `/api/tts/stop` | Stops any speech in progress |

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

## License

MIT