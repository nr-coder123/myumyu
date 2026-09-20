@echo off
cd /d "%~dp0"
call start.bat
if %ERRORLEVEL% NEQ 0 (
    pause
)
