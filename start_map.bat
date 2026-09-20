@echo off
setlocal enabledelayedexpansion
title Murim World Map Studio - Local Server
echo ======================================================================
echo              MURIM WORLD MAP STUDIO - LOCALHOST 8000
echo ======================================================================
echo.

:: 1. If dist\index.html does not exist, build it using npm if available
if not exist "dist\index.html" (
    echo [INFO] First time run detected. Generating standalone production bundle...
    where npm >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] Running 'npm run build'...
        call npm run build
    ) else (
        echo [WARN] npm was not found in PATH. Proceeding with existing files...
    )
)

echo Starting local web server on http://localhost:8000 ...
echo Opening your default browser...
echo.

:: Open browser automatically after a short 1-second delay in background
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8000"

:: 2. Try Python server script (server.py)
if exist "server.py" (
    python server.py 8000
    if %errorlevel% equ 0 goto :done
    py server.py 8000
    if %errorlevel% equ 0 goto :done
    python3 server.py 8000
    if %errorlevel% equ 0 goto :done
)

:: 3. Try python built-in http.server inside dist
if exist "dist\index.html" (
    echo Serving from dist folder via python -m http.server 8000 ...
    cd dist
    python -m http.server 8000
    if %errorlevel% equ 0 goto :done
    py -m http.server 8000
    if %errorlevel% equ 0 goto :done
    python3 -m http.server 8000
    if %errorlevel% equ 0 goto :done
    cd ..
)

:: 4. Fallback to npm run preview / vite preview
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting preview server via npm...
    call npm run preview -- --port 8000
    if %errorlevel% equ 0 goto :done
)

echo.
echo [ERROR] Could not start server.
echo Please ensure Python or Node.js is installed.
echo You can also directly open dist\index.html in any web browser!
echo.
pause

:done
