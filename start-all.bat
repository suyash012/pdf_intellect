@echo off
echo Starting PDF Intellect (Backend and Frontend)...
echo.
echo Starting Backend Server...
start cmd /k "call start-backend.bat"
echo.
echo Starting Frontend Server...
timeout /t 5 /nobreak
start cmd /k "call start-frontend.bat"
echo.
echo Servers started! Access the application at http://localhost:3000
echo Both services are starting...
echo Press any key to close this window
pause > nul 