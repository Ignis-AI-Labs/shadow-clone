const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying obfuscation of production build...\n');

const outputFile = path.join(__dirname, '../out/extension.js');

if (!fs.existsSync(outputFile)) {
    console.error('❌ Build output not found. Run "npm run build:prod" first.');
    process.exit(1);
}

const content = fs.readFileSync(outputFile, 'utf8');
const fileSize = fs.statSync(outputFile).size;

// Check for obfuscation indicators
const checks = {
    'String array encoding': content.includes('atob') || content.includes('Buffer.from'),
    'Hexadecimal identifiers': /\b0x[a-f0-9]+\b/i.test(content),
    'Control flow flattening': content.includes('switch') && content.includes('case'),
    'No console.log statements': !content.includes('console.log'),
    'No readable function names': !/function\s+[a-zA-Z_]\w+/.test(content),
    'Minified code': fileSize < 500000 && content.split('\n').length < 100,
    'Self-defending code': content.includes('debugger') || content.includes('constructor'),
    'No source maps': !fs.existsSync(outputFile + '.map')
};

console.log('Obfuscation checks:');
let passed = 0;
let failed = 0;

for (const [check, result] of Object.entries(checks)) {
    if (result) {
        console.log(`✅ ${check}`);
        passed++;
    } else {
        console.log(`❌ ${check}`);
        failed++;
    }
}

console.log(`\nFile size: ${(fileSize / 1024).toFixed(2)} KB`);
console.log(`\nSummary: ${passed} passed, ${failed} failed`);

if (failed > 2) {
    console.error('\n⚠️  Warning: Obfuscation may not be properly configured.');
    process.exit(1);
} else {
    console.log('\n✅ Obfuscation verification passed!');
}

// Sample the file to show obfuscation
console.log('\nSample of obfuscated code:');
console.log(content.substring(0, 200) + '...');