#!/usr/bin/env node

/**
 * Shadow Clone Local Mode Runner
 * Quick access to Shadow Clone functions for the creator
 */

const fs = require('fs');
const path = require('path');

// Check if we're in creator mode
const creatorConfigPath = path.join(__dirname, 'creator-config.json');
if (!fs.existsSync(creatorConfigPath)) {
    console.error('❌ Creator config not found. This is for Shadow Clone creator only.');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(creatorConfigPath, 'utf8'));
if (!config.creator || config.mode !== 'CREATOR_PRIVILEGED') {
    console.error('❌ Not in creator mode.');
    process.exit(1);
}

console.log('🚀 Shadow Clone LOCAL MODE - Creator Privileges Active');
console.log('=====================================================\n');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage: node use-local.js <command> [options]\n');
    console.log('Quick Commands:');
    console.log('  quick_fix <bug|style|logic|performance|security> "description"');
    console.log('  specialist <type> "task"');
    console.log('  review <security|performance|quality> [files...]');
    console.log('  tests <unit|integration|e2e> [files...]');
    console.log('  wave <research|planning|implementation> "scope"');
    console.log('  docs <api|user_guide|developer> "scope"');
    console.log('  architect <design_review|pattern_recommendation> "context"');
    console.log('  status - Show creator mode status');
    console.log('\nExamples:');
    console.log('  node use-local.js quick_fix bug "Null pointer in user service"');
    console.log('  node use-local.js specialist react_expert "Optimize render performance"');
    console.log('  node use-local.js review security src/auth.js src/api.js');
    console.log('  node use-local.js tests unit src/utils.js');
    process.exit(0);
}

// Command shortcuts
const commandMap = {
    'quick_fix': 'quick_fix',
    'fix': 'quick_fix',
    'specialist': 'deploy_specialist',
    'expert': 'deploy_specialist',
    'review': 'code_review',
    'tests': 'generate_tests',
    'test': 'generate_tests',
    'wave': 'execute_single_wave',
    'docs': 'create_documentation',
    'doc': 'create_documentation',
    'architect': 'architecture_consultant',
    'arch': 'architecture_consultant',
    'status': 'show_status',
    'commands': 'show_commands'
};

// Specialist shortcuts
const specialistMap = {
    'react': 'react_expert',
    'api': 'api_designer',
    'db': 'database_architect',
    'database': 'database_architect',
    'test': 'test_engineer',
    'perf': 'performance_analyst',
    'security': 'security_auditor',
    'review': 'code_reviewer',
    'docs': 'documentation_writer'
};

const command = commandMap[args[0]] || args[0];

// Build arguments based on command
let toolArgs = {};

switch (command) {
    case 'quick_fix':
        toolArgs = {
            issueType: args[1] || 'bug',
            description: args[2] || 'Issue to fix',
            filePath: args[3],
            urgency: args[4]
        };
        break;
        
    case 'deploy_specialist':
        toolArgs = {
            specialization: specialistMap[args[1]] || args[1] || 'react_expert',
            task: args[2] || 'Optimize implementation',
            context: args[3]
        };
        break;
        
    case 'code_review':
        toolArgs = {
            reviewType: args[1] || 'quality',
            files: args.slice(2).length > 0 ? args.slice(2) : ['current file']
        };
        break;
        
    case 'generate_tests':
        toolArgs = {
            testType: args[1] || 'unit',
            targetFiles: args.slice(2).length > 0 ? args.slice(2) : ['current file']
        };
        break;
        
    case 'execute_single_wave':
        toolArgs = {
            waveType: args[1] || 'research',
            scope: args[2] || 'Current project scope'
        };
        break;
        
    case 'create_documentation':
        toolArgs = {
            docType: args[1] || 'developer',
            scope: args[2] || 'Current project'
        };
        break;
        
    case 'architecture_consultant':
        toolArgs = {
            consultationType: args[1] || 'design_review',
            context: args[2] || 'Current architecture'
        };
        break;
        
    case 'show_status':
        console.log('✅ Creator Mode Active');
        console.log('📍 Location:', __dirname);
        console.log('🔓 Authentication: Bypassed');
        console.log('♾️  License: UNLIMITED');
        console.log('🛠️  All features enabled');
        process.exit(0);
        
    case 'show_commands':
        toolArgs = { category: 'all' };
        break;
        
    default:
        console.error(`Unknown command: ${args[0]}`);
        console.log('Run with --help to see available commands');
        process.exit(1);
}

// Load and execute the local server
try {
    const { executeLocalTool } = require('./local-server.js');
    
    executeLocalTool(command, toolArgs).then(result => {
        console.log(result);
    }).catch(err => {
        console.error('Error:', err.message);
    });
} catch (error) {
    // TypeScript not compiled, use the functions directly
    console.log(`\n📋 Command: ${command}`);
    console.log('📦 Arguments:', JSON.stringify(toolArgs, null, 2));
    console.log('\n✨ This would execute the Shadow Clone methodology locally.');
    console.log('🔧 Compile local-server.ts first for full functionality.');
}