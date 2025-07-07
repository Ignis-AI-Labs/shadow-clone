#!/bin/bash

echo "Checking Admin Portal Deployment Status"
echo "======================================="
echo ""

# Check if the admin portal frontend is accessible
echo "1. Checking admin portal frontend (admin.ignislabs.ai):"
curl -I https://admin.ignislabs.ai 2>/dev/null | head -n 1
echo ""

# Check if the API endpoint is accessible
echo "2. Checking admin API endpoints:"
echo "   - Auth endpoint (OPTIONS):"
curl -X OPTIONS https://admin.ignislabs.ai/auth/wallet -H "Origin: https://admin.ignislabs.ai" -I 2>/dev/null | head -n 1

echo ""
echo "   - Auth endpoint (POST test):"
curl -X POST https://admin.ignislabs.ai/auth/wallet \
  -H "Content-Type: application/json" \
  -H "Origin: https://admin.ignislabs.ai" \
  -d '{"test": true}' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null

echo ""
echo "3. Checking CORS headers:"
curl -I -X OPTIONS https://admin.ignislabs.ai/auth/wallet \
  -H "Origin: https://admin.ignislabs.ai" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  2>/dev/null | grep -i "access-control"

echo ""
echo "========================================="
echo "If you see 404 or connection errors above, the API is not properly deployed."
echo "To deploy the admin portal:"
echo "  cd /root/repos/shadow-clone/admin-portal"
echo "  npm run deploy"