# Cleanup Old Auth Functions
# Run AFTER V2 is deployed and tested

Write-Host "--- Cleaning up old authentication functions ---" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will DELETE the following folders:" -ForegroundColor Yellow
Write-Host ""

$oldFunctions = @(
    "auth-login",
    "auth-signup",
    "auth-recovery",
    "auth-verify-session",
    "kenya-auth-login",
    "kenya-auth-logout",
    "kenya-auth-recovery",
    "kenya-auth-signup",
    "kenya-auth-verify-session",
    "nigeria-auth-login",
    "nigeria-auth-logout",
    "nigeria-auth-recovery",
    "nigeria-auth-signup",
    "nigeria-auth-verify-session",
    "south-africa-auth-login",
    "south-africa-auth-logout",
    "south-africa-auth-recovery",
    "south-africa-auth-signup"
)

foreach ($func in $oldFunctions) {
    if (Test-Path "supabase\functions\$func") {
        Write-Host "   [OLD] $func" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "These are REPLACED by:" -ForegroundColor Green
Write-Host "   [V2] auth-unified (handles all countries)"
Write-Host "   [V2] auth-refresh"
Write-Host "   [V2] auth-logout (V2 kill switch)"
Write-Host ""
Write-Host "BEFORE running this:" -ForegroundColor Yellow
Write-Host "   1. Deploy V2 functions"
Write-Host "   2. Test V2 endpoints work"
Write-Host "   3. Update frontend to use new endpoints"
Write-Host ""

$confirm = Read-Host "Type 'DELETE' to proceed (or press Enter to cancel)"

if ($confirm -eq "DELETE") {
    Write-Host ""
    Write-Host "Deleting old functions..." -ForegroundColor Red
    
    foreach ($func in $oldFunctions) {
        $path = "supabase\functions\$func"
        if (Test-Path $path) {
            Remove-Item -Recurse -Force $path
            Write-Host "   Deleted $func" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host "Remaining functions: auth-unified, auth-refresh, auth-logout, protected-example"
}
else {
    Write-Host ""
    Write-Host "Cancelled - no files deleted" -ForegroundColor Yellow
}
