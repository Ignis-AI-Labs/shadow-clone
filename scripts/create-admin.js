// Script to create an admin user for Shadow Clone
// Run this locally or adapt for your environment

const CLOUDFLARE_API_TOKEN = 'YOUR_CLOUDFLARE_API_TOKEN';
const ACCOUNT_ID = 'YOUR_ACCOUNT_ID';
const NAMESPACE_ID = '1685957a286a4212be202332e2dce051'; // USERS namespace

async function createAdminUser() {
    const adminUserId = 'admin-' + Date.now();
    const adminApiKey = 'sk-admin-' + Math.random().toString(36).substr(2, 32);
    
    const adminUser = {
        id: adminUserId,
        email: 'admin@shadow-clone.ai',
        name: 'Admin User',
        role: 'admin',
        isAdmin: true,
        licenseType: 'admin',
        createdAt: new Date().toISOString(),
    };

    console.log('Creating admin user...');
    console.log('Admin API Key:', adminApiKey);
    console.log('Save this key securely!');

    // Store user data
    await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${adminUserId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminUser),
        }
    );

    // Store API key mapping
    await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/da0cfb3f101843bdb2e58e127e2110c1/values/${adminApiKey}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'text/plain',
            },
            body: adminUserId,
        }
    );

    console.log('Admin user created successfully!');
}

// To create an admin user, run this script with your Cloudflare credentials
console.log('Update the Cloudflare credentials above and run this script to create an admin user');

// Uncomment to run:
// createAdminUser();