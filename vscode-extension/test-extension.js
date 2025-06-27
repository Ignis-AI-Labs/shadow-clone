const axios = require('axios');

const API_URL = 'http://localhost:3001';
const API_KEY = 'test-key-123';

async function testExtension() {
    console.log('🧪 Testing Shadow Clone Extension API\n');

    try {
        // Test 1: Authentication
        console.log('1️⃣ Testing Authentication...');
        const authResponse = await axios.post(`${API_URL}/auth/validate`, {
            apiKey: API_KEY
        });
        console.log('✅ Authentication successful:', authResponse.data);
        console.log('');

        // Test 2: Get User Profile
        console.log('2️⃣ Fetching User Profile...');
        const profileResponse = await axios.get(`${API_URL}/user/profile`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ User Profile:', profileResponse.data);
        console.log('');

        // Test 3: Get Projects
        console.log('3️⃣ Fetching Projects...');
        const projectsResponse = await axios.get(`${API_URL}/projects`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ Projects:', projectsResponse.data);
        console.log('');

        // Test 4: Get Credit Balance
        console.log('4️⃣ Fetching Credit Balance...');
        const creditsResponse = await axios.get(`${API_URL}/credits/balance`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ Credits:', creditsResponse.data);
        console.log('');

        // Test 5: Create a Project
        console.log('5️⃣ Creating a New Project...');
        const newProjectResponse = await axios.post(`${API_URL}/projects`, {
            name: 'Test Project from Extension',
            description: 'Testing Shadow Clone VS Code Extension',
            techStack: 'react-node',
            workspacePath: '/test/workspace',
            wavesDirectory: '.waves'
        }, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ Created Project:', newProjectResponse.data);
        console.log('');

        // Test 6: Get Active Agents
        console.log('6️⃣ Fetching Active Agents...');
        const agentsResponse = await axios.get(`${API_URL}/agents/active`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ Active Agents:', agentsResponse.data);
        console.log('');

        console.log('🎉 All tests passed! The extension API is working correctly.\n');
        console.log('Next steps to test the actual VS Code extension:');
        console.log('1. Open VS Code');
        console.log('2. Open the extension folder: code /root/repos/shadow-clone/vscode-extension');
        console.log('3. Press F5 to launch the extension');
        console.log('4. In the new VS Code window, click the Shadow Clone icon');
        console.log('5. Authenticate with API key: test-key-123');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

// Run the tests
testExtension();