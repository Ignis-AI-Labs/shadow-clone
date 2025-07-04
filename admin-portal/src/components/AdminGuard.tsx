'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isConnected, authToken, authenticate, isLoading, address } = useAdminAuth();

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
          <ConnectButton />
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
          <p className="text-sm text-gray-500">
            Connected: {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
          <div className="mt-6">
            <ConnectButton />
          </div>
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
        </div>
      </div>
    );
  }

  return <>{children}</>;
}