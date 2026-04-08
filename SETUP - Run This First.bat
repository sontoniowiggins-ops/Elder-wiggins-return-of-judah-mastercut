@echo off
title RETURN OF JUDAH - First Time Setup
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - First Time Setup
echo  ==========================================
echo.
echo  This will take about 1 minute...
echo  Do NOT close this window.
echo.
call npm install --legacy-peer-deps
echo.
echo  ==========================================
echo    Setup complete! Opening preview...
echo  ==========================================
echo.
start http://localhost:3000
call npm start
pause
