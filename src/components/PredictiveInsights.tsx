import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import type { ComponentType } from 'react';

type Priority = 'high' | 'medium' | 'low';

interface Insight {
  id: number;
  title: string;
  description: string;
  confidence: number;
  action: string;
  priority: Priority;
  icon: ComponentType<{ className?: string }>;
}

const insights: Insight[] = [
  {
    id: 1,
    title: 'Potential Failure Prediction',
    description:
      'Node ESP32-156 shows degrading signal strength. Failure probability: 78% within 48 hours.',
    confidence: 78,
    action: 'Schedule Maintenance',
    priority: 'high',
    icon: AlertCircle,
  },
  {
    id: 2,
    title: 'Traffic Optimization Opportunity',
    description:
      'Rerouting through Node ESP32-089 could improve network throughput by 15%.',
    confidence: 92,
    action: 'Apply Optimization',
    priority: 'medium',
    icon: TrendingUp,
  },
  {
    id: 3,
    title: 'Energy Efficiency Improvement',
    description:
      'Reducing transmission power on 12 nodes could save 8.3kWh daily without performance loss.',
    confidence: 85,
    action: 'Implement Changes',
    priority: 'low',
    icon: Zap,
  },
];

const priorityColors: Record<Priority, string> = {
  high: 'border-red-500/50 bg-red-500/10',
  medium: 'border-yellow-500/50 bg-yellow-500/10',
  low: 'border-green-500/50 bg-green-500/10',
};

export default function PredictiveInsights() {
  const handleAction = (insightId: number, actionName: string, title: string) => {
    console.log(`Executing action: ${actionName} for ${title}`);
    
    let message = '';
    let details = '';
    
    switch (insightId) {
      case 1:
        message = '🔧 Schedule Maintenance';
        details = `Maintenance scheduled for Node ESP32-156

Action Plan:
• Inspection scheduled: Tomorrow 10:00 AM
• Estimated duration: 2 hours
• Backup node activated: ESP32-157
• Technician assigned: John Smith

Preventive Measures:
• Signal strength monitoring increased
• Automatic failover configured
• Notification sent to admin team

Status: ✅ Maintenance request created`;
        break;
      case 2:
        message = '⚡ Apply Traffic Optimization';
        details = `Traffic optimization applied successfully

Changes Made:
• Primary route: ESP32-089 (new)
• Previous route: ESP32-045
• Expected improvement: +15% throughput
• Latency reduction: -8ms

Network Impact:
• Affected nodes: 23 devices
• Rerouting time: 2.3 seconds
• Zero packet loss during transition

Performance Metrics:
• Before: 2.1 Gbps
• After: 2.4 Gbps (+15%)
• Status: ✅ Optimization active`;
        break;
      case 3:
        message = '💡 Implement Energy Efficiency';
        details = `Energy efficiency changes implemented

Power Adjustments:
• Nodes affected: 12 devices
• Power reduction: 15% average
• Daily savings: 8.3 kWh
• Monthly savings: 249 kWh

Cost Impact:
• Daily cost savings: $1.66
• Monthly savings: $49.80
• Yearly savings: $597.60

Performance Check:
• Signal quality: Maintained
• Throughput: No degradation
• Latency: Unchanged
• Status: ✅ Changes applied successfully`;
        break;
    }
    
    alert(`${message}\n\n${details}`);
  };

  return (
    <motion.div
      className="glass-effect rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Predictive Insights</h3>
          <p className="text-gray-400 text-sm">AI-driven recommendations</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`flex items-start p-4 rounded-lg border-l-4 ${priorityColors[insight.priority]}`}
          >
            <insight.icon className="w-6 h-6 text-gray-400 mr-4" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
              <p className="text-gray-400">{insight.description}</p>
            </div>
            <div className="ml-4">
              <span className="text-gray-400">Confidence: {insight.confidence}%</span>
              <div className="mt-2">
                <motion.button 
                  onClick={() => handleAction(insight.id, insight.action, insight.title)}
                  className="bg-nexlytix-600 hover:bg-nexlytix-500 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {insight.action}
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
