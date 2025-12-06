import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ComponentType } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: ComponentType<{ className?: string }>;
  color: 'nexlytix' | 'green' | 'red' | 'yellow' | 'blue';
  onClick?: () => void;
}

const colorClasses = {
  nexlytix: {
    bg: 'bg-nexlytix-600/20',
    border: 'border-nexlytix-500/30',
    icon: 'text-nexlytix-400',
    accent: 'text-nexlytix-300'
  },
  green: {
    bg: 'bg-green-600/20',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    accent: 'text-green-300'
  },
  red: {
    bg: 'bg-red-600/20',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    accent: 'text-red-300'
  },
  yellow: {
    bg: 'bg-yellow-600/20',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    accent: 'text-yellow-300'
  },
  blue: {
    bg: 'bg-blue-600/20',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    accent: 'text-blue-300'
  }
};

export default function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  onClick
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorClasses[color];

  const changeColor =
    changeType === 'positive'
      ? 'text-green-400'
      : changeType === 'negative'
      ? 'text-red-400'
      : 'text-gray-400';

  const TrendIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : Minus;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default action - show detailed view
      console.log(`Viewing details for ${title}`);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-effect rounded-xl p-6 ${colors.bg} border ${colors.border} hover:bg-opacity-40 transition-all duration-200 text-left w-full group cursor-pointer`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <TrendIcon className={`w-4 h-4 ${changeColor}`} />
            <span className={`text-sm font-medium ${changeColor}`}>
              {change}
            </span>
          </div>
          <motion.div
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-nexlytix-300 transition-colors">
          {value}
        </h3>
        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
          {title}
        </p>
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className={`absolute inset-0 rounded-xl ${colors.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none`}
        initial={false}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
      />
    </motion.button>
  );
}
