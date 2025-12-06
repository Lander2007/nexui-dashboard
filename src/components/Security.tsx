import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  Ban,
  Activity,
  Globe,
  Server,
  Key,
} from 'lucide-react';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
type Severity = 'high' | 'medium' | 'low';
type SecurityAction = 'Blocked' | 'Verified' | 'Monitored' | 'Investigating';
type SecurityEventType =
  | 'threat_blocked'
  | 'intrusion_attempt'
  | 'firmware_validation'
  | 'anomaly_detected';

interface SecurityEvent {
  id: number;
  type: SecurityEventType;
  title: string;
  description: string;
  severity: Severity;
  timestamp: string;
  source: string;
  action: SecurityAction;
}

// Lucide icon component type (safe across versions)
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// ────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────
const securityEvents: SecurityEvent[] = [
  {
    id: 1,
    type: 'threat_blocked',
    title: 'DDoS Attack Blocked',
    description: 'Blocked 1,247 malicious requests from 192.168.1.45',
    severity: 'high',
    timestamp: '2 minutes ago',
    source: '192.168.1.45',
    action: 'Blocked',
  },
  {
    id: 2,
    type: 'intrusion_attempt',
    title: 'Unauthorized Access Attempt',
    description: 'Failed login attempts detected on Gateway-001',
    severity: 'medium',
    timestamp: '15 minutes ago',
    source: 'Gateway-001',
    action: 'Monitored',
  },
  {
    id: 3,
    type: 'firmware_validation',
    title: 'Firmware Integrity Verified',
    description: 'Blockchain validation successful for ESP32-Node-003',
    severity: 'low',
    timestamp: '1 hour ago',
    source: 'ESP32-Node-003',
    action: 'Verified',
  },
  {
    id: 4,
    type: 'anomaly_detected',
    title: 'Traffic Anomaly Detected',
    description: 'Unusual bandwidth spike detected on subnet 192.168.2.0/24',
    severity: 'medium',
    timestamp: '2 hours ago',
    source: '192.168.2.0/24',
    action: 'Investigating',
  },
];

// ────────────────────────────────────────────────────────────
const severityColors: Record<Severity, string> = {
  high: 'text-red-400 bg-red-500/20 border-red-500/50',
  medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
  low: 'text-green-400 bg-green-500/20 border-green-500/50',
};

const severityIcons: Record<Severity, IconType> = {
  high: AlertTriangle,
  medium: Eye,
  low: CheckCircle,
};

// ────────────────────────────────────────────────────────────
export default function Security() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Center</h1>
          <p className="text-gray-400 mt-1">
            Real-time threat detection and network protection
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
            Emergency Lockdown
          </button>
          <button className="bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 text-nexlytix-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
            Security Scan
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-effect rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Secure</div>
              <div className="text-sm text-gray-400">Network Status</div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">All systems protected</span>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Threats Blocked</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <span className="text-red-400">+89</span> in last 24h
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-nexlytix-500/20 rounded-lg">
              <Key className="w-6 h-6 text-nexlytix-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">256-bit</div>
              <div className="text-sm text-gray-400">Encryption</div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-nexlytix-400" />
            <span className="text-sm text-nexlytix-400">TLS 1.3 Active</span>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-sm text-gray-400">Detection Rate</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">AI-powered analysis</div>
        </motion.div>
      </div>

      {/* Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            className="glass-effect rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Recent Security Events
              </h3>
              <button className="text-nexlytix-400 hover:text-nexlytix-300 text-sm font-medium">
                View All Events
              </button>
            </div>

            <div className="space-y-4">
              {securityEvents.map((event, index) => {
                const SeverityIcon = severityIcons[event.severity];
                return (
                  <motion.div
                    key={event.id}
                    className={clsx(
                      'border rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-all duration-200',
                      severityColors[event.severity]
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <SeverityIcon className="w-5 h-5" />
                        <h4 className="font-medium text-white">{event.title}</h4>
                      </div>
                      <span className="text-xs text-gray-400">
                        {event.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">
                          Source:{' '}
                          <span className="text-white">{event.source}</span>
                        </span>
                      </div>
                      <span
                        className={clsx(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          event.action === 'Blocked' &&
                            'bg-red-500/20 text-red-400',
                          event.action === 'Verified' &&
                            'bg-green-500/20 text-green-400',
                          event.action === 'Monitored' &&
                            'bg-yellow-500/20 text-yellow-400',
                          event.action === 'Investigating' &&
                            'bg-blue-500/20 text-blue-400'
                        )}
                      >
                        {event.action}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="glass-effect rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Security Policies
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Firewall</span>
                </div>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Encryption</span>
                </div>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Intrusion Detection</span>
                </div>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">Blockchain Validation</span>
                </div>
                <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
                  Updating
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-effect rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Threat Intelligence
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Global Threats</div>
                  <div className="text-xs text-gray-400">2,847 active campaigns</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Local Network</div>
                  <div className="text-xs text-gray-400">12 suspicious IPs blocked</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Firmware Integrity</div>
                  <div className="text-xs text-gray-400">All devices verified</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
