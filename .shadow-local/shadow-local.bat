@echo off
REM Shadow Clone Local Mode - Quick Access for Creator

echo.
echo ====================================================
echo    SHADOW CLONE LOCAL MODE - Creator Privileges
echo ====================================================
echo.

REM Check if we're in the right directory
if not exist "%~dp0creator-config.json" (
    echo ERROR: Creator config not found!
    echo This script must be run from .shadow-local directory
    exit /b 1
)

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)

REM Parse command
if "%1"=="" goto :help
if "%1"=="help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help
if "%1"=="status" goto :status
if "%1"=="fix" goto :fix
if "%1"=="quick_fix" goto :fix
if "%1"=="specialist" goto :specialist
if "%1"=="review" goto :review
if "%1"=="test" goto :test
if "%1"=="tests" goto :test
if "%1"=="wave" goto :wave
if "%1"=="doc" goto :doc
if "%1"=="docs" goto :doc
if "%1"=="arch" goto :arch
if "%1"=="architect" goto :arch

REM Default - run with all arguments
node "%~dp0use-local.js" %*
goto :end

:help
echo Usage: shadow-local ^<command^> [options]
echo.
echo Quick Commands:
echo   fix ^<type^> "description"      - Quick fix for bugs/issues
echo   specialist ^<type^> "task"      - Deploy single expert
echo   review ^<type^> [files]         - Code review
echo   test ^<type^> [files]           - Generate tests
echo   wave ^<type^> "scope"           - Single wave execution
echo   doc ^<type^> "scope"            - Create documentation
echo   arch ^<type^> "context"         - Architecture consultation
echo   status                         - Show creator mode status
echo.
echo Shortcuts:
echo   shadow-local fix bug "Null pointer error"
echo   shadow-local specialist react "Optimize hooks"
echo   shadow-local review security src/*.js
echo   shadow-local test unit utils.js
echo.
goto :end

:status
echo [32mCreator Mode: ACTIVE[0m
echo [36mLocation: %~dp0[0m
echo [33mAuthentication: BYPASSED[0m
echo [35mLicense: UNLIMITED[0m
echo [92mAll features enabled![0m
goto :end

:fix
shift
node "%~dp0use-local.js" quick_fix %1 %2 %3 %4
goto :end

:specialist
shift
node "%~dp0use-local.js" deploy_specialist %1 %2 %3
goto :end

:review
shift
node "%~dp0use-local.js" code_review %*
goto :end

:test
shift
node "%~dp0use-local.js" generate_tests %*
goto :end

:wave
shift
node "%~dp0use-local.js" execute_single_wave %1 %2
goto :end

:doc
shift
node "%~dp0use-local.js" create_documentation %1 %2
goto :end

:arch
shift
node "%~dp0use-local.js" architecture_consultant %1 %2
goto :end

:end
echo.