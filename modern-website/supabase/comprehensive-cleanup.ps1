# Comprehensive Cleanup for V2 Auth Rebuild
# Removes old Edge Functions and Legacy Migration files

Write-Host ">>> Starting Comprehensive Cleanup..." -ForegroundColor Cyan
Write-Host ""

# 1. CLEANUP EDGE FUNCTIONS
$functionsToKeep = @("_shared", "auth-unified", "auth-refresh", "auth-logout", "protected-example")
$functionsPath = "supabase/functions"

if (Test-Path $functionsPath) {
    Write-Host "--- Cleaning Legacy Edge Functions ---" -ForegroundColor Yellow
    $allFunctions = Get-ChildItem -Path $functionsPath -Directory
    
    foreach ($func in $allFunctions) {
        if ($functionsToKeep -notcontains $func.Name) {
            Write-Host "   Deleting function: $($func.Name)" -ForegroundColor Gray
            Remove-Item -Recurse -Force $func.FullName
        }
    }
}

# 2. CLEANUP MIGRATIONS
$migrationsKeep = @("20260121_auth_v2_schema.sql")
$migrationsPath = "supabase/migrations"

if (Test-Path $migrationsPath) {
    Write-Host "--- Cleaning Legacy Migrations ---" -ForegroundColor Yellow
    $allMigrations = Get-ChildItem -Path $migrationsPath -File
    
    foreach ($mig in $allMigrations) {
        if ($migrationsKeep -notcontains $mig.Name) {
            Write-Host "   Deleting migration: $($mig.Name)" -ForegroundColor Gray
            Remove-Item -Force $mig.FullName
        }
    }
}

Write-Host ""
Write-Host "Cleanup successful! Remaining assets:" -ForegroundColor Green
Write-Host "Functions: $(($functionsToKeep) -join ', ')"
Write-Host "Migrations: $(($migrationsKeep) -join ', ')"
Write-Host ""
Write-Host "Now proceeding to update frontend..." -ForegroundColor Cyan
