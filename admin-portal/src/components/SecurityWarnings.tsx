import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Activity, User, Clock } from 'lucide-react';

interface SecurityEvent {
  userId: string;
  timestamp: string;
  eventType: 'extraction_attempt' | 'rate_limit' | 'enumeration' | 'suspicious_pattern';
  details: string;
  requestPath: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface UserSecurityProfile {
  userId: string;
  suspicionScore: number;
  extractionAttempts: number;
  rateLimitViolations: number;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityWarnings: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [profiles, setProfiles] = useState<UserSecurityProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  useEffect(() => {
    fetchSecurityData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch recent security events
      const eventsRes = await fetch('/api/admin/security/events');
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      // Fetch user profiles with high suspicion scores
      const profilesRes = await fetch('/api/admin/security/profiles');
      const profilesData = await profilesRes.json();
      setProfiles(profilesData.profiles || []);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'extraction_attempt': return <Shield className="w-5 h-5" />;
      case 'rate_limit': return <Activity className="w-5 h-5" />;
      case 'enumeration': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.severity === filter;
  });

  return (
    <div className="space-y-6">
      {/* Security Mode Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-800">Security Monitoring Mode</h3>
        </div>
        <p className="mt-2 text-sm text-yellow-700">
          The security system is currently in <strong>monitoring-only mode</strong>. 
          All suspicious activities are logged for review but no automatic enforcement actions are taken.
          This allows administrators to review and make informed decisions about security measures.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'critical', 'high', 'medium'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === level
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
            {level !== 'all' && (
              <span className="ml-2 text-sm">
                ({events.filter(e => e.severity === level).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* High Risk Users */}
      {profiles.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-red-800 mb-3">High Risk Users</h4>
          <div className="space-y-2">
            {profiles
              .filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical')
              .map(profile => (
                <div key={profile.userId} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile.userId}</p>
                      <p className="text-sm text-gray-500">
                        Suspicion Score: {profile.suspicionScore} | 
                        Extraction Attempts: {profile.extractionAttempts} | 
                        Rate Violations: {profile.rateLimitViolations}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                    Review User
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Security Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Security Events</h3>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading security events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No security events to display</div>
          ) : (
            filteredEvents.slice(0, 20).map((event, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{event.eventType.replace('_', ' ').toUpperCase()}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{event.userId}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.timestamp).toLocaleString()}</span>
                        </span>
                        <span>Path: {event.requestPath}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                      Take Action
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Actions Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-800 mb-2">Admin Action Guide</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• <strong>Extraction Attempts:</strong> Review the user's activity history. Consider temporary suspension if pattern persists.</p>
          <p>• <strong>Rate Limit Violations:</strong> Check if usage is legitimate. May need to adjust limits for power users.</p>
          <p>• <strong>High Suspicion Scores:</strong> Investigate recent activity. Contact user if needed before taking action.</p>
          <p>• <strong>Enumeration Patterns:</strong> Could indicate automated scraping. Monitor closely.</p>
        </div>
      </div>
    </div>
  );
};