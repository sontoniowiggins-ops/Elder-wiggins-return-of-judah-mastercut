@echo off
title RETURN OF JUDAH - Preview
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - Starting Preview
echo  ==========================================
echo.
echo  Starting image server...
start "Image Server" /min cmd /c "node image-server.js & pause"
timeout /t 3 /nobreak >nul
echo  Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo  Do NOT close this window.
echo.
call npm start
pause
