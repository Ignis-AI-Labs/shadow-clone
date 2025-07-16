#!/usr/bin/env node

/**
 * Test script for Shadow Clone API endpoints
 * Tests all available endpoints with a valid API key
 */

const API_KEY = process.env.SHADOW_CLONE_API_KEY;
const BASE_URL = 'https://api.ignislabs.ai';

if (!API_KEY) {
  console.error('❌ Error: SHADOW_CLONE_API_KEY environment variable not set');
  console.log('Usage: SHADOW_CLONE_API_KEY=your-key node test-shadow-clone-endpoints.js');
  process.exit(1);
}

// COMPLETE LIST OF ALL SHADOW CLONE ENDPOINTS
// This is EVERYTHING available - no more, no less
const endpoints = [
  // Core endpoints
  '/api/prompts/shadow-clone',              // Main shadow clone prompt
  '/api/prompts',                           // List all prompts (JSON)
  '/api/prompts/manifest',                  // Cloudflare manifest
  '/api/prompts/license',                   // License info
  
  // Mode endpoints
  '/api/prompts/modes',                     // List modes (JSON)
  '/api/prompts/modes/audit',               // Audit mode
  '/api/prompts/modes/debug',               // Debug mode
  '/api/prompts/modes/feature',             // Feature mode
  '/api/prompts/modes/optimize',            // Optimize mode
  '/api/prompts/modes/plan',                // Plan mode
  '/api/prompts/modes/refactor',            // Refactor mode
  '/api/prompts/modes/research',            // Research mode
  
  // Agent rules endpoints
  '/api/prompts/agent-rules',               // List agent rules (JSON)
  '/api/prompts/agent-rules/README',        // Agent rules docs
  '/api/prompts/agent-rules/agent-template', // Agent template
  '/api/prompts/agent-rules/core-rules',    // Core rules
  
  // Template endpoints
  '/api/prompts/templates',                 // List templates (JSON)
  '/api/prompts/templates/master-plan-template',           // Master plan
  '/api/prompts/templates/security-audit-report-template', // Security audit
  '/api/prompts/templates/mode-completion-template',       // Mode completion
  '/api/prompts/templates/team-agent-templates'            // Team agents
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n📍 Testing: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error(`   Error: ${error}`);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`✅ Success: ${response.status}`);
    console.log(`   Content-Type: ${contentType}`);
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
    } else {
      const text = await response.text();
      console.log(`   Length: ${text.length} characters`);
      console.log(`   Preview: ${text.substring(0, 100)}...`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Shadow Clone API Endpoint Tests');
  console.log('================================');
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Base URL: ${BASE_URL}`);
  
  let passed = 0;
  let failed = 0;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${endpoints.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});