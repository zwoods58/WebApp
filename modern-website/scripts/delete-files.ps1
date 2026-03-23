# Simple Deletion Script
# Deletes legacy offline/online system files

$logFile = "deletion_log.txt"
$deletedCount = 0
$errorCount = 0

function Write-Log {
    param($message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] $message"
}

Write-Host "OFFLINE/ONLINE SYSTEM DELETION - LIVE MODE" -ForegroundColor Red
Write-Host ""

# Phase 1: Debug and Test Files
Write-Host "PHASE 1: DEBUG AND TEST FILES" -ForegroundColor Yellow
$patterns = @("test-*.js", "debug-*.js", "emergency-*.js", "quick-*.js", "fix-*.js", "diagnose-*.js")
foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Path . -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        try {
            Remove-Item -Path $file.FullName -Force
            Write-Host "DELETED: $($file.Name)" -ForegroundColor Green
            Write-Log "DELETED: $($file.FullName)"
            $deletedCount++
        } catch {
            Write-Host "ERROR: $($file.Name)" -ForegroundColor Red
            Write-Log "ERROR: $($file.FullName) - $($_.Exception.Message)"
            $errorCount++
        }
    }
}

# Phase 2: Old Documentation
Write-Host ""
Write-Host "PHASE 2: OLD DOCUMENTATION" -ForegroundColor Yellow
$docPatterns = @("OFFLINE_*.md", "IMPLEMENTATION_*.md", "UNIVERSAL_OFFLINE_*.md", "current-login-system.md", "temp-auth-guide.md", "test-authentication.md")
foreach ($pattern in $docPatterns) {
    $files = Get-ChildItem -Path . -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        try {
            Remove-Item -Path $file.FullName -Force
            Write-Host "DELETED: $($file.Name)" -ForegroundColor Green
            Write-Log "DELETED: $($file.FullName)"
            $deletedCount++
        } catch {
            Write-Host "ERROR: $($file.Name)" -ForegroundColor Red
            Write-Log "ERROR: $($file.FullName) - $($_.Exception.Message)"
            $errorCount++
        }
    }
}

# Phase 3: Build Artifacts
Write-Host ""
Write-Host "PHASE 3: BUILD ARTIFACTS" -ForegroundColor Yellow
if (Test-Path "tsconfig.tsbuildinfo") {
    try {
        Remove-Item -Path "tsconfig.tsbuildinfo" -Force
        Write-Host "DELETED: tsconfig.tsbuildinfo" -ForegroundColor Green
        Write-Log "DELETED: tsconfig.tsbuildinfo"
        $deletedCount++
    } catch {
        Write-Host "ERROR: tsconfig.tsbuildinfo" -ForegroundColor Red
        Write-Log "ERROR: tsconfig.tsbuildinfo - $($_.Exception.Message)"
        $errorCount++
    }
}

# Phase 4: Legacy Offline Components
Write-Host ""
Write-Host "PHASE 4: LEGACY OFFLINE COMPONENTS (CRITICAL)" -ForegroundColor Red
$legacyFiles = @(
    "src\hooks\useNetworkDetection.ts",
    "src\components\OfflineErrorBoundary.tsx",
    "src\components\OfflineFallback.tsx",
    "src\app\components\ServiceWorkerRegistration.tsx"
)

foreach ($file in $legacyFiles) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force
            Write-Host "DELETED: $file" -ForegroundColor Green
            Write-Log "DELETED: $file"
            $deletedCount++
        } catch {
            Write-Host "ERROR: $file" -ForegroundColor Red
            Write-Log "ERROR: $file - $($_.Exception.Message)"
            $errorCount++
        }
    } else {
        Write-Host "SKIPPED: $file (not found)" -ForegroundColor Yellow
        Write-Log "SKIPPED: $file (not found)"
    }
}

# Phase 6: Directory Cleanup
Write-Host ""
Write-Host "PHASE 6: DIRECTORY CLEANUP" -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        Remove-Item -Path ".next" -Recurse -Force
        Write-Host "DELETED: .next directory" -ForegroundColor Green
        Write-Log "DELETED: .next directory"
        $deletedCount++
    } catch {
        Write-Host "ERROR: .next" -ForegroundColor Red
        Write-Log "ERROR: .next - $($_.Exception.Message)"
        $errorCount++
    }
}

if (Test-Path ".vercel") {
    try {
        Remove-Item -Path ".vercel" -Recurse -Force
        Write-Host "DELETED: .vercel directory" -ForegroundColor Green
        Write-Log "DELETED: .vercel directory"
        $deletedCount++
    } catch {
        Write-Host "ERROR: .vercel" -ForegroundColor Red
        Write-Log "ERROR: .vercel - $($_.Exception.Message)"
        $errorCount++
    }
}

# Summary
Write-Host ""
Write-Host "DELETION SUMMARY" -ForegroundColor Cyan
Write-Host "Files Deleted: $deletedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor Red
Write-Host "Log File: $logFile" -ForegroundColor Cyan
Write-Host ""

Write-Log "SUMMARY: Deleted=$deletedCount, Errors=$errorCount"

if ($errorCount -eq 0) {
    Write-Host "Deletion completed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Deletion completed with errors." -ForegroundColor Yellow
    exit 1
}
