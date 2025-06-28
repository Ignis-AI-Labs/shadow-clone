import { ethers } from 'ethers';

// Ignis Elite NFT Contract Addresses
export const IGNIS_CONTRACTS = {
  PHASE_1: '0x42347db440ef412bbe19c0841895a4b98256885b',
  PHASE_2: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
  PHASE_3: '0xab505a667039d08d8e33cef95c81897a8b5fed1a'
} as const;

// ERC721 ABI - only the functions we need
const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)'
];

export interface NFTOwnership {
  phase: 'phase_1' | 'phase_2' | 'phase_3';
  contract: string;
  tokenIds: number[];
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
    for (const [phase, contractAddress] of Object.entries(IGNIS_CONTRACTS)) {
      try {
        const ownership = await this.checkContractOwnership(
          walletAddress,
          contractAddress,
          phase.toLowerCase().replace('_', '_') as 'phase_1' | 'phase_2' | 'phase_3'
        );
        
        if (ownership.tokenIds.length > 0) {
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
   * Check ownership for a specific contract
   */
  private async checkContractOwnership(
    walletAddress: string,
    contractAddress: string,
    phase: 'phase_1' | 'phase_2' | 'phase_3'
  ): Promise<NFTOwnership> {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
    
    // Get balance
    const balance = await contract.balanceOf(walletAddress);
    const tokenCount = Number(balance);
    
    const tokenIds: number[] = [];
    
    // If they own tokens, get the token IDs
    if (tokenCount > 0) {
      // Try to get collection name
      let collectionName: string | undefined;
      try {
        collectionName = await contract.name();
      } catch (error) {
        // Some contracts might not have a name function
      }
      
      // Get all token IDs owned by this wallet
      // Note: tokenOfOwnerByIndex might not be available on all contracts
      // If it fails, we'll just return that they own tokens without specific IDs
      try {
        for (let i = 0; i < tokenCount; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
          tokenIds.push(Number(tokenId));
        }
      } catch (error) {
        // If enumeration isn't supported, we at least know they own tokens
        console.log(`Contract ${contractAddress} doesn't support enumeration`);
      }
    }
    
    return {
      phase,
      contract: contractAddress,
      tokenIds,
      collectionName
    };
  }

  /**
   * Verify ownership of a specific token
   */
  async verifyTokenOwnership(
    contractAddress: string,
    tokenId: number,
    expectedOwner: string
  ): Promise<boolean> {
    try {
      const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
      const owner = await contract.ownerOf(tokenId);
      return owner.toLowerCase() === expectedOwner.toLowerCase();
    } catch (error) {
      console.error('Error verifying token ownership:', error);
      return false;
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