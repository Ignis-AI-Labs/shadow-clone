import { useState, useEffect } from 'react';
import { useSimpleWallet } from './useSimpleWallet';

const ADMIN_API_ENDPOINT = process.env.NEXT_PUBLIC_ADMIN_API_ENDPOINT || 'https://admin.ignislabs.ai';

export function useAdminAuthSimple() {
  const { address, isConnected, isAdmin, signMessage, connect, disconnect, isConnecting, hasMetaMask } = useSimpleWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    if (!address || !isAdmin) return;

    setIsLoading(true);
    setError(null);
    
    console.log('Starting authentication...');
    console.log('API Endpoint:', ADMIN_API_ENDPOINT);
    console.log('Wallet Address:', address);
    
    try {
      const timestamp = Date.now();
      const message = `Shadow Clone Admin Access\nTimestamp: ${timestamp}\nWallet: ${address}`;
      
      // Sign the message to prove wallet ownership
      console.log('Requesting wallet signature...');
      const signature = await signMessage(message);
      console.log('Signature obtained:', signature.slice(0, 20) + '...');
      
      // Authenticate with the backend
      console.log('Sending authentication request to:', `${ADMIN_API_ENDPOINT}/auth/wallet`);
      const response = await fetch(`${ADMIN_API_ENDPOINT}/auth/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          signature,
          wallet: address,
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Response might not be JSON
          const text = await response.text();
          console.error('Response body:', text);
        }
        throw new Error(errorMessage);
      }
      
      const { token } = await response.json();
      
      setAuthToken(token);
      
      // Store in session storage
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminSignature', signature);
      sessionStorage.setItem('adminTimestamp', timestamp.toString());
      
      return token;
    } catch (error) {
      console.error('Authentication error details:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Wallet signature cancelled';
          setError(errorMessage);
          return;
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to admin API. Please check if the admin portal is deployed.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      alert(`Authentication failed: ${errorMessage}\n\nCheck browser console for details.`);
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
    error,
    connect,
    disconnect,
    isConnecting,
    hasMetaMask,
  };
}