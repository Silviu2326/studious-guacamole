#!/usr/bin/env node
/**
 * Script Node.js para automatizar Gemini CLI usando node-pty o child_process
 * Detecta "Allow execution of:" y responde automáticamente
 */

import { spawn as childSpawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

// Variable para almacenar la función spawn de node-pty si está disponible
let ptySpawn = null;

// Función para inicializar node-pty de forma asíncrona
async function initPty() {
  if (ptySpawn !== null) {
    return ptySpawn; // Ya inicializado
  }
  
  try {
    const pty = await import('node-pty');
    ptySpawn = pty.spawn;
    return ptySpawn;
  } catch (error) {
    console.error('[gemini-auto] node-pty no disponible, usando child_process como alternativa');
    ptySpawn = false; // Marcamos como no disponible
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const AUTO_RESPONSE = process.env.GEMINI_AUTO_RESPONSE || '1'; // '1' = allow once, '2' = allow always
const MAX_TIMEOUT = 600000; // 10 minutos en milisegundos

/**
 * Ejecuta gemini CLI con un prompt y detecta/responde automáticamente a confirmaciones
 */
async function runGeminiWithAutoConfirm(prompt) {
  // Intentar inicializar node-pty si aún no se ha hecho
  const ptySpawnFn = await initPty();
  const usePty = ptySpawnFn !== null && ptySpawnFn !== false;
  
  return new Promise((resolve, reject) => {
    let output = '';
    let hasResponded = false;
    let timeoutId = null;
    let exitCode = null;

    // Determinar el shell según el sistema operativo
    const isWindows = process.platform === 'win32';
    
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

    let process;

    if (usePty) {
      // Usar node-pty si está disponible
      process = ptySpawnFn(command, args, {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env,
        shell: isWindows
      });
    } else {
      // Usar child_process como alternativa
      process = childSpawn(command, args, {
        cwd: process.cwd(),
        env: process.env,
        shell: isWindows,
        stdio: ['pipe', 'pipe', 'pipe']
      });
    }

    // Timeout global
    timeoutId = setTimeout(() => {
      if (!hasResponded || process) {
        process.kill();
        reject(new Error('Timeout: El proceso excedió 10 minutos'));
      }
    }, MAX_TIMEOUT);

    // Buffer para acumular líneas y detectar el prompt
    let lineBuffer = '';
    
    // Función para procesar datos
    const processData = (data) => {
      const dataStr = data.toString();
      output += dataStr;
      lineBuffer += dataStr;
      
      // Mostrar en tiempo real en stdout (para que se vea en la terminal)
      process.stdout.write(dataStr);
      
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
          if (usePty) {
            process.write(AUTO_RESPONSE + '\r\n');
          } else {
            process.stdin.write(AUTO_RESPONSE + '\n');
          }
        }, 200); // Delay para asegurar que el prompt esté listo
      }
      
      // Limpiar buffer periódicamente para evitar acumulación excesiva
      if (lineBuffer.length > 10000) {
        lineBuffer = lineBuffer.slice(-5000); // Mantener solo los últimos 5000 caracteres
      }
    };
    
    // Capturar salida según el método usado
    if (usePty) {
      // node-pty usa onData
      process.onData(processData);
    } else {
      // child_process usa eventos estándar
      process.stdout.on('data', processData);
      process.stderr.on('data', processData);
    }

    // Manejar fin del proceso
    if (usePty) {
      process.onExit((exitInfo) => {
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
    } else {
      process.on('close', (code) => {
        exitCode = code;
        
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
    }

    // Manejar errores
    process.on('error', (error) => {
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

