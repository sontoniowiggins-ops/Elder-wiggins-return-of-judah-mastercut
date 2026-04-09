@echo off
title RETURN OF JUDAH - Preview
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - Starting Preview
echo  ==========================================
echo.
echo  Starting image server on port 3001...
start "Image Server" /min cmd /k "node image-server.js"
echo  Waiting for server to start...
timeout /t 4 /nobreak >nul
echo  Opening Remotion Studio...
start http://localhost:3000
echo.
echo  Do NOT close this window.
echo.
call npm start
pause
