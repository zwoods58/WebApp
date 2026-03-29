@echo off
echo Setting up mobile testing for BeeZee Finance...
echo.
echo Step 1: Starting development server...
start "Dev Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo.
echo Step 2: Starting ngrok tunnel...
start "Ngrok Tunnel" cmd /k "ngrok http 3001"
timeout /t 3 /nobreak >nul
echo.
echo Step 3: Getting ngrok URL...
powershell -Command "(Invoke-WebRequest -Uri 'http://127.0.0.1:4040/api/tunnels' -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json).tunnels[0].public_url"
echo.
echo Mobile testing setup complete!
echo Use the URL above on your phone to test the application.
pause
