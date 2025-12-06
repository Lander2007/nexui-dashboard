import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Wifi, Monitor, Cloud, Network, AlertTriangle, X } from "lucide-react";
import { clsx } from "clsx";

interface NetworkDevice {
  id: string;
  name: string;
  type: "router" | "switch" | "pc" | "server" | "isp";
  status: "online" | "offline" | "warning";
  x: number;
  y: number;
  connections: Array<{ to: string; interface: string; ip?: string }>;
  interfaces: Array<{ name: string; ip: string; subnet: string }>;
}

const devices: NetworkDevice[] = [
  // Routers
  {
    id: "r1",
    name: "R1",
    type: "router",
    status: "online",
    x: 30,
    y: 40,
    connections: [
      { to: "s1", interface: "Fa0/1", ip: "192.168.10.1" },
      { to: "s2", interface: "G0/0/1", ip: "192.168.11.1" },
      { to: "r2", interface: "S0/0/0", ip: "10.1.1.1" }
    ],
    interfaces: [
      { name: "G0/0/0", ip: "192.168.10.1", subnet: "/24" },
      { name: "G0/0/1", ip: "192.168.11.1", subnet: "/24" },
      { name: "S0/0/0", ip: "10.1.1.1", subnet: "/30" }
    ]
  },
  {
    id: "r2",
    name: "R2",
    type: "router",
    status: "online",
    x: 50,
    y: 20,
    connections: [
      { to: "r1", interface: "S0/0/0", ip: "10.1.1.2" },
      { to: "r3", interface: "S0/0/1", ip: "10.2.2.1" },
      { to: "isp", interface: "S0/1/0", ip: "209.165.200.225" },
      { to: "server", interface: "G0/0/0", ip: "192.168.20.1" }
    ],
    interfaces: [
      { name: "G0/0/0", ip: "192.168.20.1", subnet: "/24" },
      { name: "S0/0/0", ip: "10.1.1.2", subnet: "/30" },
      { name: "S0/0/1", ip: "10.2.2.1", subnet: "/30" },
      { name: "S0/1/0", ip: "209.165.200.225", subnet: "/27" }
    ]
  },
  {
    id: "r3",
    name: "R3",
    type: "router",
    status: "online",
    x: 70,
    y: 40,
    connections: [
      { to: "r2", interface: "S0/0/1", ip: "10.2.2.2" },
      { to: "s3", interface: "Fa0/1", ip: "192.168.30.1" }
    ],
    interfaces: [
      { name: "G0/0/0", ip: "192.168.30.1", subnet: "/24" },
      { name: "S0/0/1", ip: "10.2.2.2", subnet: "/30" }
    ]
  },
  // Switches
  {
    id: "s1",
    name: "S1",
    type: "switch",
    status: "online",
    x: 20,
    y: 60,
    connections: [
      { to: "r1", interface: "Fa0/1" },
      { to: "pc1", interface: "Fa0/2" },
      { to: "pc2", interface: "Fa0/3" }
    ],
    interfaces: [{ name: "VLAN1", ip: "192.168.10.0", subnet: "/24" }]
  },
  {
    id: "s2",
    name: "S2",
    type: "switch",
    status: "online",
    x: 40,
    y: 60,
    connections: [
      { to: "r1", interface: "Fa0/1" },
      { to: "pc3", interface: "Fa0/2" },
      { to: "pc4", interface: "Fa0/3" }
    ],
    interfaces: [{ name: "VLAN1", ip: "192.168.11.0", subnet: "/24" }]
  },
  {
    id: "s3",
    name: "S3",
    type: "switch",
    status: "online",
    x: 70,
    y: 60,
    connections: [
      { to: "r3", interface: "Fa0/1" },
      { to: "pc5", interface: "Fa0/2" },
      { to: "pc6", interface: "Fa0/3" }
    ],
    interfaces: [{ name: "VLAN1", ip: "192.168.30.0", subnet: "/24" }]
  },
  // PCs
  {
    id: "pc1",
    name: "PC1",
    type: "pc",
    status: "online",
    x: 15,
    y: 80,
    connections: [{ to: "s1", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.10.10", subnet: "/24" }]
  },
  {
    id: "pc2",
    name: "PC2",
    type: "pc",
    status: "online",
    x: 25,
    y: 80,
    connections: [{ to: "s1", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.10.11", subnet: "/24" }]
  },
  {
    id: "pc3",
    name: "PC3",
    type: "pc",
    status: "online",
    x: 35,
    y: 80,
    connections: [{ to: "s2", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.11.10", subnet: "/24" }]
  },
  {
    id: "pc4",
    name: "PC4",
    type: "pc",
    status: "online",
    x: 45,
    y: 80,
    connections: [{ to: "s2", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.11.11", subnet: "/24" }]
  },
  {
    id: "pc5",
    name: "PC5",
    type: "pc",
    status: "online",
    x: 65,
    y: 80,
    connections: [{ to: "s3", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.30.10", subnet: "/24" }]
  },
  {
    id: "pc6",
    name: "PC6",
    type: "pc",
    status: "offline",
    x: 75,
    y: 80,
    connections: [{ to: "s3", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.30.11", subnet: "/24" }]
  },
  // Server
  {
    id: "server",
    name: "WEB/FTP Server",
    type: "server",
    status: "online",
    x: 20,
    y: 20,
    connections: [{ to: "r2", interface: "NIC" }],
    interfaces: [{ name: "NIC", ip: "192.168.20.254", subnet: "/24" }]
  },
  // ISP
  {
    id: "isp",
    name: "ISP",
    type: "isp",
    status: "online",
    x: 80,
    y: 20,
    connections: [{ to: "r2", interface: "WAN" }],
    interfaces: [{ name: "WAN", ip: "209.165.200.224", subnet: "/27" }]
  }
];

const statusColors = {
  online: "text-green-400 bg-green-500/20 border-green-500/50",
  warning: "text-yellow-400 bg-yellow-500/20 border-yellow-500/50",
  offline: "text-red-400 bg-red-500/20 border-red-500/50",
};

const typeIcons = {
  router: Network,
  switch: Wifi,
  pc: Monitor,
  server: Server,
  isp: Cloud,
};

function NetworkMap(): React.ReactElement {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showRoutingTable, setShowRoutingTable] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleQuickAction = (action: string) => {
    setActionMessage(action);
    setTimeout(() => setActionMessage(null), 3000);
  };



  const getConnectionPath = (from: NetworkDevice, to: NetworkDevice, isDCE: boolean = false) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    return {
      path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      midX,
      midY,
      isDCE
    };
  };

  // Define DCE connections (red lines)
  const dceConnections = [
    { from: "r1", to: "r2" },
    { from: "r2", to: "r3" }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect border-l-4 border-red-500 rounded-xl p-4 flex items-start space-x-3"
          >
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold text-lg">Interface Down Alert</h3>
              <p className="text-gray-300 mt-1">
                <span className="font-medium">S3 - Fa0/3</span> interface has gone down. Device <span className="font-medium">PC6</span> is now offline.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Time: {new Date().toLocaleTimeString()} | Location: 192.168.30.0/24 network
              </p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title + Legend */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Network Topology Map</h1>
          <p className="text-gray-400 mt-1">Enterprise network infrastructure visualization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Serial (DCE)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Serial (DTE)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300">Ethernet</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <motion.div
            className="glass-effect rounded-xl p-6 h-[900px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Arrow markers */}
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="rgba(157, 112, 255, 0.6)" />
                  </marker>
                </defs>

                {/* Connection Lines */}
                {devices.flatMap((device) =>
                  device.connections.map((conn) => {
                    const connectedDevice = devices.find((d) => d.id === conn.to);
                    if (!connectedDevice) return null;

                    // Check if this connection involves PC6 (offline)
                    const isDownConnection = (device.id === "pc6" || conn.to === "pc6");

                    const isDCE = dceConnections.some(
                      (dce) => (dce.from === device.id && dce.to === conn.to) || (dce.from === conn.to && dce.to === device.id)
                    );
                    const isSerial = conn.interface.startsWith("S");
                    const { path } = getConnectionPath(device, connectedDevice, isDCE);

                    return (
                      <g key={`${device.id}-${conn.to}`}>
                        {/* Cable shadow/outline for depth */}
                        <motion.path
                          d={path}
                          stroke="rgba(0, 0, 0, 0.3)"
                          strokeWidth="0.4"
                          fill="none"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: isDownConnection ? 0.2 : 0.5 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        {/* Main cable */}
                        <motion.path
                          d={path}
                          stroke={isDownConnection ? "#ef4444" : (isSerial ? (isDCE ? "#ef4444" : "#3b82f6") : "#4b5563")}
                          strokeWidth="0.25"
                          fill="none"
                          strokeDasharray={isSerial ? "0.8,0.4" : (isDownConnection ? "0.5,0.5" : "none")}
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: isDownConnection ? 0.3 : 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        {/* Data flow animation - disabled for down connections */}
                        {isSerial && !isDownConnection && (
                          <motion.circle
                            r="0.2"
                            fill={isDCE ? "#fca5a5" : "#93c5fd"}
                            opacity="0.8"
                          >
                            <animateMotion
                              dur="3s"
                              repeatCount="indefinite"
                              path={path}
                            />
                          </motion.circle>
                        )}
                      </g>
                    );
                  })
                )}

                {/* Device Nodes */}
                {devices.map((device, index) => {
                  const size = device.type === "router" ? 9 : device.type === "switch" ? 8 : device.type === "isp" ? 10 : 6;

                  return (
                    <motion.g
                      key={device.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedDevice(device)}
                      className="cursor-pointer"
                    >
                      {/* Device background with gradient */}
                      <defs>
                        <linearGradient id={`grad-${device.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: device.type === 'router' ? '#3b82f6' : device.type === 'switch' ? '#8b5cf6' : device.type === 'isp' ? '#06b6d4' : device.type === 'server' ? '#10b981' : '#6b7280', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: device.type === 'router' ? '#1e40af' : device.type === 'switch' ? '#6d28d9' : device.type === 'isp' ? '#0891b2' : device.type === 'server' ? '#059669' : '#4b5563', stopOpacity: 0.9 }} />
                        </linearGradient>
                        <filter id={`shadow-${device.id}`}>
                          <feDropShadow dx="0" dy="0.2" stdDeviation="0.3" floodOpacity="0.5" />
                        </filter>
                      </defs>



                      {/* Device Icon/Logo */}
                      {device.type === 'router' && (
                        <g>
                          {/* Cisco Router - 3D cylindrical style with arrows on top */}
                          <defs>
                            <linearGradient id={`router-grad-${device.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7dd3e8" />
                              <stop offset="30%" stopColor="#a8dfe8" />
                              <stop offset="70%" stopColor="#7dd3e8" />
                              <stop offset="100%" stopColor="#5ab8d1" />
                            </linearGradient>
                            <radialGradient id={`router-top-${device.id}`} cx="50%" cy="50%">
                              <stop offset="0%" stopColor="#b8e6f0" />
                              <stop offset="70%" stopColor="#8dd5e6" />
                              <stop offset="100%" stopColor="#6bc4db" />
                            </radialGradient>
                          </defs>

                          {/* Bottom ellipse (shadow) */}
                          <ellipse cx={device.x} cy={device.y + 1.8} rx="3.3" ry="1.05" fill="#000000" opacity="0.15" />

                          {/* Cylinder body */}
                          <rect x={device.x - 3.3} y={device.y - 1.2} width="6.6" height="3" fill={`url(#router-grad-${device.id})`} />

                          {/* Bottom ellipse of cylinder */}
                          <ellipse cx={device.x} cy={device.y + 1.8} rx="3.3" ry="1.05" fill="#5ab8d1" />

                          {/* Top ellipse of cylinder */}
                          <ellipse cx={device.x} cy={device.y - 1.2} rx="3.3" ry="1.05" fill={`url(#router-top-${device.id})`} />

                          {/* Directional arrows on top - 4 arrows pointing outward */}
                          {/* Top arrow */}
                          <path d={`M ${device.x} ${device.y - 1.8} L ${device.x - 0.45} ${device.y - 0.75} L ${device.x - 0.225} ${device.y - 0.75} L ${device.x - 0.225} ${device.y - 0.3} L ${device.x + 0.225} ${device.y - 0.3} L ${device.x + 0.225} ${device.y - 0.75} L ${device.x + 0.45} ${device.y - 0.75} Z`}
                            fill="#2c5f6f" opacity="0.8" />

                          {/* Right arrow */}
                          <path d={`M ${device.x + 1.8} ${device.y - 1.2} L ${device.x + 0.75} ${device.y - 1.65} L ${device.x + 0.75} ${device.y - 1.425} L ${device.x + 0.3} ${device.y - 1.425} L ${device.x + 0.3} ${device.y - 0.975} L ${device.x + 0.75} ${device.y - 0.975} L ${device.x + 0.75} ${device.y - 0.75} Z`}
                            fill="#2c5f6f" opacity="0.8" />

                          {/* Bottom arrow */}
                          <path d={`M ${device.x} ${device.y - 0.6} L ${device.x + 0.45} ${device.y - 1.65} L ${device.x + 0.225} ${device.y - 1.65} L ${device.x + 0.225} ${device.y - 2.1} L ${device.x - 0.225} ${device.y - 2.1} L ${device.x - 0.225} ${device.y - 1.65} L ${device.x - 0.45} ${device.y - 1.65} Z`}
                            fill="#2c5f6f" opacity="0.8" />

                          {/* Left arrow */}
                          <path d={`M ${device.x - 1.8} ${device.y - 1.2} L ${device.x - 0.75} ${device.y - 0.75} L ${device.x - 0.75} ${device.y - 0.975} L ${device.x - 0.3} ${device.y - 0.975} L ${device.x - 0.3} ${device.y - 1.425} L ${device.x - 0.75} ${device.y - 1.425} L ${device.x - 0.75} ${device.y - 1.65} Z`}
                            fill="#2c5f6f" opacity="0.8" />

                          {/* Center circle */}
                          <circle cx={device.x} cy={device.y - 1.2} r="0.375" fill="#2c5f6f" opacity="0.6" />

                          {/* Status LEDs on front */}
                          {[0, 1, 2].map((i) => (
                            <circle key={i} cx={device.x - 1.2 + i * 1.2} cy={device.y + 0.45} r="0.18" fill="#10b981">
                              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                            </circle>
                          ))}

                          {/* Port indicators at bottom */}
                          {[0, 1, 2, 3].map((i) => (
                            <rect key={i} x={device.x - 1.8 + i * 1.2} y={device.y + 1.2} width="0.45" height="0.3" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="0.06" rx="0.075" />
                          ))}
                        </g>
                      )}

                      {device.type === 'switch' && (
                        <g>
                          {/* Cisco Switch - rectangular with multiple ports */}
                          <rect x={device.x - 3.3} y={device.y - 1.5} width="6.6" height="3" rx="0.45" fill="#2d7a9e" stroke="#1a5570" strokeWidth="0.15" />

                          {/* Top panel */}
                          <rect x={device.x - 3} y={device.y - 1.2} width="6" height="0.6" fill="#3d9ac2" opacity="0.8" />

                          {/* Port indicators - two rows */}
                          {[...Array(8)].map((_, i) => (
                            <rect key={`port1-${i}`} x={device.x - 2.7 + i * 0.675} y={device.y - 0.3} width="0.45" height="0.6"
                              fill="#1a1a1a" stroke="#4a9eff" strokeWidth="0.075" />
                          ))}
                          {[...Array(8)].map((_, i) => (
                            <rect key={`port2-${i}`} x={device.x - 2.7 + i * 0.675} y={device.y + 0.45} width="0.45" height="0.6"
                              fill="#1a1a1a" stroke="#4a9eff" strokeWidth="0.075" />
                          ))}

                          {/* Status LEDs */}
                          {[...Array(4)].map((_, i) => (
                            <circle key={i} cx={device.x - 2.25 + i * 1.5} cy={device.y - 0.9} r="0.18" fill="#10b981">
                              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                            </circle>
                          ))}
                        </g>
                      )}

                      {device.type === 'pc' && (
                        <g>
                          {/* Desktop PC - tower and monitor */}
                          {/* Monitor */}
                          <rect x={device.x - 1.95} y={device.y - 1.95} width="3.9" height="2.7" rx="0.225" fill="#2d3748" stroke="#4a5568" strokeWidth="0.15" />
                          <rect x={device.x - 1.65} y={device.y - 1.65} width="3.3" height="2.1" fill={device.status === "offline" ? "#1a1a1a" : "#4299e1"} opacity={device.status === "offline" ? "0.3" : "0.6"} />

                          {/* Monitor stand */}
                          <rect x={device.x - 0.3} y={device.y + 0.75} width="0.6" height="0.75" fill="#4a5568" />
                          <rect x={device.x - 0.9} y={device.y + 1.5} width="1.8" height="0.225" fill="#4a5568" />

                          {/* PC Tower (small) */}
                          <rect x={device.x + 1.2} y={device.y + 0.45} width="1.2" height="1.8" rx="0.15" fill="#2d3748" stroke="#4a5568" strokeWidth="0.12" />
                          <circle cx={device.x + 1.8} cy={device.y + 0.9} r="0.15" fill={device.status === "offline" ? "#ef4444" : "#10b981"}>
                            {device.status === "offline" ? (
                              <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
                            ) : (
                              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                            )}
                          </circle>
                          <rect x={device.x + 1.425} y={device.y + 1.5} width="0.75" height="0.225" fill="#1a1a1a" />
                        </g>
                      )}

                      {device.type === 'server' && (
                        <g>
                          {/* Server - tower style like Cisco PT */}
                          <rect x={device.x - 1.8} y={device.y - 2.25} width="3.6" height="4.5" rx="0.3" fill="#2d3748" stroke="#4a5568" strokeWidth="0.15" />

                          {/* Front panel */}
                          <rect x={device.x - 1.5} y={device.y - 1.95} width="3" height="3.9" fill="#374151" />

                          {/* Drive bays */}
                          {[0, 0.75, 1.5, 2.25].map((offset, i) => (
                            <g key={i}>
                              <rect x={device.x - 1.35} y={device.y - 1.65 + offset} width="2.7" height="0.525" fill="#1a1a1a" stroke="#4a9eff" strokeWidth="0.075" />
                              <circle cx={device.x + 0.9} cy={device.y - 1.395 + offset} r="0.12" fill="#10b981">
                                <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                              </circle>
                            </g>
                          ))}

                          {/* Power button */}
                          <circle cx={device.x} cy={device.y + 1.8} r="0.225" fill="#3b82f6" opacity="0.8" />
                        </g>
                      )}

                      {device.type === 'isp' && (
                        <g>
                          {/* Cloud icon for ISP - Cisco style */}
                          <ellipse cx={device.x - 1.8} cy={device.y + 0.3} rx="1.95" ry="1.35" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.225" />
                          <ellipse cx={device.x - 0.45} cy={device.y - 0.75} rx="2.4" ry="1.65" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.225" />
                          <ellipse cx={device.x + 1.5} cy={device.y} rx="2.1" ry="1.5" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.225" />
                          <ellipse cx={device.x + 0.3} cy={device.y + 0.75} rx="2.25" ry="1.425" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.225" />

                          {/* Fill the gaps */}
                          <rect x={device.x - 3.45} y={device.y - 0.45} width="6.9" height="1.8" fill="#e0f2fe" />

                          {/* ISP text */}
                          <text x={device.x} y={device.y + 0.6} textAnchor="middle" className="fill-cyan-700 font-bold" style={{ fontSize: "2.7px" }}>
                            ISP
                          </text>
                        </g>
                      )}

                      {/* Device label */}
                      <text
                        x={device.x}
                        y={device.y - size / 2 - 2.25}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold"
                        style={{ fontSize: "3.75px", textShadow: "0 0 2px rgba(0,0,0,0.8)" }}
                      >
                        {device.name}
                      </text>

                      {/* Primary IP - only show for non-PC devices */}
                      {device.interfaces[0] && device.type !== 'pc' && (
                        <text
                          x={device.x}
                          y={device.y + size / 2 + 3.75}
                          textAnchor="middle"
                          className="fill-gray-300 text-xs"
                          style={{ fontSize: "2.7px" }}
                        >
                          {device.interfaces[0].ip}{device.interfaces[0].subnet}
                        </text>
                      )}

                      {/* Status indicator */}
                      <circle
                        cx={device.x + size / 2 - 0.75}
                        cy={device.y - size / 2 + 0.75}
                        r="1.2"
                        className={clsx(
                          device.status === "online" && "fill-green-400",
                          device.status === "warning" && "fill-yellow-400",
                          device.status === "offline" && "fill-red-400"
                        )}
                      >
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                      </circle>


                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {selectedDevice ? (
            <motion.div
              className="glass-effect rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={clsx("p-2 rounded-lg border", statusColors[selectedDevice.status])}>
                  {React.createElement(typeIcons[selectedDevice.type], { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedDevice.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{selectedDevice.type}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={clsx("capitalize font-medium", statusColors[selectedDevice.status])}>
                    {selectedDevice.status}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <h4 className="text-sm font-semibold text-white mb-2">Interfaces</h4>
                  <div className="space-y-2">
                    {selectedDevice.interfaces.map((iface, i) => (
                      <div key={i} className="bg-white/5 rounded p-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-nexlytix-400 font-medium">{iface.name}</span>
                          <span className={selectedDevice.status === "offline" ? "text-red-400" : "text-green-400"}>
                            {selectedDevice.status === "offline" ? "DOWN" : "UP"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          {iface.ip}{iface.subnet}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <h4 className="text-sm font-semibold text-white mb-2">Connections</h4>
                  <div className="text-xs text-gray-300">
                    {selectedDevice.connections.length} active connection(s)
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="w-full bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 text-nexlytix-400 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Configure Device
                </button>
                {selectedDevice.type === 'router' && (
                  <button 
                    onClick={() => setShowRoutingTable(true)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    View Routing Table
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="glass-effect rounded-xl p-6 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Device</h3>
              <p className="text-gray-400 text-sm">
                Click on any device in the network topology to view its configuration and details.
              </p>
            </motion.div>
          )}

          {/* Network Stats */}
          <motion.div
            className="glass-effect rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Network Statistics</h3>
            <div className="space-y-3">
              {[
                { label: "Total Devices", value: "11" },
                { label: "Routers", value: "3" },
                { label: "Switches", value: "3" },
                { label: "End Devices", value: "4" },
                { label: "Network Uptime", value: "99.9%" }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className="text-white font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowConfigModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Configure {selectedDevice.name}</h2>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Device Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Device Name:</span>
                      <span className="text-white ml-2 font-medium">{selectedDevice.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-2 font-medium capitalize">{selectedDevice.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={clsx("ml-2 font-medium capitalize", statusColors[selectedDevice.status])}>
                        {selectedDevice.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Interfaces:</span>
                      <span className="text-white ml-2 font-medium">{selectedDevice.interfaces.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Interface Configuration</h3>
                  <div className="space-y-3">
                    {selectedDevice.interfaces.map((iface, i) => (
                      <div key={i} className="bg-black/20 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-nexlytix-400 font-medium">{iface.name}</span>
                          <span className={selectedDevice.status === "offline" ? "text-red-400 text-xs" : "text-green-400 text-xs"}>
                            {selectedDevice.status === "offline" ? "● DOWN" : "● UP"}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IP Address:</span>
                            <span className="text-white font-mono">{iface.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subnet Mask:</span>
                            <span className="text-white font-mono">{iface.subnet}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
                  
                  {actionMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 bg-nexlytix-600/20 border border-nexlytix-500/30 text-nexlytix-400 py-2 px-4 rounded-lg text-sm"
                    >
                      ✓ {actionMessage}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleQuickAction('All interfaces enabled successfully')}
                      className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Enable All Interfaces
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Interface shutdown command executed')}
                      className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Shutdown Interface
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Configuration reset to factory defaults')}
                      className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Reset Configuration
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Configuration saved to NVRAM')}
                      className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Save Config
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="bg-nexlytix-600 hover:bg-nexlytix-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Routing Table Modal */}
      <AnimatePresence>
        {showRoutingTable && selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowRoutingTable(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Routing Table - {selectedDevice.name}</h2>
                <button
                  onClick={() => setShowRoutingTable(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedDevice.type === "router" ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-2 text-gray-400 font-semibold">Network</th>
                            <th className="text-left py-3 px-2 text-gray-400 font-semibold">Next Hop</th>
                            <th className="text-left py-3 px-2 text-gray-400 font-semibold">Interface</th>
                            <th className="text-left py-3 px-2 text-gray-400 font-semibold">Metric</th>
                            <th className="text-left py-3 px-2 text-gray-400 font-semibold">Protocol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDevice.interfaces.map((iface, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-2 text-white font-mono">{iface.ip.split('.').slice(0, 3).join('.')}.0{iface.subnet}</td>
                              <td className="py-3 px-2 text-green-400">Directly Connected</td>
                              <td className="py-3 px-2 text-nexlytix-400">{iface.name}</td>
                              <td className="py-3 px-2 text-white">0</td>
                              <td className="py-3 px-2 text-blue-400">C</td>
                            </tr>
                          ))}
                          {selectedDevice.connections.filter(conn => conn.ip).map((conn, i) => (
                            <tr key={`conn-${i}`} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-2 text-white font-mono">{conn.ip?.split('.').slice(0, 3).join('.')}.0/30</td>
                              <td className="py-3 px-2 text-yellow-400">{conn.ip}</td>
                              <td className="py-3 px-2 text-nexlytix-400">{conn.interface}</td>
                              <td className="py-3 px-2 text-white">1</td>
                              <td className="py-3 px-2 text-purple-400">S</td>
                            </tr>
                          ))}
                          <tr className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-2 text-white font-mono">0.0.0.0/0</td>
                            <td className="py-3 px-2 text-yellow-400">209.165.200.224</td>
                            <td className="py-3 px-2 text-nexlytix-400">S0/1/0</td>
                            <td className="py-3 px-2 text-white">1</td>
                            <td className="py-3 px-2 text-purple-400">S*</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Legend</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-blue-400 font-mono">C</span> - <span className="text-gray-300">Connected</span></div>
                      <div><span className="text-purple-400 font-mono">S</span> - <span className="text-gray-300">Static</span></div>
                      <div><span className="text-purple-400 font-mono">S*</span> - <span className="text-gray-300">Default Route</span></div>
                      <div><span className="text-orange-400 font-mono">R</span> - <span className="text-gray-300">RIP</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Routing Table Available</h3>
                  <p className="text-gray-400">
                    Routing tables are only available for router devices. This {selectedDevice.type} does not maintain a routing table.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowRoutingTable(false)}
                  className="bg-nexlytix-600 hover:bg-nexlytix-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NetworkMap;
