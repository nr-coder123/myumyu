@echo off
setlocal EnableDelayedExpansion

:: Switch to the directory where this script is located
cd /d "%~dp0"

title Murim Realm Map Studio Launcher
cls

echo ========================================================
echo          Murim Realm Map Studio Local Launcher
echo ========================================================
echo Location: %cd%
echo.

:: Check Node.js
echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo [ERROR] Node.js is not found in your PATH!
    echo ========================================================
    echo Node.js is required to run this web application locally.
    echo Please download and install Node.js (LTS version) from:
    echo   https://nodejs.org/
    echo.
    echo After installing, restart this batch file.
    echo ========================================================
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v 2^>nul') do set NODE_VERSION=%%i
echo [INFO] Found Node.js version: !NODE_VERSION!

:: Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm command not found! Please check your Node.js installation.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing packages (this may take 1-2 minutes)...
    echo.
    cmd /c npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ========================================================
        echo [ERROR] npm install encountered an error!
        echo ========================================================
        echo Check your internet connection or run 'npm install' in Command Prompt.
        echo.
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully!
) else (
    echo [INFO] Dependencies found.
)

echo.
echo [3/3] Starting Vite dev server...
echo.
echo ========================================================
echo   Application URL: http://localhost:3000
echo   (Keep this window OPEN while using the map)
echo ========================================================
echo.

:: Automatically open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul 2>&1 & start http://localhost:3000"

:: Run the Vite dev server using cmd /c so npm.cmd cannot abruptly close this window
cmd /c npm run dev

:: If the server ever exits or is closed by the user:
echo.
echo ========================================================
echo Application server has stopped.
echo ========================================================
echo.
pause
