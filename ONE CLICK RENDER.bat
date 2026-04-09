@echo off
title RETURN OF JUDAH - One Click Render
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - One Click Render
echo  ==========================================
echo.
echo  Step 1: Encoding your images into the video...
node scripts/encode-images.js
echo.
echo  Step 2: Starting render (3-5 minutes)...
echo  Do NOT close this window.
echo.
npx remotion render src/index.jsx SephardicYouTube out/youtube.mp4
echo.
if %errorlevel%==0 (
    echo  ==========================================
    echo    DONE! Video saved to: out\youtube.mp4
    echo  ==========================================
    start "" "%~dp0out"
) else (
    echo  Something went wrong. See error above.
)
echo.
pause
