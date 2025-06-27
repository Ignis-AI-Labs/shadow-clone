#!/usr/bin/env node

/**
 * Test script for Shadow Clone prompts API endpoints
 * Run with: node test-prompts-api.js
 */

const API_BASE = 'http://localhost:8787'; // Wrangler dev server
const API_KEY = 'test-api-key'; // Replace with a valid test API key

async function testEndpoint(name, endpoint, options = {}) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Success');
      console.log('   Response structure:', Object.keys(data));
      
      // Show sample of response
      if (data.prompt) {
        console.log(`   Prompt length: ${data.prompt.length} characters`);
        console.log(`   First 100 chars: ${data.prompt.substring(0, 100)}...`);
      }
      if (data.modes) {
        console.log(`   Available modes: ${data.modes.map(m => m.name).join(', ')}`);
      }
      if (data.config) {
        console.log(`   Config length: ${data.config.length} characters`);
        console.log(`   Mode: ${data.mode}`);
      }
    } else {
      console.log('   ❌ Error:', data.error);
    }
    
    return data;
  } catch (error) {
    console.log(`   ❌ Request failed: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Shadow Clone Prompts API Test Suite');
  console.log('=====================================');
  
  // Test 1: Get main prompt
  await testEndpoint(
    'Get Shadow Clone Prompt',
    '/api/prompts/shadow-clone'
  );
  
  // Test 2: Get all modes
  const modesResponse = await testEndpoint(
    'List All Modes',
    '/api/prompts/modes'
  );
  
  // Test 3: Get specific mode configs
  if (modesResponse && modesResponse.modes) {
    for (const mode of modesResponse.modes) {
      await testEndpoint(
        `Get ${mode.name} Mode Config`,
        `/api/prompts/modes/${mode.name}`
      );
    }
  }
  
  // Test 4: Test invalid mode
  await testEndpoint(
    'Get Invalid Mode (should 404)',
    '/api/prompts/modes/invalid-mode'
  );
  
  // Test 5: Test without API key
  await testEndpoint(
    'Request without API Key (should 401)',
    '/api/prompts/shadow-clone',
    {
      headers: {
        'X-API-Key': null // Remove API key
      }
    }
  );
  
  console.log('\n✨ Test suite complete!');
}

// Check if running locally
if (process.argv.includes('--help')) {
  console.log(`
Usage: node test-prompts-api.js [options]

Options:
  --api-key <key>    Use a specific API key for testing
  --base-url <url>   Use a different base URL (default: http://localhost:8787)
  --help             Show this help message

Examples:
  node test-prompts-api.js
  node test-prompts-api.js --api-key your-test-key
  node test-prompts-api.js --base-url https://api.shadowclone.ai
  `);
  process.exit(0);
}

// Parse command line args
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  if (args[i] === '--api-key') {
    API_KEY = args[i + 1];
  } else if (args[i] === '--base-url') {
    API_BASE = args[i + 1];
  }
}

// Run tests
runTests().catch(console.error);