#!/usr/bin/env node
/**
 * Script Node.js para automatizar Gemini CLI usando node-pty
 * Detecta "Allow execution of:" y responde automáticamente
 */

import { spawn } from 'node-pty';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const AUTO_RESPONSE = process.env.GEMINI_AUTO_RESPONSE || '1'; // '1' = allow once, '2' = allow always
const MAX_TIMEOUT = 600000; // 10 minutos en milisegundos

/**
 * Ejecuta gemini CLI con un prompt y detecta/responde automáticamente a confirmaciones
 */
function runGeminiWithAutoConfirm(prompt) {
  return new Promise((resolve, reject) => {
    let output = '';
    let hasResponded = false;
    let timeoutId = null;
    let exitCode = null;

    // Determinar el shell según el sistema operativo
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
    
    // Comando gemini
    const args = ['--yolo', prompt];
    
    // En Windows, necesitamos ejecutar gemini a través de cmd o powershell
    let command = 'gemini';
    if (isWindows) {
      // En Windows, ejecutamos gemini directamente (debe estar en PATH)
      command = 'gemini';
    }

    console.error(`[gemini-auto] Ejecutando: ${command} ${args.join(' ')}`);
    console.error(`[gemini-auto] Auto-respuesta configurada: ${AUTO_RESPONSE === '1' ? 'Allow once' : 'Allow always'}`);

    // Crear pseudo-terminal
    const ptyProcess = spawn(command, args, {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
      env: process.env,
      shell: isWindows
    });

    // Timeout global
    timeoutId = setTimeout(() => {
      if (!hasResponded || ptyProcess) {
        ptyProcess.kill();
        reject(new Error('Timeout: El proceso excedió 10 minutos'));
      }
    }, MAX_TIMEOUT);

    // Buffer para acumular líneas y detectar el prompt
    let lineBuffer = '';
    
    // Capturar salida
    ptyProcess.onData((data) => {
      output += data;
      lineBuffer += data;
      
      // Mostrar en tiempo real en stdout (para que se vea en la terminal)
      process.stdout.write(data);
      
      // Detectar "Allow execution of:" en cualquier parte del buffer
      // También detectar variaciones del mensaje
      const confirmationPatterns = [
        /Allow execution of:/i,
        /Waiting for user confirmation/i,
        /Do you want to allow/i,
        /Allow this execution/i
      ];
      
      const hasConfirmation = confirmationPatterns.some(pattern => pattern.test(lineBuffer));
      
      if (hasConfirmation && !hasResponded) {
        hasResponded = true;
        // Mensaje de debug en stderr para que no interfiera con la salida
        process.stderr.write(`\n[gemini-auto] Detectada confirmación, respondiendo con: ${AUTO_RESPONSE}\n`);
        
        // Enviar respuesta automática después de un pequeño delay
        setTimeout(() => {
          ptyProcess.write(AUTO_RESPONSE + '\r\n');
        }, 200); // Delay para asegurar que el prompt esté listo
      }
      
      // Limpiar buffer periódicamente para evitar acumulación excesiva
      if (lineBuffer.length > 10000) {
        lineBuffer = lineBuffer.slice(-5000); // Mantener solo los últimos 5000 caracteres
      }
    });

    // Manejar fin del proceso
    ptyProcess.onExit((exitInfo) => {
      exitCode = exitInfo.exitCode;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // La salida ya se mostró en tiempo real, solo retornar el resultado
      if (exitCode === 0 || exitCode === null) {
        resolve({ output: output.trim(), exitCode: exitCode || 0 });
      } else {
        reject(new Error(`Gemini CLI falló con código: ${exitCode}`));
      }
    });

    // Manejar errores
    ptyProcess.on('error', (error) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      reject(error);
    });
  });
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Uso: node gemini-auto.js "<prompt>"');
    console.error('O: node gemini-auto.js --json <ruta-json>');
    process.exit(1);
  }

  try {
    let prompts = [];

    // Si se pasa --json, leer el archivo JSON
    if (args[0] === '--json' && args[1]) {
      const jsonPath = args[1];
      if (!existsSync(jsonPath)) {
        console.error(`Error: No se encontró el archivo JSON: ${jsonPath}`);
        process.exit(1);
      }

      const jsonContent = readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(jsonContent);

      if (data.prompts) {
        prompts = Array.isArray(data.prompts) ? data.prompts : [data.prompts];
      } else if (data.prompt) {
        prompts = [data.prompt];
      } else {
        console.error('Error: El JSON debe contener "prompt" o "prompts"');
        process.exit(1);
      }
    } else {
      // Prompt directo
      prompts = [args.join(' ')];
    }

    // Procesar cada prompt
    for (const prompt of prompts) {
      console.error(`\n==================================================`);
      console.error(`Prompt: ${prompt.substring(0, 100)}...`);
      console.error(`--------------------------------------------------\n`);

      try {
        const result = await runGeminiWithAutoConfirm(prompt);
        // La salida ya se mostró en tiempo real, solo confirmar éxito
        if (result.exitCode === 0) {
          console.error(`\n[gemini-auto] Comando ejecutado exitosamente`);
        }
      } catch (error) {
        console.error(`\n[gemini-auto] Error: ${error.message}`);
        process.exit(1);
      }
    }

    console.error(`\n==================================================`);
    console.error(`Proceso completado!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar main si el script se ejecuta directamente
main().catch((error) => {
  console.error(`Error fatal: ${error.message}`);
  process.exit(1);
});

export { runGeminiWithAutoConfirm };

