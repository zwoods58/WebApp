# Quick ngrok Start Script
Write-Host "=== Starting ngrok Tunnel ===" -ForegroundColor Green
Write-Host ""
Write-Host "Make sure your dev server is running first!" -ForegroundColor Yellow
Write-Host "Run: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting ngrok tunnel..." -ForegroundColor Cyan
Write-Host ""

npx ngrok@latest http 3000

