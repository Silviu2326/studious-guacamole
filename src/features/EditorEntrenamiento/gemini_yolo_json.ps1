# Script PowerShell para usar Gemini CLI en modo YOLO con un JSON de prompt
# Usa node-pty para automatizar la respuesta a confirmaciones de ejecución
# Uso:
#   .\gemini_yolo_json.ps1
# Opcional: puedes pasar la ruta al JSON:
#   .\gemini_yolo_json.ps1 .\prompt.json
# Opcional: puedes configurar la auto-respuesta (1=once, 2=always):
#   $env:GEMINI_AUTO_RESPONSE="2"; .\gemini_yolo_json.ps1 .\prompt.json

Write-Host "[1/6] Iniciando script (YOLO + JSON con auto-confirmación)..." -ForegroundColor Cyan

# 1. Cargar variables de entorno desde .env si existe
Write-Host "[2/6] Cargando variables de entorno..." -ForegroundColor Cyan
if (Test-Path .env) {
    Write-Host "  -> Archivo .env encontrado, cargando variables..." -ForegroundColor Gray
    Get-Content .env | ForEach-Object {
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
$JsonPath = ".\prompt.json"
if ($args.Count -ge 1) {
    $JsonPath = $args[0]
}

if (-not (Test-Path $JsonPath)) {
    Write-Host "Error: No se encontró el archivo JSON: $JsonPath" -ForegroundColor Red
    exit 1
}

Write-Host "[4/6] Leyendo JSON de prompt..." -ForegroundColor Cyan
Write-Host "  -> Archivo: $JsonPath" -ForegroundColor Gray

try {
    $jsonContent = Get-Content $JsonPath -Raw
    $data = $jsonContent | ConvertFrom-Json
} catch {
    Write-Host "Error al leer o parsear el JSON: $_" -ForegroundColor Red
    exit 1
}

# Soportar:
#  - { "prompt": "texto" }
#  - { "prompts": ["texto1", "texto2", ...] }
$prompts = @()

if ($data.prompts) {
    $prompts = @($data.prompts)
} elseif ($data.prompt) {
    $prompts = @($data.prompt)
} else {
    Write-Host "Error: El JSON debe contener 'prompt' o 'prompts'" -ForegroundColor Red
    exit 1
}

Write-Host "  -> Prompts cargados: $($prompts.Count)" -ForegroundColor Gray
$prompts | ForEach-Object { Write-Host "     - $_" -ForegroundColor DarkGray }
Write-Host ""

# 4. Verificar Node.js y node-pty
Write-Host "[5/6] Verificando Node.js y dependencias..." -ForegroundColor Cyan
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  -> Node.js encontrado en: $($nodeCmd.Source)" -ForegroundColor Gray

# Verificar que node-pty esté instalado
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$packageJson = Join-Path (Split-Path -Parent $scriptDir) "..\..\package.json"
$packageJson = Resolve-Path $packageJson -ErrorAction SilentlyContinue

if ($packageJson) {
    $packageContent = Get-Content $packageJson -Raw | ConvertFrom-Json
    $hasNodePty = ($packageContent.devDependencies.'node-pty' -or $packageContent.dependencies.'node-pty')
    if (-not $hasNodePty) {
        Write-Host "  -> node-pty no encontrado en package.json" -ForegroundColor Yellow
        Write-Host "  -> Instalando node-pty..." -ForegroundColor Yellow
        Push-Location (Split-Path -Parent $packageJson)
        npm install --save-dev node-pty 2>&1 | Out-Null
        Pop-Location
        Write-Host "  -> node-pty instalado" -ForegroundColor Gray
    } else {
        Write-Host "  -> node-pty encontrado" -ForegroundColor Gray
    }
}

# 5. Verificar script gemini-auto.js
Write-Host "[6/6] Verificando script de automatización..." -ForegroundColor Cyan
$geminiAutoScript = Join-Path $scriptDir "gemini-auto.js"
if (-not (Test-Path $geminiAutoScript)) {
    Write-Host "Error: No se encontró el script gemini-auto.js" -ForegroundColor Red
    Write-Host "  -> Ruta esperada: $geminiAutoScript" -ForegroundColor Yellow
    exit 1
}
Write-Host "  -> Script encontrado: $geminiAutoScript" -ForegroundColor Gray
Write-Host ""

# Configurar auto-respuesta (1 = allow once, 2 = allow always)
$autoResponse = if ($env:GEMINI_AUTO_RESPONSE) { $env:GEMINI_AUTO_RESPONSE } else { "1" }
Write-Host "  -> Auto-respuesta configurada: $autoResponse (1=once, 2=always)" -ForegroundColor Gray
Write-Host ""

foreach ($Prompt in $prompts) {
    Write-Host "==================================================" -ForegroundColor DarkGray
    Write-Host "Prompt:" -ForegroundColor Green
    Write-Host $Prompt
    Write-Host "--------------------------------------------------"

    # Ejecutar script Node.js con node-pty
    $env:GEMINI_AUTO_RESPONSE = $autoResponse
    $promptEscaped = $Prompt -replace '"', '\"'
    
    try {
        # Ejecutar el script Node.js directamente - la salida se muestra en tiempo real
        & node $geminiAutoScript $promptEscaped
        
        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
            Write-Host ""
            Write-Host "  -> Comando ejecutado exitosamente" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Error: El comando falló con código de salida: $LASTEXITCODE" -ForegroundColor Red
            
            # Guardar prompt fallido (error de ejecución)
            $failedLog = Join-Path $scriptDir "failed_prompts.json"
            $failedData = @()
            if (Test-Path $failedLog) {
                try {
                    $content = Get-Content $failedLog -Raw
                    if ($content) { $failedData = @($content | ConvertFrom-Json) }
                } catch {}
            }
            $failedData += @{ prompt = $Prompt; reason = "Execution Error (ExitCode: $LASTEXITCODE)"; timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") }
            $failedData | ConvertTo-Json -Depth 4 | Set-Content $failedLog -Encoding UTF8
            Write-Host "  -> Prompt fallido guardado en $failedLog" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error al ejecutar el script: $_" -ForegroundColor Red
        
        # Guardar prompt fallido (error de ejecución)
        $failedLog = Join-Path $scriptDir "failed_prompts.json"
        $failedData = @()
        if (Test-Path $failedLog) {
            try {
                $content = Get-Content $failedLog -Raw
                if ($content) { $failedData = @($content | ConvertFrom-Json) }
            } catch {}
        }
        $failedData += @{ prompt = $Prompt; reason = "Script Error: $_"; timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") }
        $failedData | ConvertTo-Json -Depth 4 | Set-Content $failedLog -Encoding UTF8
        Write-Host "  -> Prompt fallido guardado en $failedLog" -ForegroundColor Yellow
    }
}

Write-Host "==================================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Green
