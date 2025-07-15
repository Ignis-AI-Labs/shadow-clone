#!/bin/bash

# Shadow Clone API Endpoint Test Script
# Usage: ./test-shadow-clone-endpoints.sh <API_KEY>

API_KEY="${1:-sc--mPHsUrZf4J1y0u_1kRgcf7BQ3tYOsnqpAwC562D6MxB2APifDYs9BERAqKwyISu}"
BASE_URL="https://api.elijah-02b.workers.dev"

echo "🧪 Testing Shadow Clone API Endpoints"
echo "=====================================\n"

# Test main prompt
echo "1. Testing /api/prompts/shadow-clone..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/shadow-clone" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Main prompt: SUCCESS"
  echo "   Version: $(echo "$RESPONSE" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)"
else
  echo "❌ Main prompt: FAILED"
  echo "$RESPONSE" | head -c 200
fi
echo ""

# Test modes list
echo "2. Testing /api/prompts/modes..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/modes" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Modes list: SUCCESS"
  echo "   Available modes: $(echo "$RESPONSE" | grep -o '"modes":\[[^]]*\]' | cut -d'[' -f2 | cut -d']' -f1)"
else
  echo "❌ Modes list: FAILED"
fi
echo ""

# Test specific mode
echo "3. Testing /api/prompts/modes/feature..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/modes/feature" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Feature mode: SUCCESS"
else
  echo "❌ Feature mode: FAILED"
fi
echo ""

# Test agent rules
echo "4. Testing /api/prompts/agent-rules/core_agent_rules..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/agent-rules/core_agent_rules" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Core agent rules: SUCCESS"
else
  echo "❌ Core agent rules: FAILED"
fi
echo ""

# Test coordination rules list
echo "5. Testing /api/prompts/coordination-rules..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/coordination-rules" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Coordination rules list: SUCCESS"
  echo "   Available rules: $(echo "$RESPONSE" | grep -o '"rules":\[[^]]*\]' | cut -d'[' -f2 | cut -d']' -f1)"
else
  echo "❌ Coordination rules list: FAILED"
fi
echo ""

# Test specific coordination rule
echo "6. Testing /api/prompts/coordination-rules/wave_coordination..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/coordination-rules/wave_coordination" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Wave coordination rule: SUCCESS"
else
  echo "❌ Wave coordination rule: FAILED"
fi
echo ""

# Test template
echo "7. Testing /api/prompts/templates/agent_templates..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/templates/agent_templates" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Agent templates: SUCCESS"
else
  echo "❌ Agent templates: FAILED"
fi
echo ""

# Test execution phase
echo "8. Testing /api/prompts/execution-phases/phase1_analysis..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prompts/execution-phases/phase1_analysis" -H "X-API-Key: $API_KEY")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Phase 1 analysis: SUCCESS"
else
  echo "❌ Phase 1 analysis: FAILED"
fi
echo ""

echo "=================================="
echo "🎉 Shadow Clone API test complete!"
echo ""
echo "Note: This is currently deployed to the workers.dev domain."
echo "For production, update to api.ignislabs.ai"