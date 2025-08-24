@echo off
REM Shadow Clone Workspace Initializer
REM Sets up AI instructions in any project

echo.
echo ========================================
echo   Shadow Clone Workspace Initializer
echo ========================================
echo.

REM Check if we're in a git repository or project folder
if not exist ".git" (
    echo Warning: Not in a git repository. Continue anyway? [Y/N]
    set /p continue=
    if /i not "%continue%"=="y" exit /b 0
)

REM Create CLAUDE.md if it doesn't exist
if not exist "CLAUDE.md" (
    echo Creating CLAUDE.md with Shadow Clone instructions...
    copy "%~dp0templates\CLAUDE.md" "CLAUDE.md" >nul
    echo [+] Created CLAUDE.md
) else (
    echo CLAUDE.md already exists. Append Shadow Clone instructions? [Y/N]
    set /p append=
    if /i "%append%"=="y" (
        echo. >> CLAUDE.md
        echo. >> CLAUDE.md
        type "%~dp0templates\CLAUDE.md" >> CLAUDE.md
        echo [+] Appended Shadow Clone instructions to CLAUDE.md
    )
)

REM Create .ai folder if it doesn't exist
if not exist ".ai" mkdir .ai

REM Create AI-INSTRUCTIONS.md
if not exist ".ai\instructions.md" (
    echo Creating .ai\instructions.md...
    copy "%~dp0AI-REFERENCE.md" ".ai\instructions.md" >nul
    echo [+] Created .ai\instructions.md
)

REM Create .github folder structure for Copilot
if not exist ".github" mkdir .github

REM Create copilot-instructions.md
if not exist ".github\copilot-instructions.md" (
    echo Creating .github\copilot-instructions.md...
    echo # GitHub Copilot Instructions > ".github\copilot-instructions.md"
    echo. >> ".github\copilot-instructions.md"
    echo ## Shadow Clone Commands Available >> ".github\copilot-instructions.md"
    echo. >> ".github\copilot-instructions.md"
    echo This workspace has Shadow Clone installed. Use these commands for professional methodologies: >> ".github\copilot-instructions.md"
    echo. >> ".github\copilot-instructions.md"
    echo - `sfix [type] "description"` - Get bug fix patterns >> ".github\copilot-instructions.md"
    echo - `shadow specialist [type] "task"` - Get expert help >> ".github\copilot-instructions.md"
    echo - `sreview [type]` - Get review methodology >> ".github\copilot-instructions.md"
    echo - `stest [type]` - Get test patterns >> ".github\copilot-instructions.md"
    echo. >> ".github\copilot-instructions.md"
    echo Run commands in terminal to get methodologies, then implement them. >> ".github\copilot-instructions.md"
    echo [+] Created .github\copilot-instructions.md
)

REM Create AI-CONTEXT.md for other AI tools
if not exist "AI-CONTEXT.md" (
    echo Creating AI-CONTEXT.md...
    echo # AI Context for This Project > AI-CONTEXT.md
    echo. >> AI-CONTEXT.md
    echo ## Shadow Clone Integration >> AI-CONTEXT.md
    echo. >> AI-CONTEXT.md
    echo This project has Shadow Clone prompt engineering macros available. >> AI-CONTEXT.md
    echo Run `shadow commands` to see all available tools. >> AI-CONTEXT.md
    echo These provide professional methodologies for development tasks. >> AI-CONTEXT.md
    echo [+] Created AI-CONTEXT.md
)

REM Create .vscode settings if using VS Code
if exist ".vscode" (
    if not exist ".vscode\ai-instructions.md" (
        echo Creating .vscode\ai-instructions.md...
        copy "%~dp0AI-REFERENCE.md" ".vscode\ai-instructions.md" >nul
        echo [+] Created .vscode\ai-instructions.md
    )
)

echo.
echo ========================================
echo   Workspace Initialization Complete!
echo ========================================
echo.
echo AI instruction files created:
echo   - CLAUDE.md (Claude-specific)
echo   - .ai\instructions.md (General AI)
echo   - .github\copilot-instructions.md (GitHub Copilot)
echo   - AI-CONTEXT.md (Universal context)
if exist ".vscode\ai-instructions.md" (
    echo   - .vscode\ai-instructions.md (VS Code AI)
)
echo.
echo Shadow Clone commands are now documented for all AI assistants!
echo.
echo Next steps:
echo 1. Edit CLAUDE.md to add project-specific context
echo 2. Commit these files to your repository
echo 3. All AI assistants will now know about Shadow Clone
echo.
pause