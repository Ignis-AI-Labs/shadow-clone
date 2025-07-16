#!/bin/bash

echo "Testing Ignis Dashboard API Integration"
echo "======================================="
echo ""

# Test variables
API_KEY="YOUR_API_KEY_HERE"
API_URL="https://api.ignislabs.ai"

echo "1. Testing license validation endpoint:"
echo "URL: $API_URL/shadow-clone-licenses/validate"
echo ""

# Test the validation endpoint
curl -X POST "$API_URL/shadow-clone-licenses/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{\"apiKey\": \"$API_KEY\"}" \
  -v

echo ""
echo ""
echo "2. Testing alternative request format (body only):"
curl -X POST "$API_URL/shadow-clone-licenses/validate" \
  -H "Content-Type: application/json" \
  -d "{\"apiKey\": \"$API_KEY\"}" \
  -v

echo ""
echo ""
echo "3. Testing alternative request format (header only):"
curl -X POST "$API_URL/shadow-clone-licenses/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -v

echo ""
echo "Check the responses above to see which format works!"