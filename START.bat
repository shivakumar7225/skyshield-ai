@echo off
title SkyShield AI (VarshDristhi) - One-Click Launcher
setlocal enabledelayedexpansion

echo =======================================================
echo    SkyShield AI (VarshDristhi) - Launching System
echo =======================================================
echo.

cd /d "%~dp0"

if exist "backend\.venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0backend\.venv\Scripts\python.exe"
) else (
    set "PY_CMD=python"
)

echo [1/3] Starting FastAPI Backend on port 8000...
start "SkyShield Backend" /min cmd /c "cd /d backend && "%PY_CMD%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting React Frontend on port 5173...
start "SkyShield Frontend" /min cmd /c "npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening SkyShield AI in your browser...
start http://localhost:5173

echo.
echo =======================================================
echo   System is UP and RUNNING!
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo   To stop all servers, simply run STOP.bat
echo =======================================================
echo.
timeout /t 5
