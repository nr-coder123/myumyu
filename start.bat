@echo off
rem ========================================================
rem   Murim Realm Map Studio Local Launcher
rem ========================================================

rem Always switch to directory containing this batch file
cd /d "%~dp0"

title Murim Realm Map Studio Launcher
cls

echo ========================================================
echo          Murim Realm Map Studio Local Launcher
echo ========================================================
echo Location: %~dp0
echo.

rem Verify package.json exists in current folder
if not exist "%~dp0package.json" (
    echo [ERROR] package.json not found in %~dp0
    echo Please ensure you extracted all files from the ZIP archive
    echo before running this batch script.
    echo.
    pause
    goto :EOF
)

rem If Python is installed, delegate to start.py for 100%% compatibility
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Python detected! Launching via Python engine...
    python "%~dp0start.py"
    goto :DONE
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Python launcher (py) detected! Launching via Python engine...
    py "%~dp0start.py"
    goto :DONE
)

rem Fallback to direct Node/npm launcher
echo [INFO] Python not found. Launching directly via Node.js...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo [ERROR] Neither Python nor Node.js were found in PATH!
    echo ========================================================
    echo Please install Node.js (v18 or higher) from:
    echo   https://nodejs.org/
    echo.
    pause
    goto :EOF
)

rem Check node_modules
if not exist "%~dp0node_modules" (
    echo [INFO] First time setup: Installing npm packages...
    cmd /c npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        goto :EOF
    )
)

echo.
echo Launching application server at http://localhost:3000 ...
echo (Keep this window open while using the application)
echo.

powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'" >nul 2>&1

cmd /c npm run dev

:DONE
echo.
echo ========================================================
echo Application server stopped.
echo ========================================================
echo.
pause
:EOF
