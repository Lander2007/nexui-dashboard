import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, Brain, AlertTriangle, CheckCircle, Activity, Download, RefreshCw, Filter, Calendar, Share2, Settings, Play, Pause } from "lucide-react";

// ✅ Types
interface PerformanceData {
  name: string;
  throughput: number;
  latency: number;
  errors: number;
}

interface DeviceTypeData {
  name: string;
  value: number;
  color: string;
}

interface ThreatData {
  time: string;
  blocked: number;
  detected: number;
}

// ✅ Data
const performanceData: PerformanceData[] = [
  { name: "Mon", throughput: 85, latency: 12, errors: 2 },
  { name: "Tue", throughput: 92, latency: 8, errors: 1 },
  { name: "Wed", throughput: 78, latency: 15, errors: 4 },
  { name: "Thu", throughput: 96, latency: 6, errors: 0 },
  { name: "Fri", throughput: 89, latency: 10, errors: 2 },
  { name: "Sat", throughput: 94, latency: 7, errors: 1 },
  { name: "Sun", throughput: 91, latency: 9, errors: 1 },
];

const deviceTypeData: DeviceTypeData[] = [
  { name: "Routers", value: 3, color: "#9d70ff" },
  { name: "Switches", value: 3, color: "#10b981" },
  { name: "End Devices", value: 6, color: "#f59e0b" },
  { name: "Servers", value: 1, color: "#3b82f6" },
  { name: "ISP", value: 1, color: "#06b6d4" },
];

const threatData: ThreatData[] = [
  { time: "00:00", blocked: 12, detected: 15 },
  { time: "04:00", blocked: 8, detected: 10 },
  { time: "08:00", blocked: 25, detected: 28 },
  { time: "12:00", blocked: 18, detected: 22 },
  { time: "16:00", blocked: 32, detected: 35 },
  { time: "20:00", blocked: 15, detected: 18 },
  { time: "24:00", blocked: 9, detected: 12 },
];

// ✅ Component
function Analytics(): React.ReactElement {
  const [isAnalysisPaused, setIsAnalysisPaused] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRefreshData = () => {
    showNotification("Refreshing performance data...");
  };

  const handleFilter = () => {
    showNotification("Opening filter options...");
  };

  const handleDownload = () => {
    showNotification("Downloading report...");
  };

  const handleExportChart = () => {
    showNotification("Exporting chart...");
  };

  const handleViewDetails = () => {
    showNotification("Opening device details...");
  };

  const handleToggleAnalysis = () => {
    setIsAnalysisPaused(!isAnalysisPaused);
    showNotification(isAnalysisPaused ? "AI Analysis resumed" : "AI Analysis paused");
  };

  const handleDeepScan = () => {
    showNotification("Starting deep network scan...");
  };

  const handleViewReport = () => {
    showNotification("Opening network health report...");
  };

  const handleApplyFix = () => {
    showNotification("Applying QoS optimization...");
  };

  const handleDismiss = () => {
    showNotification("Alert dismissed");
  };

  const handleSchedule = () => {
    showNotification("Opening maintenance scheduler...");
  };

  const handleViewThreats = () => {
    showNotification("Opening threat analysis dashboard...");
  };

  const handleConfigure = () => {
    showNotification("Opening security configuration...");
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-nexlytix-600 text-white px-6 py-3 rounded-lg shadow-lg border border-nexlytix-500"
        >
          {notification}
        </motion.div>
      )}
      {/* Network Performance Bar Chart */}
      <motion.div
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-nexlytix-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-nexlytix-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Network Performance</h3>
              <p className="text-gray-400 text-sm">Throughput and latency trends</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefreshData}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFilter}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Filter"
            >
              <Filter className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Download Report"
            >
              <Download className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
              <Bar dataKey="throughput" fill="#9d70ff" radius={[4, 4, 0, 0]} name="Throughput %" />
              <Bar dataKey="latency" fill="#10b981" radius={[4, 4, 0, 0]} name="Latency (ms)" />
              <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-white font-semibold text-2xl">91%</span>
            </div>
            <p className="text-gray-400 text-sm">Avg Throughput</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-white font-semibold text-2xl">9.6ms</span>
            </div>
            <p className="text-gray-400 text-sm">Avg Latency</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-white font-semibold text-2xl">11</span>
            </div>
            <p className="text-gray-400 text-sm">Total Errors</p>
          </div>
        </div>
      </motion.div>

      {/* Device Distribution Pie Chart */}
      <motion.div
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <PieChartIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Device Distribution</h3>
              <p className="text-gray-400 text-sm">Network topology breakdown by device type</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportChart}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Export Chart"
            >
              <Share2 className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showNotification("Opening settings...")}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewDetails}
              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </motion.button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
                animationBegin={0}
                animationDuration={800}
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#9ca3af" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {deviceTypeData.map((device, index) => (
            <motion.div
              key={index}
              className="rounded-lg p-4 text-center border"
              style={{
                background: `linear-gradient(135deg, ${device.color}20, ${device.color}05)`,
                borderColor: `${device.color}50`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-4 h-4 rounded-full mr-2 animate-pulse"
                  style={{ backgroundColor: device.color }}
                ></div>
                <span className="text-white font-bold text-2xl">{device.value}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium">{device.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Network Analysis */}
      <motion.div
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI Network Analysis</h3>
              <p className="text-gray-400 text-sm">Real-time intelligent insights and recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleAnalysis}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title={isAnalysisPaused ? "Resume Analysis" : "Pause Analysis"}
            >
              {isAnalysisPaused ? <Play className="w-4 h-4 text-gray-400 hover:text-white" /> : <Pause className="w-4 h-4 text-gray-400 hover:text-white" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefreshData}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              title="Refresh Analysis"
            >
              <RefreshCw className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeepScan}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
            >
              Run Deep Scan
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Analysis Card 1 */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-green-400 font-semibold mb-2">Optimal Network Health Detected</h4>
                <p className="text-gray-300 text-sm mb-3">
                  AI analysis shows 98.7% network uptime with balanced load distribution across all routers. 
                  Current configuration is performing within optimal parameters.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">Confidence: <span className="text-green-400 font-semibold">97%</span></span>
                    <span className="text-gray-400">Last Updated: <span className="text-white">2 min ago</span></span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewReport}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded text-xs font-medium transition-colors"
                  >
                    View Report
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Card 2 */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-yellow-400 font-semibold mb-2">Bandwidth Optimization Opportunity</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Machine learning models predict a 23% increase in traffic during peak hours (2-4 PM). 
                  Consider implementing QoS policies on Router R2 to prevent potential congestion.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">Confidence: <span className="text-yellow-400 font-semibold">89%</span></span>
                    <span className="text-gray-400">Priority: <span className="text-yellow-400 font-semibold">Medium</span></span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyFix}
                      className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 rounded text-xs font-medium transition-colors"
                    >
                      Apply Fix
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDismiss}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded text-xs font-medium transition-colors"
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Card 3 */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-400 font-semibold mb-2">Predictive Maintenance Alert</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Switch S3 interface Fa0/3 showing irregular packet patterns. AI recommends proactive 
                  inspection within 48 hours to prevent potential hardware failure affecting PC6 connectivity.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">Confidence: <span className="text-blue-400 font-semibold">84%</span></span>
                    <span className="text-gray-400">Action Required: <span className="text-blue-400 font-semibold">48 hours</span></span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSchedule}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded text-xs font-medium transition-colors"
                    >
                      Schedule
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showNotification("Opening maintenance details...")}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded text-xs font-medium transition-colors"
                    >
                      Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Card 4 */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-purple-400 font-semibold mb-2">Security Pattern Recognition</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Neural network detected 127 blocked intrusion attempts in the last 24 hours. Pattern analysis 
                  suggests coordinated scanning activity. Firewall rules automatically updated to enhance protection.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">Threats Blocked: <span className="text-purple-400 font-semibold">127</span></span>
                    <span className="text-gray-400">Auto-Response: <span className="text-green-400 font-semibold">Active</span></span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleViewThreats}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 rounded text-xs font-medium transition-colors"
                    >
                      View Threats
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfigure}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded text-xs font-medium transition-colors"
                    >
                      Configure
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Analytics;
