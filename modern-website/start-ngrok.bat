@echo off
echo Starting Ngrok for port 3000...
echo.
echo This will create a public URL for your local development server.
echo Copy the HTTPS URL from the output below.
echo.
ngrok http 3000
pause
