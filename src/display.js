/**
 * Display data module.
 *
 * Provides helper functions that return data for the mirror widgets
 * (clock, greeting, date, etc.).
 */

/**
 * Return a greeting based on the current hour.
 * @param {string} name - Name to greet.
 * @returns {string}
 */
function getGreeting(name) {
  const hour = new Date().getHours();
  let period;
  if (hour < 12) period = "Good morning";
  else if (hour < 18) period = "Good afternoon";
  else period = "Good evening";
  return `${period}, ${name}!`;
}

/**
 * Return the current date formatted as a readable string.
 * @returns {string}
 */
function getDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Return the current time as HH:MM:SS.
 * @returns {string}
 */
function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

module.exports = { getGreeting, getDate, getTime };
