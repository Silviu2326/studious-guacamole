# Script PowerShell para usar Gemini CLI en modo YOLO con un JSON de prompt
# Automatiza la respuesta a confirmaciones de ejecución usando PowerShell nativo
# Uso:
#   .\gemini_yolo_json.ps1
# Opcional: puedes pasar la ruta al JSON:
#   .\gemini_yolo_json.ps1 .\prompt.json
# Opcional: puedes configurar la auto-respuesta (1=once, 2=always):
#   $env:GEMINI_AUTO_RESPONSE="2"; .\gemini_yolo_json.ps1 .\prompt.json

Write-Host "[1/6] Iniciando script (YOLO + JSON con auto-confirmación)..." -ForegroundColor Cyan

# Obtener el directorio del script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptRoot = Split-Path -Parent $scriptDir

# Buscar el archivo .env en múltiples ubicaciones posibles
function Find-EnvFile {
    param([string]$startPath)
    
    $currentPath = $startPath
    $maxDepth = 5  # Limitar la búsqueda a 5 niveles hacia arriba
    $depth = 0
    
    while ($depth -lt $maxDepth) {
        $envPath = Join-Path $currentPath ".env"
        if (Test-Path $envPath) {
            return $envPath
        }
        
        $parentPath = Split-Path -Parent $currentPath
        if ($parentPath -eq $currentPath) {
            # Llegamos a la raíz del sistema
            break
        }
        $currentPath = $parentPath
        $depth++
    }
    
    return $null
}

# 1. Cargar variables de entorno desde .env si existe
Write-Host "[2/6] Cargando variables de entorno..." -ForegroundColor Cyan

# Buscar .env desde el directorio del script hacia arriba
$envPath = Find-EnvFile -startPath $scriptDir

if ($envPath) {
    Write-Host "  -> Archivo .env encontrado en: $envPath" -ForegroundColor Gray
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^#][^=]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "  -> Variables cargadas correctamente" -ForegroundColor Gray
} else {
    Write-Host "  -> Archivo .env no encontrado, usando variables de entorno del sistema" -ForegroundColor Gray
}

# 2. Verificar API Key
Write-Host "[3/6] Verificando API Key..." -ForegroundColor Cyan
if (-not $env:GEMINI_API_KEY) {
    Write-Host "Error: No se encontró la variable GEMINI_API_KEY" -ForegroundColor Red
    Write-Host "Por favor, crea un archivo .env en la raiz y añade: GEMINI_API_KEY=tu_clave_aqui" -ForegroundColor Yellow
    Write-Host "   O establece la variable: `$env:GEMINI_API_KEY='tu_clave_aqui'" -ForegroundColor Yellow
    exit 1
}
Write-Host "  -> API Key encontrada" -ForegroundColor Gray

# 3. Obtener ruta del JSON
$JsonPath = Join-Path $scriptDir "prompt.json"
if ($args.Count -ge 1) {
    # Si se pasa una ruta como argumento, usar esa (puede ser absoluta o relativa al directorio actual)
    $userPath = $args[0]
    if ([System.IO.Path]::IsPathRooted($userPath)) {
        $JsonPath = $userPath
    } else {
        # Intentar primero como ruta relativa al directorio actual
        $JsonPath = Join-Path (Get-Location) $userPath
        if (-not (Test-Path $JsonPath)) {
            # Si no existe, intentar como ruta relativa al directorio del script
            $JsonPath = Join-Path $scriptDir $userPath
        }
    }
}

# Verificar que el archivo existe
if (-not (Test-Path $JsonPath)) {
    Write-Host "Error: No se encontró el archivo JSON" -ForegroundColor Red
    if ($args.Count -ge 1) {
        Write-Host "  -> Ruta proporcionada: $($args[0])" -ForegroundColor Yellow
    } else {
        Write-Host "  -> Ruta esperada por defecto: $(Join-Path $scriptDir 'prompt.json')" -ForegroundColor Yellow
    }
    Write-Host "  -> Ruta resuelta: $JsonPath" -ForegroundColor Yellow
    exit 1
}

# Resolver la ruta completa para mostrar la ruta absoluta
$JsonPath = Resolve-Path $JsonPath

Write-Host "[4/6] Leyendo JSON de prompt..." -ForegroundColor Cyan
Write-Host "  -> Archivo: $JsonPath" -ForegroundColor Gray

try {
    $jsonContent = Get-Content $JsonPath -Raw
    $data = $jsonContent | ConvertFrom-Json
} catch {
    Write-Host "Error al leer o parsear el JSON: $_" -ForegroundColor Red
    exit 1
}

# Soportar múltiples formatos:
#  - { "prompt": "texto" }
#  - { "prompts": ["texto1", "texto2", ...] }
#  - { "prompts": [{"id": "...", "prompt": "texto"}, ...] }
$prompts = @()
$promptMetadata = @()

if ($data.prompts) {
    # Verificar si es un array de objetos con propiedad 'prompt'
    $firstItem = $data.prompts[0]
    if ($firstItem -and $firstItem.GetType().Name -eq "PSCustomObject" -and $firstItem.prompt) {
        # Formato: array de objetos con id y prompt
        $index = 0
        foreach ($item in $data.prompts) {
            if ($item.prompt) {
                $index++
                $prompts += $item.prompt
                $promptMetadata += @{
                    id = if ($item.id) { $item.id } else { "prompt_$index" }
                    prompt = $item.prompt
                }
            }
        }
    } else {
        # Formato: array de strings
        $prompts = @($data.prompts)
        for ($i = 0; $i -lt $prompts.Count; $i++) {
            $promptMetadata += @{
                id = "prompt_$($i + 1)"
                prompt = $prompts[$i]
            }
        }
    }
} elseif ($data.prompt) {
    # Formato: string simple
    $prompts = @($data.prompt)
    $promptMetadata += @{
        id = "prompt_1"
        prompt = $data.prompt
    }
} else {
    Write-Host "Error: El JSON debe contener 'prompt' o 'prompts'" -ForegroundColor Red
    exit 1
}

Write-Host "  -> Prompts cargados: $($prompts.Count)" -ForegroundColor Gray
for ($i = 0; $i -lt $promptMetadata.Count; $i++) {
    $meta = $promptMetadata[$i]
    Write-Host "     [$($meta.id)] $(if ($meta.prompt.Length -gt 60) { $meta.prompt.Substring(0, 60) + '...' } else { $meta.prompt })" -ForegroundColor DarkGray
}
Write-Host ""

# 4. Verificar Gemini CLI
Write-Host "[5/6] Verificando Gemini CLI..." -ForegroundColor Cyan
$geminiCmd = Get-Command gemini -ErrorAction SilentlyContinue
if (-not $geminiCmd) {
    Write-Host "Error: Gemini CLI no está instalado" -ForegroundColor Red
    Write-Host "Instala Gemini CLI con: npm install -g @google/gemini-cli" -ForegroundColor Yellow
    exit 1
}
Write-Host "  -> Gemini CLI encontrado en: $($geminiCmd.Source)" -ForegroundColor Gray

# 5. Configurar auto-respuesta
Write-Host "[6/6] Configurando auto-confirmación..." -ForegroundColor Cyan
$autoResponse = if ($env:GEMINI_AUTO_RESPONSE) { $env:GEMINI_AUTO_RESPONSE } else { "1" }
Write-Host "  -> Auto-respuesta configurada: $autoResponse (1=once, 2=always)" -ForegroundColor Gray
Write-Host ""

# Función para ejecutar gemini con auto-confirmación
function Invoke-GeminiWithAutoConfirm {
    param(
        [string]$Prompt,
        [string]$AutoResponse = "1"
    )
    
    # Crear proceso de gemini
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "gemini"
    $psi.Arguments = "--yolo --model gemini-3-pro-preview --prompt `"$Prompt`""
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.RedirectStandardInput = $true
    $psi.CreateNoWindow = $true
    $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi

    # Buffer para acumular salida y detectar confirmaciones
    $outputBuffer = New-Object System.Text.StringBuilder
    $hasResponded = $false
    $responseValue = $AutoResponse  # Capturar en variable local para el closure

    # Evento para capturar salida estándar
    $outputHandler = {
        param($sender, $e)
        $line = $e.Data
        if ($line) {
            [void]$outputBuffer.AppendLine($line)
            Write-Host $line
        
            # Detectar confirmación en la línea actual
            if (-not $hasResponded) {
                if ($line -match "Allow execution of:" -or $line -match "Waiting for user confirmation") {
                    $script:hasResponded = $true
                    Start-Sleep -Milliseconds 300
                    try {
                        $process.StandardInput.WriteLine($responseValue)
                        $process.StandardInput.Flush()
                        Write-Host "[Auto-confirmación] Respondiendo con: $responseValue" -ForegroundColor DarkGray
                    } catch {
                        Write-Host "[Error] No se pudo enviar respuesta: $_" -ForegroundColor Yellow
                    }
                }
            }
        }
    }

    # Evento para capturar errores
    $errorHandler = {
        param($sender, $e)
        $line = $e.Data
        if ($line) {
            [void]$outputBuffer.AppendLine($line)
            Write-Host $line -ForegroundColor Yellow
        }
    }

    # Registrar eventos
    $process.add_OutputDataReceived($outputHandler)
    $process.add_ErrorDataReceived($errorHandler)

    # Iniciar proceso
    try {
        $process.Start() | Out-Null
        $process.BeginOutputReadLine()
        $process.BeginErrorReadLine()
    } catch {
        Write-Host "Error al iniciar gemini: $_" -ForegroundColor Red
        return 1
    }

    # Esperar con timeout y verificar confirmaciones periódicamente
    $timeout = 600000  # 10 minutos en milisegundos
    $elapsed = 0
    $checkInterval = 200  # milisegundos

    while (-not $process.HasExited -and $elapsed -lt $timeout) {
        Start-Sleep -Milliseconds $checkInterval
        $elapsed += $checkInterval
        
        # Verificar si hay confirmaciones en el buffer acumulado
        if (-not $hasResponded) {
            $bufferContent = $outputBuffer.ToString()
            if ($bufferContent -match "Allow execution of:" -or $bufferContent -match "Waiting for user confirmation") {
                $hasResponded = $true
                Start-Sleep -Milliseconds 300
                try {
                    $process.StandardInput.WriteLine($responseValue)
                    $process.StandardInput.Flush()
                    Write-Host "[Auto-confirmación] Respondiendo con: $responseValue" -ForegroundColor DarkGray
                } catch {
                    Write-Host "[Error] No se pudo enviar respuesta: $_" -ForegroundColor Yellow
                }
            }
        }
    }

    if (-not $process.HasExited) {
        $process.Kill()
        Write-Host "Timeout: El proceso excedió 10 minutos" -ForegroundColor Red
        return 1
    }

    $exitCode = $process.ExitCode
    $process.WaitForExit()
    $process.Dispose()

    return $exitCode
}

for ($i = 0; $i -lt $prompts.Count; $i++) {
    $Prompt = $prompts[$i]
    $meta = $promptMetadata[$i]
    $promptId = $meta.id
    
    Write-Host "==================================================" -ForegroundColor DarkGray
    Write-Host "Prompt [$promptId]:" -ForegroundColor Green
    Write-Host $Prompt
    Write-Host "--------------------------------------------------"

    try {
        # Ejecutar gemini con auto-confirmación usando PowerShell nativo
        $exitCode = Invoke-GeminiWithAutoConfirm -Prompt $Prompt -AutoResponse $autoResponse
        
        if ($exitCode -eq 0 -or $exitCode -eq $null) {
            Write-Host ""
            Write-Host "  -> Comando ejecutado exitosamente [$promptId]" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Error: El comando falló con código de salida: $exitCode [$promptId]" -ForegroundColor Red
            
            # Guardar prompt fallido (error de ejecución)
            $failedLog = Join-Path $scriptDir "failed_prompts.json"
            $failedData = @()
            if (Test-Path $failedLog) {
                try {
                    $content = Get-Content $failedLog -Raw
                    if ($content) { $failedData = @($content | ConvertFrom-Json) }
                } catch {}
            }
            $failedData += @{ id = $promptId; prompt = $Prompt; reason = "Execution Error (ExitCode: $exitCode)"; timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") }
            $failedData | ConvertTo-Json -Depth 4 | Set-Content $failedLog -Encoding UTF8
            Write-Host "  -> Prompt fallido guardado en $failedLog" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error al ejecutar el script: $_ [$promptId]" -ForegroundColor Red
        
        # Guardar prompt fallido (error de ejecución)
        $failedLog = Join-Path $scriptDir "failed_prompts.json"
        $failedData = @()
        if (Test-Path $failedLog) {
            try {
                $content = Get-Content $failedLog -Raw
                if ($content) { $failedData = @($content | ConvertFrom-Json) }
            } catch {}
        }
        $failedData += @{ id = $promptId; prompt = $Prompt; reason = "Script Error: $_"; timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") }
        $failedData | ConvertTo-Json -Depth 4 | Set-Content $failedLog -Encoding UTF8
        Write-Host "  -> Prompt fallido guardado en $failedLog" -ForegroundColor Yellow
    }
}

Write-Host "==================================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Green
