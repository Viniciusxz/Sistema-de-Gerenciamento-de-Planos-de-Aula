import { spawn } from "node:child_process";

const API_URL = "http://127.0.0.1:3000/";
const children = [];
let isShuttingDown = false;

async function isApiRunning() {
  try {
    const response = await fetch(API_URL);
    return response.ok;
  } catch {
    return false;
  }
}

function startProcess(name, args) {
  const child = spawn(process.execPath, args, {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    console.log(`[${name}] finalizou com codigo ${code ?? signal}.`);
    shutdown(code ?? 1);
  });

  children.push(child);
}

function shutdown(code = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(typeof code === "number" ? code : 1);
}

if (await isApiRunning()) {
  console.log("[api] ja esta rodando em http://localhost:3000");
} else {
  startProcess("api", ["src/index.js"]);
}

startProcess("web", ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"]);

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
