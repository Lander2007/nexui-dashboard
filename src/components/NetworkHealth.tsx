import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RefreshCw, Download, Maximize2, X } from 'lucide-react';

const data = [
  { time: '00:00', health: 98, latency: 12, throughput: 85 },
  { time: '04:00', health: 97, latency: 15, throughput: 78 },
  { time: '08:00', health: 99, latency: 8, throughput: 92 },
  { time: '12:00', health: 98, latency: 11, throughput: 88 },
  { time: '16:00', health: 96, latency: 18, throughput: 75 },
  { time: '20:00', health: 99, latency: 9, throughput: 94 },
  { time: '24:00', health: 98, latency: 10, throughput: 90 },
];

export default function NetworkHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'health' | 'throughput'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    console.log('Network health data refreshed');
  };

  const handleDownload = () => {
    // Generate CSV content
    const csvHeaders = 'Time,Health Score (%),Latency (ms),Throughput (%)\n';
    const csvRows = data.map(row => 
      `${row.time},${row.health},${row.latency},${row.throughput}`
    ).join('\n');
    const csvContent = csvHeaders + csvRows;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `network-health-report-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Network health report downloaded successfully');
  };

  const handleExpand = () => {
    setIsFullscreen(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'health' ? 'Health Score' : 'Throughput'}: ${entry.value}${entry.dataKey === 'health' ? '%' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (height: string) => (
    <div className={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9d70ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9d70ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          {(selectedMetric === 'all' || selectedMetric === 'health') && (
            <Area
              type="monotone"
              dataKey="health"
              stroke="#9d70ff"
              fillOpacity={1}
              fill="url(#healthGradient)"
              strokeWidth={2}
            />
          )}
          
          {(selectedMetric === 'all' || selectedMetric === 'throughput') && (
            <Area
              type="monotone"
              dataKey="throughput"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#throughputGradient)"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <motion.div
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Network Health Overview</h3>
          <p className="text-gray-400 text-sm">24-hour performance metrics</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Metric Filter */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {(['all', 'health', 'throughput'] as const).map((metric) => (
              <motion.button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedMetric === metric
                    ? 'bg-nexlytix-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {metric === 'all' ? 'All' : metric === 'health' ? 'Health' : 'Throughput'}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={handleExpand}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-sm mb-4">
        {(selectedMetric === 'all' || selectedMetric === 'health') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-nexlytix-500 rounded-full"></div>
            <span className="text-gray-300">Health Score</span>
          </div>
        )}
        {(selectedMetric === 'all' || selectedMetric === 'throughput') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Throughput</span>
          </div>
        )}
      </div>
      
      {/* Chart */}
      {renderChart('h-64')}
    </motion.div>

    {/* Fullscreen Modal */}
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-dark-900/95 backdrop-blur-sm flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullscreen(false)}
        >
          <motion.div
            className="glass-effect rounded-xl p-8 w-full max-w-7xl h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">Network Health Overview</h3>
                <p className="text-gray-400">24-hour performance metrics - Fullscreen View</p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* Metric Filter */}
                <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
                  {(['all', 'health', 'throughput'] as const).map((metric) => (
                    <motion.button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                        selectedMetric === metric
                          ? 'bg-nexlytix-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {metric === 'all' ? 'All Metrics' : metric === 'health' ? 'Health Score' : 'Throughput'}
                    </motion.button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDownload}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-6 text-sm mb-6">
              {(selectedMetric === 'all' || selectedMetric === 'health') && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-nexlytix-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Health Score</span>
                </div>
              )}
              {(selectedMetric === 'all' || selectedMetric === 'throughput') && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Throughput</span>
                </div>
              )}
            </div>
            
            {/* Fullscreen Chart */}
            {renderChart('flex-1')}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
