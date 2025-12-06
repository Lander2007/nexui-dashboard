import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import type { Icon } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface Insight {
  id: number;
  title: string;
  description: string;
  confidence: number;
  action: string;
  priority: Priority;
  icon: Icon;
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
                <button className="bg-nexlytix-600 text-white py-1 px-3 rounded-lg">
                  {insight.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
