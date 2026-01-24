/**
 * Test utilities for Shadow Clone MCP Server
 */

const V1_XOR_KEY = 'shadow-clone-2024';

/**
 * Helper: Create v1 (XOR) encrypted data for testing migration
 *
 * This replicates the legacy XOR encryption used in v1 format
 * for testing migration paths.
 *
 * @param plaintext - The plain text to encrypt
 * @returns Base64 encoded XOR-encrypted string
 */
export function createV1EncryptedData(plaintext: string): string {
  let encrypted = '';
  for (let i = 0; i < plaintext.length; i++) {
    encrypted += String.fromCharCode(
      plaintext.charCodeAt(i) ^ V1_XOR_KEY.charCodeAt(i % V1_XOR_KEY.length)
    );
  }
  return Buffer.from(encrypted, 'binary').toString('base64');
}
