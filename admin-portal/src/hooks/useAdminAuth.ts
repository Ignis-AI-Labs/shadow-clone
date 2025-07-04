import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

const ADMIN_WALLET = '0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD'.toLowerCase();
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.ignislabs.ai';

export function useAdminAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setIsAdmin(address.toLowerCase() === ADMIN_WALLET);
    } else {
      setIsAdmin(false);
      setAuthToken(null);
    }
  }, [address]);

  const authenticate = async () => {
    if (!address || !isAdmin) return;

    setIsLoading(true);
    try {
      const timestamp = Date.now();
      const message = `Shadow Clone Admin Access\nTimestamp: ${timestamp}\nWallet: ${address}`;
      
      // Sign the message to prove wallet ownership
      const signature = await signMessageAsync({ message });
      
      // Since we already verified this is the admin wallet, just create a session token
      const token = `admin-${address}-${timestamp}-${Math.random().toString(36).substring(2, 15)}`;
      
      setAuthToken(token);
      
      // Store in session storage
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminSignature', signature);
      sessionStorage.setItem('adminTimestamp', timestamp.toString());
      
      return token;
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof Error && error.message.includes('User rejected')) {
        // User cancelled the signature
        return;
      }
      alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    const timestamp = sessionStorage.getItem('adminTimestamp');
    
    if (token && timestamp && isAdmin) {
      // Check if session is still valid (1 hour)
      const sessionAge = Date.now() - parseInt(timestamp);
      if (sessionAge < 3600000) { // 1 hour
        setAuthToken(token);
      } else {
        // Clear expired session
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminSignature');
        sessionStorage.removeItem('adminTimestamp');
      }
    }
  }, [isAdmin]);

  return {
    isAdmin,
    isConnected,
    isLoading,
    authToken,
    authenticate,
    address,
  };
}