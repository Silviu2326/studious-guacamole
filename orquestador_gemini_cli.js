// orquestador_gemini_cli.js  (ESM)

import { spawn } from "child_process";
import fs from "fs";
import os from "os";

const cfg = JSON.parse(
  fs.readFileSync(new URL("./prompts.json", import.meta.url), "utf8")
);

const { projectRoot, model, prompts } = cfg;

// Tiempo máximo sin actividad por prompt (ms)
const TIMEOUT_MS = 10 * 60 * 1000;

console.log("🔥 Orquestador Gemini CLI iniciado");
console.log("📁 Proyecto:", projectRoot);
console.log("🧠 Modelo:  ", model);
console.log("🧾 Prompts: ", prompts.length);
console.log("");

// Función que ejecuta UN prompt con un proceso de gemini
function runPrompt(item, index, total) {
  return new Promise((resolve) => {
    const text = item.text.replace(/\r?\n/g, " ");

    console.log(`\n==============================`);
    console.log(`👉 Ejecutando [${index + 1}/${total}]: ${item.name}`);
    console.log(`==============================\n`);

    // Lanzamos gemini con --prompt
    const child = spawn(
      "gemini",
      ["--model", model, "--prompt", text],
      {
        cwd: projectRoot,
        shell: true,                 // importante en Windows
        stdio: ["pipe", "pipe", "pipe"]
      }
    );

    let buffer = "";
    let lastActivity = Date.now();

    const handleData = (data) => {
      const out = data.toString("utf8");
      process.stdout.write(out);    // lo ves en tu consola
      buffer += out;
      lastActivity = Date.now();

      // Detectar: Allow execution of: 'find'? / 'move'? etc.
      const mAllow = buffer.match(/Allow execution of:\s*'([^']+)'/);
      if (mAllow) {
        const cmd = mAllow[1];
        console.log(`\n🤖 Auto-permitiendo comando de shell: ${cmd}\n`);

        // 1 = Yes, allow once
        // 2 = Yes, allow always...
        child.stdin.write("1" + os.EOL);   // cambia a "2" si quieres "always"

        buffer = "";
        return;
      }

      // Mensajes tipo "Press Enter to continue"
      if (/Press Enter to continue/i.test(buffer)) {
        console.log("\n🤖 Auto-Enter\n");
        child.stdin.write(os.EOL);
        buffer = "";
        return;
      }

      // Mensajes tipo "Continue anyway? [y/n]"
      if (/Continue anyway\? \[y\/n]/i.test(buffer)) {
        console.log("\n🤖 Auto-continuar (y)\n");
        child.stdin.write("y" + os.EOL);
        buffer = "";
        return;
      }
    };

    child.stdout.on("data", handleData);
    child.stderr.on("data", handleData);

    // Watchdog de cuelgues (por prompt)
    const timer = setInterval(() => {
      const diff = Date.now() - lastActivity;
      if (diff > TIMEOUT_MS) {
        console.error(
          `\n⏱️ Sin actividad durante más de ${TIMEOUT_MS / 60000} minutos en '${item.name}'. Matando proceso...\n`
        );
        child.kill();
      }
    }, 5000);

    child.on("exit", (code) => {
      clearInterval(timer);
      console.log(`\n👋 Proceso gemini para '${item.name}' terminó con código ${code}\n`);
      resolve();
    });
  });
}

// Ejecutar todos los prompts en secuencia
(async () => {
  for (let i = 0; i < prompts.length; i++) {
    const item = prompts[i];
    await runPrompt(item, i, prompts.length);
  }
  console.log("\n✅ Todos los prompts procesados.\n");
})();
