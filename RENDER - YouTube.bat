@echo off
title RETURN OF JUDAH - Rendering YouTube
color 0A
echo.
echo  ==========================================
echo    Rendering YouTube MP4 (1920x1080)
echo  ==========================================
echo.
echo  Starting image server...
start "Image Server" /min cmd /k "node image-server.js"
timeout /t 3 /nobreak >nul
echo.
echo  Rendering... this takes 3-5 minutes.
echo  Do NOT close this window.
echo.
npx remotion render src/index.jsx SephardicYouTube out/youtube.mp4
echo.
if %errorlevel%==0 (
    echo  ==========================================
    echo    DONE! File saved to: out\youtube.mp4
    echo  ==========================================
    start "" "%~dp0out"
) else (
    echo  Something went wrong. See error above.
)
echo.
pause
