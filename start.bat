@echo off
chcp 65001 >nul
color 0B

echo ========================================
echo   🍰 Repostería Caro - Inicio Rápido
echo ========================================
echo.

:: Verificar Docker
echo 📦 Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está corriendo. Iniciando...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo ⏳ Esperando 30 segundos...
    timeout /t 30 /nobreak >nul
)

:: Iniciar MongoDB
echo 🐳 Iniciando MongoDB...
docker-compose up -d

:: Esperar un poco
timeout /t 5 /nobreak >nul

:: Iniciar Backend
echo 🔧 Iniciando Backend...
start "Backend - Puerto 5000" cmd /k "cd server && npm run dev"

:: Esperar un poco
timeout /t 5 /nobreak >nul

:: Iniciar Frontend
echo ⚛️ Iniciando Frontend...
start "Frontend - Puerto 5173" cmd /k "cd client && npm run dev"

:: Esperar a que el frontend esté listo
timeout /t 10 /nobreak >nul

:: Abrir navegador
echo 🌐 Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo   ✅ SISTEMA INICIADO
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Para detener: Cierra las ventanas de terminal
echo y ejecuta: docker-compose down
echo.
pause
