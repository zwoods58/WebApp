# LocalTunnel Script - Exposes localhost:3000 to the internet
Write-Host "Starting LocalTunnel on port 3000..." -ForegroundColor Green
Write-Host "Your webhook URL will be: https://[random-name].loca.lt/api/ai-builder/payments/webhook" -ForegroundColor Yellow
Write-Host ""
Write-Host "Copy the URL shown below and use it in Flutterwave webhook configuration" -ForegroundColor Cyan
Write-Host ""

lt --port 3000

