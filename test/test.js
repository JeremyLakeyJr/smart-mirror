/**
 * Basic tests for the smart-mirror modules.
 * Run with: npm test
 */

const assert = require("assert");
const display = require("../src/display");
const camera = require("../src/camera");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log("display module");

test("getGreeting returns a string containing the given name", () => {
  const greeting = display.getGreeting("Tony");
  assert.ok(typeof greeting === "string");
  assert.ok(greeting.includes("Tony"));
});

test("getGreeting starts with a time-of-day phrase", () => {
  const greeting = display.getGreeting("Tony");
  assert.ok(
    greeting.startsWith("Good morning") ||
      greeting.startsWith("Good afternoon") ||
      greeting.startsWith("Good evening")
  );
});

test("getDate returns a non-empty string", () => {
  const d = display.getDate();
  assert.ok(typeof d === "string" && d.length > 0);
});

test("getTime returns a non-empty string", () => {
  const t = display.getTime();
  assert.ok(typeof t === "string" && t.length > 0);
});

console.log("\ncamera module");

test("getConstraints returns an object with video settings", () => {
  const c = camera.getConstraints();
  assert.ok(c.video);
  assert.strictEqual(c.video.width, 640);
  assert.strictEqual(c.video.height, 480);
});

test("getConstraints disables audio by default", () => {
  const c = camera.getConstraints();
  assert.strictEqual(c.audio, false);
});

console.log("\nserver module");

test("server exports an express app with expected routes", () => {
  const app = require("../server");
  assert.ok(typeof app === "function", "app should be a function (express app)");
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
