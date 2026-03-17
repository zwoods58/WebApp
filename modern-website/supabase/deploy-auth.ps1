# Quick Deploy Script for V2 Auth
# Run this after setting up environment secrets

Write-Host ">>> Deploying V2 Authentication System..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "supabase")) {
    Write-Host "[ERROR] Must run from project root (modern-website)" -ForegroundColor Red
    exit 1
}

# Deploy functions
Write-Host "--- Deploying Edge Functions ---" -ForegroundColor Yellow

$functions = @(
    "auth-unified",
    "auth-refresh", 
    "auth-logout",
    "protected-example"
)

foreach ($func in $functions) {
    Write-Host "   Deploying $func..." -ForegroundColor Gray
    # Use npx to ensure we use the local version we installed
    npx supabase functions deploy $func --no-verify-jwt --project-ref rtfzksajhriwhulnwaks
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [SUCCESS] $func deployed" -ForegroundColor Green
    } else {
        Write-Host "   [FAILED] $func failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "All functions deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run database migration in Supabase dashboard"
Write-Host "  2. Test endpoints with Postman (see DEPLOYMENT_GUIDE.md)"
Write-Host "  3. Update frontend to use new auth endpoints"
