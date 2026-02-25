/**
 * Camera module.
 *
 * On the server side this module simply provides configuration and a helper
 * that returns the URL clients should use to display the camera feed.
 *
 * The actual camera stream is obtained in the browser via the MediaDevices API
 * (getUserMedia) — no server-side camera library is needed for the basic feed.
 */

const DEFAULT_CONSTRAINTS = {
  video: { width: 640, height: 480, facingMode: "user" },
  audio: false,
};

/**
 * Return the MediaStream constraints the client should use.
 */
function getConstraints() {
  return DEFAULT_CONSTRAINTS;
}

module.exports = { getConstraints };
