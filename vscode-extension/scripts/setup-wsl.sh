#!/bin/bash

# Shadow Clone WSL Setup Script
# This script ensures proper environment setup for Claude Code installation

echo "🚀 Shadow Clone WSL Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running in WSL
if ! grep -qi microsoft /proc/version; then
    print_warning "This script is designed for WSL. Proceeding anyway..."
fi

# Step 1: Check Node.js installation
echo "Step 1: Checking Node.js installation..."

# Install or update nvm
echo "Ensuring nvm is installed/updated..."
if [ -d "$HOME/.nvm" ]; then
    # Update nvm to latest version
    cd "$HOME/.nvm"
    git fetch --tags origin
    git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
    cd -
else
    # Install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Get the latest LTS version of Node.js
echo "Checking for latest Node.js LTS version..."
LATEST_LTS=$(nvm ls-remote --lts | tail -1 | awk '{print $2}')
print_status "Latest Node.js LTS version is $LATEST_LTS"

# Check current Node.js version
if command -v node &> /dev/null; then
    CURRENT_VERSION=$(node --version)
    print_status "Current Node.js version is $CURRENT_VERSION"
    
    # Install latest if not already using it
    if [ "$CURRENT_VERSION" != "$LATEST_LTS" ]; then
        print_warning "Updating to latest Node.js LTS version..."
        nvm install --lts
        nvm use --lts
        nvm alias default 'lts/*'
        print_status "Node.js updated to $(node --version)"
    else
        print_status "Already using latest Node.js LTS version"
    fi
else
    print_warning "Node.js not found, installing latest LTS version..."
    nvm install --lts
    nvm use --lts
    nvm alias default 'lts/*'
    print_status "Node.js $(node --version) installed"
fi

# Verify Node.js version is at least 18
NODE_VERSION=$(node --version)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
if [ "$MAJOR_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. You have $NODE_VERSION"
    echo "Installing Node.js 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
fi

# Step 2: Configure npm for global packages without sudo
echo ""
echo "Step 2: Configuring npm for permission-free global installs..."

# Create npm global directory in user home
NPM_GLOBAL="$HOME/.npm-global"
mkdir -p "$NPM_GLOBAL"

# Configure npm to use this directory
npm config set prefix "$NPM_GLOBAL"

# Add to PATH if not already there
if ! grep -q "$NPM_GLOBAL/bin" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# npm global packages" >> ~/.bashrc
    echo "export PATH=\$PATH:$NPM_GLOBAL/bin" >> ~/.bashrc
    print_status "Added npm global bin to PATH in ~/.bashrc"
fi

# Export for current session
export PATH=$PATH:$NPM_GLOBAL/bin

print_status "npm configured for permission-free global installs"

# Step 3: Install Claude Code
echo ""
echo "Step 3: Installing Claude Code CLI..."

# Try to install Claude Code
if npm install -g @anthropic/claude-code; then
    print_status "Claude Code installed successfully!"
else
    print_error "Failed to install Claude Code"
    echo ""
    echo "Trying alternative installation method..."
    
    # Alternative: Install with yarn if available
    if command -v yarn &> /dev/null; then
        yarn global add @anthropic/claude-code
    else
        echo "Please try installing manually with:"
        echo "  npm install -g @anthropic/claude-code"
    fi
fi

# Step 4: Verify installation
echo ""
echo "Step 4: Verifying installation..."

# Source bashrc to get updated PATH
source ~/.bashrc

if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "version unknown")
    print_status "Claude Code is installed: $CLAUDE_VERSION"
else
    print_warning "Claude command not found in PATH"
    echo ""
    echo "Please run the following commands:"
    echo "  source ~/.bashrc"
    echo "  claude --version"
fi

# Step 5: Final instructions
echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Close and reopen your terminal (or run: source ~/.bashrc)"
echo "2. Verify Claude is installed: claude --version"
echo "3. Authenticate Claude: claude auth"
echo "4. Get your Anthropic API key from: https://console.anthropic.com"
echo ""
echo "If you still have issues, try:"
echo "  - Restart your WSL terminal"
echo "  - Run: echo \$PATH | grep npm-global"
echo "  - Check: ls -la ~/.npm-global/bin/"
echo ""
print_status "Happy coding with Shadow Clone! 🚀"