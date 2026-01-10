# ========================================
# 🚀 Script de Inicio Automático - Repostería Caro
# ========================================
# Autor: Sistema Automatizado
# Fecha: 10 de enero de 2026
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🍰 Repostería Caro - Inicio Automático" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# 1. Verificar Docker Desktop
# ========================================
Write-Host "📦 Verificando Docker Desktop..." -ForegroundColor Blue

$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker no está corriendo." -ForegroundColor Red
    Write-Host "   Iniciando Docker Desktop..." -ForegroundColor Yellow
    
    # Intentar iniciar Docker Desktop
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    Write-Host "   Esperando que Docker inicie (30 segundos)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Verificar nuevamente
    $dockerStatus = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker no pudo iniciar. Por favor, ábrelo manualmente." -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host "✅ Docker está corriendo" -ForegroundColor Green
Write-Host ""

# ========================================
# 2. Levantar contenedores de MongoDB
# ========================================
Write-Host "🐳 Levantando contenedores de MongoDB..." -ForegroundColor Blue

docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB iniciado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al iniciar MongoDB" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# ========================================
# 3. Esperar a que MongoDB esté listo
# ========================================
Write-Host "⏳ Esperando a que MongoDB esté listo (5 segundos)..." -ForegroundColor Blue
Start-Sleep -Seconds 5
Write-Host "✅ MongoDB listo" -ForegroundColor Green
Write-Host ""

# ========================================
# 4. Iniciar Backend
# ========================================
Write-Host "🔧 Iniciando servidor backend..." -ForegroundColor Blue

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot\server
    npm run dev
}

Write-Host "✅ Backend iniciando en segundo plano (Puerto 5000)" -ForegroundColor Green
Write-Host ""

# ========================================
# 5. Esperar a que el backend esté listo
# ========================================
Write-Host "⏳ Esperando a que el backend esté listo..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# ========================================
# 6. Iniciar Frontend
# ========================================
Write-Host "⚛️  Iniciando cliente React..." -ForegroundColor Blue

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot\client
    npm run dev
}

Write-Host "✅ Frontend iniciando en segundo plano (Puerto 5173)" -ForegroundColor Green
Write-Host ""

# ========================================
# 7. Esperar y abrir navegador
# ========================================
Write-Host "⏳ Esperando a que el frontend esté listo (10 segundos)..." -ForegroundColor Blue
Start-Sleep -Seconds 10

Write-Host "🌐 Abriendo navegador..." -ForegroundColor Blue
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ SISTEMA INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 URLs disponibles:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   MongoDB:  localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para detener los servidores:" -ForegroundColor Yellow
Write-Host "   1. Presiona Ctrl+C en las ventanas de terminal" -ForegroundColor White
Write-Host "   2. Ejecuta: docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Enter para ver los logs (o cierra esta ventana)" -ForegroundColor Cyan
Read-Host

# Mostrar logs de los jobs
Write-Host "📜 Logs del Backend:" -ForegroundColor Yellow
Receive-Job -Job $backendJob

Write-Host ""
Write-Host "📜 Logs del Frontend:" -ForegroundColor Yellow
Receive-Job -Job $frontendJob

# Mantener los jobs corriendo
Wait-Job -Job $backendJob, $frontendJob
