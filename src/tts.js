const say = require("say");

/**
 * Speak the given text aloud using the system TTS engine.
 * @param {string} text  - Text to speak.
 * @param {string} [voice] - Optional voice name (platform-dependent).
 * @param {number} [speed] - Speech rate (1.0 = normal).
 * @returns {Promise<void>}
 */
function speak(text, voice, speed) {
  return new Promise((resolve, reject) => {
    say.speak(text, voice || null, speed || 1.0, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Stop any speech currently in progress.
 */
function stop() {
  say.stop();
}

module.exports = { speak, stop };
