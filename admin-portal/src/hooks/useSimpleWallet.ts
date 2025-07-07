import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ADMIN_WALLET = '0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD'.toLowerCase();

export function useSimpleWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  // Check if MetaMask is installed
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

  // Check connection on mount
  useEffect(() => {
    if (hasMetaMask) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        handleAccountsChanged(accounts);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // Disconnected
      setAddress(null);
      setProvider(null);
      setSigner(null);
    } else {
      const newAddress = accounts[0].toLowerCase();
      setAddress(newAddress);
      
      // Set up provider and signer
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        setProvider(newProvider);
        setSigner(newSigner);
      }
    }
  };

  const connect = async () => {
    if (!hasMetaMask) {
      setError('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum!.request({ 
        method: 'eth_requestAccounts' 
      });
      
      await handleAccountsChanged(accounts);
      
      // Set up listeners
      window.ethereum!.on('accountsChanged', handleAccountsChanged);
      window.ethereum!.on('chainChanged', () => window.location.reload());
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    if (window.ethereum?.removeAllListeners) {
      window.ethereum.removeAllListeners();
    }
  };

  const signMessage = async (message: string) => {
    if (!signer) throw new Error('No signer available');
    return await signer.signMessage(message);
  };

  const isAdmin = address === ADMIN_WALLET;
  const isConnected = !!address;

  return {
    address,
    isConnected,
    isConnecting,
    isAdmin,
    error,
    connect,
    disconnect,
    signMessage,
    hasMetaMask,
  };
}