@echo off
title SkyShield AI - Shutdown
echo =======================================================
echo    Stopping SkyShield AI (VarshDristhi) Servers...
echo =======================================================
echo.

echo Stopping processes on port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping processes on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All SkyShield AI services have been stopped successfully!
echo =======================================================
timeout /t 3
