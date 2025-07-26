import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { logger } from '../utils/logger.js';

interface AuthData {
  apiKey: string;
  userId: string;
  licenseType: string;
  isActive: boolean;
  timestamp: number;
}

export class AuthService {
  private authData: AuthData | null = null;
  private authFilePath: string;
  private apiEndpoint: string;

  constructor() {
    // Store auth data in user's home directory
    const configDir = path.join(os.homedir(), '.shadow-clone');
    this.authFilePath = path.join(configDir, 'mcp-auth.json');
    this.apiEndpoint = process.env.SHADOW_CLONE_API_ENDPOINT || 'https://api.ignislabs.ai';
    
    this.loadAuthData();
  }

  private async ensureConfigDir() {
    const configDir = path.dirname(this.authFilePath);
    try {
      await fs.mkdir(configDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create config directory:', error);
    }
  }

  private async loadAuthData() {
    try {
      const data = await fs.readFile(this.authFilePath, 'utf-8');
      this.authData = JSON.parse(data);
      
      // Check if auth is expired (24 hours)
      if (this.authData && Date.now() - this.authData.timestamp > 24 * 60 * 60 * 1000) {
        logger.info('Auth data expired, clearing...');
        this.authData = null;
        await this.clearAuth();
      }
    } catch (error) {
      // File doesn't exist or is invalid
      this.authData = null;
    }
  }

  private async saveAuthData() {
    if (!this.authData) return;
    
    try {
      await this.ensureConfigDir();
      await fs.writeFile(this.authFilePath, JSON.stringify(this.authData, null, 2));
      // Set restrictive permissions (owner read/write only)
      await fs.chmod(this.authFilePath, 0o600);
    } catch (error) {
      logger.error('Failed to save auth data:', error);
    }
  }

  private async clearAuth() {
    try {
      await fs.unlink(this.authFilePath);
    } catch (error) {
      // File might not exist
    }
  }

  async authenticate(apiKey: string): Promise<{ success: boolean; licenseType?: string; message?: string }> {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          }
        }
      );

      if (response.data.valid) {
        const isActive = response.data.isActive !== false;
        
        this.authData = {
          apiKey,
          userId: response.data.userId,
          licenseType: response.data.licenseType,
          isActive,
          timestamp: Date.now()
        };
        
        await this.saveAuthData();
        
        if (!isActive) {
          return {
            success: true,
            licenseType: response.data.licenseType,
            message: 'Your license is currently inactive. Please check your subscription status.'
          };
        }
        
        return { 
          success: true, 
          licenseType: response.data.licenseType 
        };
      }
      
      return { success: false, message: 'Invalid API key' };
    } catch (error: any) {
      logger.error('Authentication failed:', error);
      
      if (error.response?.status === 401) {
        return { success: false, message: 'Invalid API key. Please check your credentials.' };
      } else if (error.response?.status === 403) {
        return { success: false, message: 'Access denied. Your license may have expired.' };
      }
      
      return { success: false, message: 'Authentication failed. Please try again.' };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    await this.loadAuthData();
    return this.authData !== null && this.authData.isActive;
  }

  async getApiKey(): Promise<string | null> {
    await this.loadAuthData();
    return this.authData?.apiKey || null;
  }

  async getLicenseType(): Promise<string | null> {
    await this.loadAuthData();
    return this.authData?.licenseType || null;
  }

  async makeAuthenticatedRequest(url: string, options: any = {}): Promise<any> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Not authenticated');
    }

    return axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        'X-API-Key': apiKey,
        'User-Agent': 'Shadow-Clone-MCP/0.1.0'
      }
    });
  }

  getApiEndpoint(): string {
    return this.apiEndpoint;
  }
}