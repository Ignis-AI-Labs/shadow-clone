'use client';

import { useAdminAuthSimple } from '@/hooks/useAdminAuthSimple';

export function SimpleAdminGuard({ children }: { children: React.ReactNode }) {
  const { 
    isAdmin, 
    isConnected, 
    authToken, 
    authenticate, 
    isLoading, 
    address, 
    error,
    connect,
    isConnecting,
    hasMetaMask
  } = useAdminAuthSimple();

  if (!hasMetaMask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-ignis-card border border-red-500 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            MetaMask Required
          </h2>
          <p className="text-gray-400 mb-4">
            Please install MetaMask to access the admin portal.
          </p>
          <a 
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ignis-green text-black px-6 py-3 rounded font-semibold hover:bg-green-400 transition inline-block"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-ignis-card border border-ignis-border rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-ignis-green mb-4">
            Ignis Labs Admin Portal
          </h1>
          <p className="text-gray-400 mb-6">
            Connect your admin wallet to access the dashboard
          </p>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-ignis-green text-black px-6 py-3 rounded font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-ignis-card border border-red-500 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            ⛔ Unauthorized Access
          </h2>
          <p className="text-gray-400 mb-4">
            Your wallet is not authorized to access this admin portal.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Connected: {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
          <p className="text-xs text-gray-600 mb-6">
            Only the admin wallet can access this portal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Try Different Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-ignis-card border border-ignis-border rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-ignis-green mb-4">
            Sign to Continue
          </h2>
          <p className="text-gray-400 mb-6">
            Please sign the message to authenticate your admin access
          </p>
          <button
            onClick={authenticate}
            disabled={isLoading}
            className="bg-ignis-green text-black px-6 py-3 rounded font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {isLoading ? 'Signing...' : 'Sign Message'}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}