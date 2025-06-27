#!/bin/bash

echo "🚀 Shadow Clone VS Code Extension Quick Test Setup"
echo "================================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building extension..."
npm run compile

echo ""
echo "🌐 Starting mock API server..."

# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the server
PORT=3000 node test-server.js &
SERVER_PID=$!

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open VS Code in this directory: code ."
echo "2. Press F5 to launch the extension in debug mode"
echo "3. In the new VS Code window:"
echo "   - Click the Shadow Clone icon in the activity bar"
echo "   - Authenticate with API key: test-key-123"
echo "   - Try creating a project and exploring features"
echo ""
echo "Mock API server running with PID: $SERVER_PID"
echo "To stop the server: kill $SERVER_PID"
echo ""
echo "For production build: npm run package:prod"