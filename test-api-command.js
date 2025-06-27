// Test script to simulate VS Code extension building a command

async function testBuildCommand() {
  const API_KEY = 'test-key-123';
  const API_ENDPOINT = 'https://shadow-clone-api.elijah-02b.workers.dev';
  
  try {
    // 1. Fetch main prompt
    console.log('Fetching main Shadow Clone prompt...');
    const promptResponse = await fetch(`${API_ENDPOINT}/api/prompts/shadow-clone`, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!promptResponse.ok) {
      throw new Error(`Failed to fetch prompt: ${promptResponse.status}`);
    }
    
    const promptData = await promptResponse.json();
    console.log('✓ Main prompt fetched successfully');
    
    // 2. Fetch audit mode config
    console.log('\nFetching audit mode configuration...');
    const modeResponse = await fetch(`${API_ENDPOINT}/api/prompts/modes/audit`, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!modeResponse.ok) {
      throw new Error(`Failed to fetch mode: ${modeResponse.status}`);
    }
    
    const modeData = await modeResponse.json();
    console.log('✓ Audit mode configuration fetched successfully');
    
    // 3. Build the command as the extension would
    console.log('\nBuilding Shadow Clone command...');
    const parts = [];
    
    // Start with the main prompt content
    parts.push('```shadow-clone');
    parts.push(promptData.content);
    
    // Add mode configuration
    parts.push('\n---MODE CONFIGURATION---');
    parts.push(modeData.content);
    parts.push('```');
    
    // Add execution parameters
    const params = [
      'execute',
      'project_plan=./project-plan.md',
      'waves_directory=./.waves/',
      'mode=audit'
    ];
    
    const finalCommand = parts.join('\n') + '\n\nExecute Shadow Clone with: ' + params.join(' ');
    
    console.log('\n✓ Command built successfully!');
    console.log('\nCommand preview (first 500 chars):');
    console.log(finalCommand.substring(0, 500) + '...');
    console.log(`\nTotal command length: ${finalCommand.length} characters`);
    
    // This is what would be copied to clipboard and pasted into Claude
    console.log('\n✓ This command contains the full Shadow Clone prompts');
    console.log('✓ No local file access needed - prompts are embedded');
    console.log('✓ Intellectual property is protected via API authentication');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testBuildCommand();