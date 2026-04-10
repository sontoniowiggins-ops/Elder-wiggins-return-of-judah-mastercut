@echo off
title Find and Move My Images
color 0A
setlocal enabledelayedexpansion

echo.
echo  ==========================================
echo    FIND AND MOVE MY IMAGES
echo  ==========================================
echo.
echo  Searching your computer for images...
echo  (Desktop, Downloads, and Pictures folders)
echo.

set "DEST=%~dp0public\images"
set "FOUND=0"

:: Search common locations
for %%L in (
    "%USERPROFILE%\Desktop"
    "%USERPROFILE%\Downloads"
    "%USERPROFILE%\Pictures"
) do (
    if exist "%%~L" (
        for %%F in ("%%~L\*.png" "%%~L\*.jpg" "%%~L\*.jpeg" "%%~L\*.webp") do (
            if exist "%%~F" (
                set /a FOUND+=1
                echo    Found: %%~nxF  ^(%%~L^)
            )
        )
    )
)

echo.
if %FOUND%==0 (
    echo  No images found in Desktop, Downloads, or Pictures.
    echo.
    echo  TIP: Try double-clicking OPEN IMAGES FOLDER.bat
    echo       and manually dragging your images in.
    echo.
    pause
    exit /b
)

echo  Found %FOUND% image(s).
echo.
set /p CONFIRM= Copy them to public\images\? (Y/N):
if /i not "%CONFIRM%"=="Y" (
    echo  Cancelled.
    pause
    exit /b
)

echo.
echo  Copying images...
echo.

set "COPIED=0"
for %%L in (
    "%USERPROFILE%\Desktop"
    "%USERPROFILE%\Downloads"
    "%USERPROFILE%\Pictures"
) do (
    if exist "%%~L" (
        for %%F in ("%%~L\*.png" "%%~L\*.jpg" "%%~L\*.jpeg" "%%~L\*.webp") do (
            if exist "%%~F" (
                copy /Y "%%~F" "%DEST%\" >nul
                if !errorlevel!==0 (
                    echo    Copied: %%~nxF
                    set /a COPIED+=1
                ) else (
                    echo    ERROR copying: %%~nxF
                )
            )
        )
    )
)

echo.
echo  ==========================================
echo    Done! %COPIED% image(s) copied to public\images\
echo  ==========================================
echo.
echo  Next step: Run ONE CLICK RENDER.bat
echo.
pause
