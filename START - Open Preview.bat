@echo off
title RETURN OF JUDAH - Preview
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - Starting Preview
echo  ==========================================
echo.
echo  Opening browser in 5 seconds...
echo  Do NOT close this window.
echo.
timeout /t 5 /nobreak
start http://localhost:3000
call npm start
pause
