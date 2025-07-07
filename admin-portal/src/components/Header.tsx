'use client';

import Link from 'next/link';
import { useAdminAuthSimple } from '@/hooks/useAdminAuthSimple';

export function Header() {
  const { address, disconnect } = useAdminAuthSimple();
  
  return (
    <header className="bg-ignis-card border-b border-ignis-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-ignis-green">
              🔐 Ignis Labs Admin
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {address && (
              <>
                <span className="text-sm text-gray-400">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}