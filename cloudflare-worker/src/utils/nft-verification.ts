import { ethers } from 'ethers';

// Ignis Elite NFT Contract Addresses and Token IDs
export const IGNIS_CONTRACTS = {
  PHASE_1: {
    address: '0x42347db440ef412bbe19c0841895a4b98256885b',
    tokenId: 1
  },
  PHASE_2: {
    address: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
    tokenId: 0
  },
  PHASE_3: {
    address: '0xab505a667039d08d8e33cef95c81897a8b5fed1a',
    tokenId: 0
  }
} as const;

// ERC1155 ABI - only the functions we need
const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])',
  'function uri(uint256 id) view returns (string)',
  'function name() view returns (string)'
];

export interface NFTOwnership {
  phase: 'phase_1' | 'phase_2' | 'phase_3';
  contract: string;
  tokenId: number;
  balance: number;
  collectionName?: string;
}

export class NFTVerifier {
  private provider: ethers.JsonRpcProvider;
  
  constructor(rpcUrl: string = 'https://eth-mainnet.g.alchemy.com/v2/demo') {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Verify ownership across all Ignis Elite contracts
   */
  async verifyIgnisEliteOwnership(walletAddress: string): Promise<NFTOwnership[]> {
    const ownerships: NFTOwnership[] = [];
    
    // Check each phase contract
    for (const [phase, config] of Object.entries(IGNIS_CONTRACTS)) {
      try {
        const ownership = await this.checkERC1155Ownership(
          walletAddress,
          config.address,
          config.tokenId,
          phase.toLowerCase().replace('_', '_') as 'phase_1' | 'phase_2' | 'phase_3'
        );
        
        if (ownership.balance > 0) {
          ownerships.push(ownership);
        }
      } catch (error) {
        console.error(`Error checking ${phase}:`, error);
        // Continue checking other contracts even if one fails
      }
    }
    
    return ownerships;
  }

  /**
   * Check ownership for a specific ERC-1155 contract
   */
  private async checkERC1155Ownership(
    walletAddress: string,
    contractAddress: string,
    tokenId: number,
    phase: 'phase_1' | 'phase_2' | 'phase_3'
  ): Promise<NFTOwnership> {
    const contract = new ethers.Contract(contractAddress, ERC1155_ABI, this.provider);
    
    // Get balance for specific token ID
    const balance = await contract.balanceOf(walletAddress, tokenId);
    const tokenBalance = Number(balance);
    
    // Try to get collection name
    let collectionName: string | undefined;
    try {
      collectionName = await contract.name();
    } catch (error) {
      // Some contracts might not have a name function
      // For ERC-1155, we could try getting the URI instead
      try {
        const uri = await contract.uri(tokenId);
        // Extract collection name from URI if possible
        collectionName = `Ignis Elite ${phase.replace('phase_', 'Phase ')}`;
      } catch (e) {
        collectionName = `Ignis Elite ${phase.replace('phase_', 'Phase ')}`;
      }
    }
    
    return {
      phase,
      contract: contractAddress,
      tokenId,
      balance: tokenBalance,
      collectionName
    };
  }

  /**
   * Verify ownership of a specific ERC-1155 token
   */
  async verifyERC1155TokenOwnership(
    contractAddress: string,
    tokenId: number,
    walletAddress: string
  ): Promise<number> {
    try {
      const contract = new ethers.Contract(contractAddress, ERC1155_ABI, this.provider);
      const balance = await contract.balanceOf(walletAddress, tokenId);
      return Number(balance);
    } catch (error) {
      console.error('Error verifying token ownership:', error);
      return 0;
    }
  }
}

/**
 * Format license type based on NFT phase
 */
export function getLicenseTypeFromPhase(phase: string): string {
  return `ignis_elite_${phase}`;
}

/**
 * Get display name for phase
 */
export function getPhaseDisplayName(phase: string): string {
  const displayNames = {
    'phase_1': 'Ignis Elite Phase 1',
    'phase_2': 'Ignis Elite Phase 2',
    'phase_3': 'Ignis Elite Phase 3'
  };
  return displayNames[phase as keyof typeof displayNames] || phase;
}