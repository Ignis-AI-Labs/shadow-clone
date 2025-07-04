'use client';

import { AdminGuard } from '@/components/AdminGuard';
import { Header } from '@/components/Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SecurityEvent {
  userId: string;
  timestamp: string;
  eventType: string;
  details: string;
  ip?: string;
}

interface TopOffender {
  userId: string;
  attempts: number;
}

interface SecurityData {
  stats: {
    totalUsers: number;
    suspiciousUsers: number;
    blockedUsers: number;
    extractionAttempts: number;
    last24HourEvents: number;
  };
  recentEvents: SecurityEvent[];
  topOffenders: TopOffender[];
  blockedUsers: string[];
}

export default function SecurityDashboard() {
  const { authToken } = useAdminAuth();
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(0);

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  useEffect(() => {
    if (refreshInterval > 0 && authToken) {
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, authToken]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.ignislabs.ai/admin/security/analytics', {
        headers: { 'X-Admin-Token': authToken! },
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result.analytics);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (userId: string) => {
    if (!confirm(`Unblock user ${userId}?`)) return;

    try {
      const response = await fetch('https://api.ignislabs.ai/admin/security/unblock', {
        method: 'POST',
        headers: {
          'X-Admin-Token': authToken!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('User unblocked successfully');
        fetchData();
      }
    } catch (error) {
      alert('Failed to unblock user');
    }
  };

  const clearEvents = async (userId: string) => {
    if (!confirm(`Clear all events for user ${userId}? This cannot be undone.`)) return;

    try {
      const response = await fetch('https://api.ignislabs.ai/admin/security/clear-events', {
        method: 'POST',
        headers: {
          'X-Admin-Token': authToken!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Events cleared successfully');
        fetchData();
      }
    } catch (error) {
      alert('Failed to clear events');
    }
  };

  const getSeverityColor = (eventType: string) => {
    if (eventType.includes('extraction') || eventType.includes('high_risk')) return 'text-red-500';
    if (eventType.includes('suspicious') || eventType.includes('enumeration')) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-ignis-dark">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/" className="text-ignis-green hover:text-green-400 text-sm">
              ← Back to Portal
            </Link>
            <h1 className="text-2xl font-bold text-ignis-green mt-2">Security Dashboard</h1>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-ignis-card border border-ignis-border text-white px-4 py-2 rounded"
            >
              <option value="0">Auto-refresh: Disabled</option>
              <option value="10">Every 10 seconds</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every minute</option>
            </select>
            
            <button
              onClick={fetchData}
              className="bg-ignis-green text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
            >
              Refresh Now
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : data ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-ignis-green">{data.stats.totalUsers}</div>
                  <div className="text-sm text-gray-400">Total Users</div>
                </div>
                <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-ignis-green">{data.stats.suspiciousUsers}</div>
                  <div className="text-sm text-gray-400">Suspicious Users</div>
                </div>
                <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-ignis-green">{data.stats.blockedUsers}</div>
                  <div className="text-sm text-gray-400">Blocked Users</div>
                </div>
                <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-ignis-green">{data.stats.extractionAttempts}</div>
                  <div className="text-sm text-gray-400">Extraction Attempts</div>
                </div>
                <div className="bg-ignis-card border border-ignis-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-ignis-green">{data.stats.last24HourEvents}</div>
                  <div className="text-sm text-gray-400">24hr Events</div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-ignis-card border border-ignis-border rounded-lg mb-8">
                <h2 className="text-lg font-semibold p-4 border-b border-ignis-border">
                  Recent Security Events
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ignis-border">
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">User ID</th>
                        <th className="px-4 py-2 text-left">Event Type</th>
                        <th className="px-4 py-2 text-left">Details</th>
                        <th className="px-4 py-2 text-left">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEvents.length > 0 ? (
                        data.recentEvents.map((event, i) => (
                          <tr key={i} className="border-b border-gray-800">
                            <td className="px-4 py-2 text-sm">
                              {new Date(event.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm">{event.userId}</td>
                            <td className={`px-4 py-2 text-sm ${getSeverityColor(event.eventType)}`}>
                              {event.eventType}
                            </td>
                            <td className="px-4 py-2 text-sm">{event.details}</td>
                            <td className="px-4 py-2 text-sm">{event.ip || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No recent events
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Offenders */}
              <div className="bg-ignis-card border border-ignis-border rounded-lg">
                <h2 className="text-lg font-semibold p-4 border-b border-ignis-border">
                  Top Offenders
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ignis-border">
                        <th className="px-4 py-2 text-left">User ID</th>
                        <th className="px-4 py-2 text-left">Attempts</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topOffenders.length > 0 ? (
                        data.topOffenders.map((user, i) => (
                          <tr key={i} className="border-b border-gray-800">
                            <td className="px-4 py-2">{user.userId}</td>
                            <td className="px-4 py-2 text-red-500">{user.attempts}</td>
                            <td className="px-4 py-2">
                              {data.blockedUsers.includes(user.userId) ? (
                                <span className="text-red-500">🚫 Blocked</span>
                              ) : (
                                <span className="text-green-500">✅ Active</span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => unblockUser(user.userId)}
                                className="bg-gray-700 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-gray-600"
                              >
                                Unblock
                              </button>
                              <button
                                onClick={() => clearEvents(user.userId)}
                                className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                              >
                                Clear
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No offenders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Failed to load security data
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}