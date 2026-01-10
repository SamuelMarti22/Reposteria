@echo off
chcp 65001 >nul
color 0C

echo ========================================
echo   🛑 Repostería Caro - Detener Sistema
echo ========================================
echo.

:: Detener contenedores Docker
echo 🐳 Deteniendo MongoDB...
docker-compose down

echo.
echo ✅ Contenedores detenidos
echo.
echo ⚠️ NOTA: Las ventanas de terminal con Node.js
echo    deben cerrarse manualmente.
echo.
pause
