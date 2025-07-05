'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { Header } from '@/components/Header';
import { PortalCard } from '@/components/PortalCard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  activeProjects: number;
  securityAlerts: number;
  totalLicenses: number;
}

export default function Home() {
  const { authToken } = useAdminAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeProjects: 0,
    securityAlerts: 0,
    totalLicenses: 777,
  });

  useEffect(() => {
    if (authToken) {
      fetchStats();
    }
  }, [authToken]);

  const fetchStats = async () => {
    try {
      const adminApiEndpoint = process.env.NEXT_PUBLIC_ADMIN_API_ENDPOINT || 'http://localhost:8787';
      const response = await fetch(`${adminApiEndpoint}/security/analytics`, {
        headers: { 'X-Admin-Token': authToken! },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalUsers: data.analytics.stats.totalUsers || 0,
          securityAlerts: data.analytics.stats.blockedUsers || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-ignis-dark">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ignis-green">{stats.totalUsers}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ignis-green">{stats.activeProjects}</div>
              <div className="text-sm text-gray-400">Active Projects</div>
            </div>
            <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ignis-green">{stats.securityAlerts}</div>
              <div className="text-sm text-gray-400">Security Alerts</div>
            </div>
            <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ignis-green">{stats.totalLicenses}</div>
              <div className="text-sm text-gray-400">Active Licenses</div>
            </div>
          </div>

          {/* Portal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PortalCard
              href="/security"
              icon="🛡️"
              title="Security Dashboard"
              description="Monitor security events, manage user restrictions, and view suspicious activities in real-time."
              isActive
            />
            
            <PortalCard
              href="/licenses"
              icon="🎫"
              title="License Management"
              description="Manage Shadow Clone licenses, verify NFT holders, and handle subscription activations."
              isComingSoon
            />
            
            <PortalCard
              href="/users"
              icon="👥"
              title="User Management"
              description="View user profiles, manage API keys, and monitor individual usage statistics."
              isComingSoon
            />
            
            <PortalCard
              href="/analytics"
              icon="📊"
              title="Analytics Dashboard"
              description="System-wide metrics, revenue analytics, and performance monitoring."
              isComingSoon
            />
            
            <PortalCard
              href="/billing"
              icon="💳"
              title="Billing & Subscriptions"
              description="Manage Stripe subscriptions, view payment history, and handle invoices."
              isComingSoon
            />
            
            <PortalCard
              href="/projects"
              icon="🚀"
              title="Project Monitoring"
              description="Track active Shadow Clone projects, resource usage, and success rates."
              isComingSoon
            />
            
            <PortalCard
              href="/logs"
              icon="📜"
              title="System Logs"
              description="View audit trails, API access logs, and system error reports."
              isComingSoon
            />
            
            <PortalCard
              href="/settings"
              icon="⚙️"
              title="Settings"
              description="Configure system settings, feature flags, and notification preferences."
              isComingSoon
            />
            
            <PortalCard
              href="/api-keys"
              icon="🔑"
              title="API Management"
              description="Generate and manage admin API keys, set rate limits, and track usage."
              isComingSoon
            />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}