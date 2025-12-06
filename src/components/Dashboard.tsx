import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Activity, 
  Zap, 
  Shield, 
  Cpu, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Loader2,
  Play
} from 'lucide-react';
import MetricCard from './MetricCard';
import type { MetricCardProps } from './MetricCard.tsx';
import NetworkHealth from './NetworkHealth';
import RecentAlerts from './RecentAlerts';
import PredictiveInsights from './PredictiveInsights';

export default function Dashboard() {
  // State for quick actions
  const [actionStates, setActionStates] = useState<{[key: string]: 'idle' | 'running' | 'completed' | 'error'}>({
    optimization: 'idle',
    security: 'idle',
    report: 'idle'
  });

  const [actionProgress, setActionProgress] = useState<{[key: string]: number}>({
    optimization: 0,
    security: 0,
    report: 0
  });

  // Handle quick action execution
  const executeAction = async (actionType: string, duration: number = 3000) => {
    setActionStates(prev => ({ ...prev, [actionType]: 'running' }));
    setActionProgress(prev => ({ ...prev, [actionType]: 0 }));

    // Simulate progress
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setActionProgress(prev => ({ ...prev, [actionType]: (i / steps) * 100 }));
    }

    setActionStates(prev => ({ ...prev, [actionType]: 'completed' }));
    
    // Reset after 2 seconds
    setTimeout(() => {
      setActionStates(prev => ({ ...prev, [actionType]: 'idle' }));
      setActionProgress(prev => ({ ...prev, [actionType]: 0 }));
    }, 2000);
  };

  // Handle metric card clicks
  const handleMetricClick = (metricTitle: string) => {
    console.log(`Viewing detailed analytics for: ${metricTitle}`);
    
    let message = '';
    let details = '';
    
    switch (metricTitle) {
      case 'Active Devices':
        message = '📱 Active Devices Details';
        details = `Total Devices: 247
Online: 235 (95.1%)
Offline: 12 (4.9%)

Device Types:
• ESP32 Nodes: 189
• Sensors: 42
• Gateways: 16

Recent Activity:
• 12 new devices connected today
• 3 devices updated firmware
• 2 devices pending configuration`;
        break;
      case 'Network Health':
        message = '💚 Network Health Details';
        details = `Overall Health: 98.7%
Status: Excellent

Metrics:
• Uptime: 99.8%
• Packet Loss: 0.02%
• Average Latency: 11ms
• Jitter: 2ms

Performance:
• Bandwidth Usage: 78%
• Active Connections: 1,247
• Data Throughput: 2.4 Gbps`;
        break;
      case 'Threats Blocked':
        message = '🛡️ Security Threats Blocked';
        details = `Total Blocked: 1,247 threats
Today: +89 new threats

Threat Types:
• Port Scans: 456
• Malware Attempts: 312
• DDoS Attempts: 189
• Unauthorized Access: 290

Top Sources:
• 192.168.1.45 (23 attempts)
• 10.0.0.156 (18 attempts)
• External IPs: 1,206`;
        break;
      case 'Energy Saved':
        message = '⚡ Energy Savings Analytics';
        details = `Total Saved: 23.4 kWh
Today: +5.2 kWh

Optimization:
• Smart Scheduling: 12.1 kWh
• Load Balancing: 6.8 kWh
• Sleep Mode: 4.5 kWh

Cost Savings:
• Monthly: $47.80
• Yearly: $573.60
• CO₂ Reduced: 18.2 kg`;
        break;
    }
    
    alert(`${message}\n\n${details}`);
  };

  const metrics: MetricCardProps[] = [
    {
      title: 'Active Devices',
      value: '247',
      change: '+12',
      changeType: 'positive',
      icon: Cpu,
      color: 'nexlytix',
      onClick: () => handleMetricClick('Active Devices')
    },
    {
      title: 'Network Health',
      value: '98.7%',
      change: '+0.3%',
      changeType: 'positive',
      icon: Activity,
      color: 'green',
      onClick: () => handleMetricClick('Network Health')
    },
    {
      title: 'Threats Blocked',
      value: '1,247',
      change: '+89',
      changeType: 'neutral',
      icon: Shield,
      color: 'red',
      onClick: () => handleMetricClick('Threats Blocked')
    },
    {
      title: 'Energy Saved',
      value: '23.4kWh',
      change: '+5.2kWh',
      changeType: 'positive',
      icon: Zap,
      color: 'yellow',
      onClick: () => handleMetricClick('Energy Saved')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Network Intelligence Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time insights powered by AI</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 seconds ago</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NetworkHealth />
          <PredictiveInsights />
        </div>
        
        <div className="space-y-6">
          <RecentAlerts />
          
          {/* Enhanced Quick Actions */}
          <motion.div
            className="glass-effect rounded-xl p-6 glow-effect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="space-y-4">
              {/* Network Optimization */}
              <motion.button
                onClick={() => executeAction('optimization', 4000)}
                disabled={actionStates.optimization === 'running'}
                className="w-full group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-nexlytix-600/20 to-nexlytix-500/20 hover:from-nexlytix-600/30 hover:to-nexlytix-500/30 border border-nexlytix-500/30 hover:border-nexlytix-400/50 rounded-xl text-left transition-all duration-300 shadow-lg hover:shadow-nexlytix-500/20">
                  <div className="relative">
                    {actionStates.optimization === 'idle' && (
                      <Zap className="w-6 h-6 text-nexlytix-400 group-hover:text-nexlytix-300 transition-colors" />
                    )}
                    {actionStates.optimization === 'running' && (
                      <Loader2 className="w-6 h-6 text-nexlytix-400 animate-spin" />
                    )}
                    {actionStates.optimization === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium group-hover:text-nexlytix-100 transition-colors">
                        Run Network Optimization
                      </span>
                      {actionStates.optimization === 'running' && (
                        <span className="text-xs text-nexlytix-300">
                          {Math.round(actionProgress.optimization)}%
                        </span>
                      )}
                      {actionStates.optimization === 'completed' && (
                        <span className="text-xs text-green-400 font-medium">
                          Completed!
                        </span>
                      )}
                    </div>
                    
                    {actionStates.optimization === 'running' && (
                      <div className="mt-2 w-full bg-nexlytix-800/50 rounded-full h-1.5">
                        <motion.div
                          className="bg-gradient-to-r from-nexlytix-500 to-nexlytix-400 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${actionProgress.optimization}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {actionStates.optimization === 'idle' && (
                    <Play className="w-4 h-4 text-nexlytix-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>

              {/* Security Scan */}
              <motion.button
                onClick={() => executeAction('security', 3500)}
                disabled={actionStates.security === 'running'}
                className="w-full group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-500/30 hover:border-blue-400/50 rounded-xl text-left transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
                  <div className="relative">
                    {actionStates.security === 'idle' && (
                      <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    )}
                    {actionStates.security === 'running' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Shield className="w-6 h-6 text-blue-400" />
                      </motion.div>
                    )}
                    {actionStates.security === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium group-hover:text-blue-100 transition-colors">
                        Security Scan
                      </span>
                      {actionStates.security === 'running' && (
                        <span className="text-xs text-blue-300">
                          {Math.round(actionProgress.security)}%
                        </span>
                      )}
                      {actionStates.security === 'completed' && (
                        <span className="text-xs text-green-400 font-medium">
                          All Clear!
                        </span>
                      )}
                    </div>
                    
                    {actionStates.security === 'running' && (
                      <div className="mt-2 w-full bg-blue-800/50 rounded-full h-1.5">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${actionProgress.security}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {actionStates.security === 'idle' && (
                    <Play className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>

              {/* Generate Report */}
              <motion.button
                onClick={() => executeAction('report', 2500)}
                disabled={actionStates.report === 'running'}
                className="w-full group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 border border-green-500/30 hover:border-green-400/50 rounded-xl text-left transition-all duration-300 shadow-lg hover:shadow-green-500/20">
                  <div className="relative">
                    {actionStates.report === 'idle' && (
                      <TrendingUp className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
                    )}
                    {actionStates.report === 'running' && (
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </motion.div>
                    )}
                    {actionStates.report === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium group-hover:text-green-100 transition-colors">
                        Generate Report
                      </span>
                      {actionStates.report === 'running' && (
                        <span className="text-xs text-green-300">
                          {Math.round(actionProgress.report)}%
                        </span>
                      )}
                      {actionStates.report === 'completed' && (
                        <span className="text-xs text-green-400 font-medium">
                          Ready!
                        </span>
                      )}
                    </div>
                    
                    {actionStates.report === 'running' && (
                      <div className="mt-2 w-full bg-green-800/50 rounded-full h-1.5">
                        <motion.div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${actionProgress.report}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {actionStates.report === 'idle' && (
                    <Play className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>
            </div>

            {/* Action Status Summary */}
            <motion.div 
              className="mt-6 pt-4 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">System Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">All Systems Operational</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}