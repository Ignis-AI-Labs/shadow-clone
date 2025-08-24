# Shadow Clone Local Mode - PowerShell Script
# Quick access to Shadow Clone functions for the creator

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }
function Write-Warning { Write-Host $args[0] -ForegroundColor Yellow }
function Write-Error { Write-Host $args[0] -ForegroundColor Red }

# Check creator config
$ConfigPath = Join-Path $PSScriptRoot "creator-config.json"
if (!(Test-Path $ConfigPath)) {
    Write-Error "❌ Creator config not found!"
    Write-Error "This script must be run from .shadow-local directory"
    exit 1
}

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js is not installed or not in PATH"
    Write-Error "Please install Node.js from https://nodejs.org"
    exit 1
}

# Banner
Write-Host ""
Write-Host "====================================================" -ForegroundColor Magenta
Write-Host "   SHADOW CLONE LOCAL MODE - Creator Privileges    " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Magenta
Write-Host ""

# Command handling
switch ($Command) {
    "" { & node (Join-Path $PSScriptRoot "use-local.js") --help }
    "help" { & node (Join-Path $PSScriptRoot "use-local.js") --help }
    
    "status" {
        Write-Success "✅ Creator Mode: ACTIVE"
        Write-Info "📍 Location: $PSScriptRoot"
        Write-Warning "🔓 Authentication: BYPASSED"
        Write-Host "♾️  License: UNLIMITED" -ForegroundColor Magenta
        Write-Success "🛠️  All features enabled!"
    }
    
    "fix" {
        & node (Join-Path $PSScriptRoot "use-local.js") quick_fix @Arguments
    }
    
    "specialist" {
        & node (Join-Path $PSScriptRoot "use-local.js") deploy_specialist @Arguments
    }
    
    "review" {
        & node (Join-Path $PSScriptRoot "use-local.js") code_review @Arguments
    }
    
    "test" {
        & node (Join-Path $PSScriptRoot "use-local.js") generate_tests @Arguments
    }
    
    "tests" {
        & node (Join-Path $PSScriptRoot "use-local.js") generate_tests @Arguments
    }
    
    "wave" {
        & node (Join-Path $PSScriptRoot "use-local.js") execute_single_wave @Arguments
    }
    
    "doc" {
        & node (Join-Path $PSScriptRoot "use-local.js") create_documentation @Arguments
    }
    
    "docs" {
        & node (Join-Path $PSScriptRoot "use-local.js") create_documentation @Arguments
    }
    
    "arch" {
        & node (Join-Path $PSScriptRoot "use-local.js") architecture_consultant @Arguments
    }
    
    "architect" {
        & node (Join-Path $PSScriptRoot "use-local.js") architecture_consultant @Arguments
    }
    
    # Interactive mode
    "interactive" {
        Write-Info "🎮 Interactive Mode"
        Write-Host ""
        
        $continue = $true
        while ($continue) {
            Write-Host "Select a function:" -ForegroundColor Yellow
            Write-Host "1. Quick Fix"
            Write-Host "2. Deploy Specialist"
            Write-Host "3. Code Review"
            Write-Host "4. Generate Tests"
            Write-Host "5. Execute Wave"
            Write-Host "6. Create Documentation"
            Write-Host "7. Architecture Consultation"
            Write-Host "0. Exit"
            Write-Host ""
            
            $choice = Read-Host "Enter choice (0-7)"
            
            switch ($choice) {
                "0" { $continue = $false }
                
                "1" {
                    $type = Read-Host "Issue type (bug/performance/security)"
                    $desc = Read-Host "Description"
                    & node (Join-Path $PSScriptRoot "use-local.js") quick_fix $type $desc
                }
                
                "2" {
                    Write-Host "Available specialists:"
                    Write-Host "  react, api, database, test, perf, security, review, docs"
                    $spec = Read-Host "Specialist type"
                    $task = Read-Host "Task description"
                    & node (Join-Path $PSScriptRoot "use-local.js") deploy_specialist $spec $task
                }
                
                "3" {
                    $type = Read-Host "Review type (security/performance/quality)"
                    $files = Read-Host "Files (space-separated, or press Enter for current)"
                    if ($files) {
                        & node (Join-Path $PSScriptRoot "use-local.js") code_review $type $files.Split()
                    } else {
                        & node (Join-Path $PSScriptRoot "use-local.js") code_review $type
                    }
                }
                
                "4" {
                    $type = Read-Host "Test type (unit/integration/e2e)"
                    $files = Read-Host "Files (space-separated, or press Enter for current)"
                    if ($files) {
                        & node (Join-Path $PSScriptRoot "use-local.js") generate_tests $type $files.Split()
                    } else {
                        & node (Join-Path $PSScriptRoot "use-local.js") generate_tests $type
                    }
                }
                
                "5" {
                    $type = Read-Host "Wave type (research/planning/implementation)"
                    $scope = Read-Host "Scope description"
                    & node (Join-Path $PSScriptRoot "use-local.js") execute_single_wave $type $scope
                }
                
                "6" {
                    $type = Read-Host "Doc type (api/user_guide/developer)"
                    $scope = Read-Host "Scope description"
                    & node (Join-Path $PSScriptRoot "use-local.js") create_documentation $type $scope
                }
                
                "7" {
                    $type = Read-Host "Consultation type (design_review/pattern_recommendation)"
                    $context = Read-Host "Context description"
                    & node (Join-Path $PSScriptRoot "use-local.js") architecture_consultant $type $context
                }
                
                default {
                    Write-Warning "Invalid choice"
                }
            }
            
            if ($continue) {
                Write-Host ""
                Write-Host "Press Enter to continue..." -ForegroundColor Gray
                Read-Host
                Clear-Host
            }
        }
    }
    
    default {
        # Pass through to Node.js script
        & node (Join-Path $PSScriptRoot "use-local.js") $Command @Arguments
    }
}

Write-Host ""