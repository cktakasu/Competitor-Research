import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:8001";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const ARTIFACTS_DIR = path.join(PROJECT_ROOT, "artifacts");
const LOCAL_BROWSER_CANDIDATES = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
].filter(Boolean);

async function isServerUp(url) {
  try {
    const response = await fetch(url, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp(url)) {
      return true;
    }
    await delay(1000);
  }
  return false;
}

function startDevServer() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, ["run", "dev", "--", "-p", "8001"], {
    cwd: PROJECT_ROOT,
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[dev] ${chunk}`);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[dev] ${chunk}`);
  });

  return child;
}

async function resolveExecutablePath() {
  for (const candidate of LOCAL_BROWSER_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return undefined;
}

async function main() {
  await mkdir(ARTIFACTS_DIR, { recursive: true });

  let devServer = null;
  let startedHere = false;

  if (!(await isServerUp(BASE_URL))) {
    console.log(`[simulate] dev server not detected on ${BASE_URL}. starting...`);
    devServer = startDevServer();
    startedHere = true;
  } else {
    console.log(`[simulate] using existing dev server: ${BASE_URL}`);
  }

  const ready = await waitForServer(BASE_URL);
  if (!ready) {
    throw new Error(`server did not become ready: ${BASE_URL}`);
  }

  const executablePath = await resolveExecutablePath();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {})
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });

  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: `${ARTIFACTS_DIR}/simulate-home.png`, fullPage: true });

    const proceed = page.getByRole("link", { name: "Proceed to MCB configuration" });
    await proceed.click();
    await page.waitForURL(/\/mcb$/, { timeout: 30000 });

    await page.screenshot({ path: `${ARTIFACTS_DIR}/simulate-mcb.png`, fullPage: true });

    console.log(`[simulate] success: ${page.url()}`);
    console.log(`[simulate] screenshots:`);
    console.log(`  - ${ARTIFACTS_DIR}/simulate-home.png`);
    console.log(`  - ${ARTIFACTS_DIR}/simulate-mcb.png`);
  } finally {
    await browser.close();
    if (startedHere && devServer && !devServer.killed) {
      devServer.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  console.error(`[simulate] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
