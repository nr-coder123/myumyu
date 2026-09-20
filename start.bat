@echo off
title Murim Realm Map Studio Local Launcher
echo =======================================================
echo          Murim Realm Map Studio Local Launcher
echo =======================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in your PATH!
    echo Please download and install Node.js (v18 or higher) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules directory exists
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing npm dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully.
    echo.
)

echo [INFO] Starting local dev server...
echo [INFO] The app will be available at: http://localhost:3000
echo.

:: Launch default web browser after brief delay
start "" cmd /c "timeout /t 3 >nul && start http://localhost:3000"

:: Run Vite dev server
call npm run dev

pause
