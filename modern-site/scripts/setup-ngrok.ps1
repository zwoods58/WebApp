# ngrok Setup Script
Write-Host "`n=== ngrok Setup ===" -ForegroundColor Green
Write-Host "`nStep 1: Sign up at https://ngrok.com (free)" -ForegroundColor Cyan
Write-Host "Step 2: Get your auth token from the dashboard" -ForegroundColor Cyan
Write-Host "`nAfter you have your token, run:" -ForegroundColor Yellow
Write-Host "npx ngrok@latest config add-authtoken YOUR_TOKEN" -ForegroundColor White
Write-Host "`nThen start the tunnel with:" -ForegroundColor Yellow
Write-Host "npx ngrok@latest http 3000" -ForegroundColor White
Write-Host "`nMake sure your dev server is running first (npm run dev)" -ForegroundColor Cyan
Write-Host ""

