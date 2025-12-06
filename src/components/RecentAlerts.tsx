import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Zap, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { ComponentType } from 'react';

// ✅ Define allowed colors
type AlertColor = 'yellow' | 'red' | 'green' | 'blue';

// ✅ Define alert structure
interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
  color: AlertColor;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: 'warning',
    title: 'High Latency Detected',
    description: 'Node ESP32-247 showing 150ms latency',
    time: '2 min ago',
    icon: AlertTriangle,
    color: 'yellow',
  },
  {
    id: 2,
    type: 'security',
    title: 'Intrusion Attempt Blocked',
    description: 'Suspicious traffic from 192.168.1.45',
    time: '5 min ago',
    icon: Shield,
    color: 'red',
  },
  {
    id: 3,
    type: 'success',
    title: 'Auto-Optimization Complete',
    description: 'Network routes optimized, +12% performance',
    time: '15 min ago',
    icon: CheckCircle,
    color: 'green',
  },
  {
    id: 4,
    type: 'info',
    title: 'Firmware Update Available',
    description: '23 devices ready for OTA update',
    time: '1 hour ago',
    icon: Zap,
    color: 'blue',
  },
];

// ✅ Map colors safely
const colorClasses: Record<AlertColor, string> = {
  yellow: 'text-yellow-400 bg-yellow-500/20',
  red: 'text-red-400 bg-red-500/20',
  green: 'text-green-400 bg-green-500/20',
  blue: 'text-blue-400 bg-blue-500/20',
};

export default function RecentAlerts() {
  const handleViewAll = () => {
    console.log('Opening all alerts view...');
    // You can add navigation or modal logic here
    alert('Opening full alerts dashboard...');
  };

  return (
    <motion.div
      className="glass-effect rounded-xl p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <motion.button 
          onClick={handleViewAll}
          className="text-nexlytix-400 hover:text-nexlytix-300 text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              className="flex items-start space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={clsx('p-2 rounded-lg flex-shrink-0', colorClasses[alert.color])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                <p className="text-gray-400 text-xs mt-1">{alert.description}</p>
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
