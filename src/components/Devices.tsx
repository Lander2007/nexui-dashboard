import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  Radio,
  Wifi,
  Power,
  Settings,
  RefreshCw,
  Trash2,
  Edit,
  Activity,
  Battery,
  Signal,
  MapPin,
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: "gateway" | "node" | "sensor";
  status: "online" | "offline" | "warning";
  rssi: number;
  battery: number;
  temperature: number;
  lastSeen: string;
  firmware: string;
  location: string;
}

const devices: Device[] = [
  {
    id: "gw-001",
    name: "Gateway-001",
    type: "gateway",
    status: "online",
    rssi: -45,
    battery: 100,
    temperature: 42,
    lastSeen: "2 min ago",
    firmware: "v2.1.3",
    location: "Server Room",
  },
  {
    id: "gw-002",
    name: "Gateway-002",
    type: "gateway",
    status: "online",
    rssi: -48,
    battery: 100,
    temperature: 40,
    lastSeen: "1 min ago",
    firmware: "v2.1.3",
    location: "Data Center",
  },
  {
    id: "esp-001",
    name: "ESP32-Node-001",
    type: "node",
    status: "online",
    rssi: -62,
    battery: 87,
    temperature: 38,
    lastSeen: "1 min ago",
    firmware: "v2.1.3",
    location: "Floor 2 - East Wing",
  },
  {
    id: "esp-002",
    name: "ESP32-Node-002",
    type: "node",
    status: "warning",
    rssi: -78,
    battery: 23,
    temperature: 45,
    lastSeen: "5 min ago",
    firmware: "v2.1.2",
    location: "Floor 3 - West Wing",
  },
  {
    id: "esp-003",
    name: "ESP32-Node-003",
    type: "node",
    status: "online",
    rssi: -58,
    battery: 94,
    temperature: 36,
    lastSeen: "30 sec ago",
    firmware: "v2.1.3",
    location: "Floor 1 - Lobby",
  },
  {
    id: "esp-004",
    name: "ESP32-Node-004",
    type: "node",
    status: "online",
    rssi: -65,
    battery: 78,
    temperature: 41,
    lastSeen: "2 min ago",
    firmware: "v2.1.3",
    location: "Floor 4 - North Wing",
  },
  {
    id: "esp-005",
    name: "ESP32-Node-005",
    type: "node",
    status: "online",
    rssi: -70,
    battery: 65,
    temperature: 39,
    lastSeen: "3 min ago",
    firmware: "v2.1.2",
    location: "Floor 5 - South Wing",
  },
  {
    id: "sens-001",
    name: "Temp-Sensor-001",
    type: "sensor",
    status: "online",
    rssi: -55,
    battery: 92,
    temperature: 22,
    lastSeen: "30 sec ago",
    firmware: "v1.8.1",
    location: "Conference Room A",
  },
  {
    id: "sens-002",
    name: "Motion-Sensor-002",
    type: "sensor",
    status: "offline",
    rssi: -95,
    battery: 5,
    temperature: 0,
    lastSeen: "2 hours ago",
    firmware: "v1.7.9",
    location: "Parking Garage",
  },
  {
    id: "sens-003",
    name: "Humidity-Sensor-003",
    type: "sensor",
    status: "online",
    rssi: -60,
    battery: 88,
    temperature: 24,
    lastSeen: "1 min ago",
    firmware: "v1.8.1",
    location: "Conference Room B",
  },
  {
    id: "sens-004",
    name: "Light-Sensor-004",
    type: "sensor",
    status: "online",
    rssi: -52,
    battery: 96,
    temperature: 21,
    lastSeen: "45 sec ago",
    firmware: "v1.8.1",
    location: "Main Hall",
  },
  {
    id: "sens-005",
    name: "Pressure-Sensor-005",
    type: "sensor",
    status: "warning",
    rssi: -82,
    battery: 18,
    temperature: 28,
    lastSeen: "8 min ago",
    firmware: "v1.7.9",
    location: "Warehouse",
  },
];

const statusColors = {
  online: "text-green-400 bg-green-500/20",
  warning: "text-yellow-400 bg-yellow-500/20",
  offline: "text-red-400 bg-red-500/20",
};

const typeIcons = {
  gateway: Radio,
  node: Wifi,
  sensor: Zap,
};

function Devices(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddDevice = () => {
    showNotification("Opening add device wizard...");
  };

  const handleBulkActions = () => {
    showNotification("Opening bulk actions menu...");
  };

  const handleConfigure = (deviceName: string) => {
    showNotification(`Configuring ${deviceName}...`);
  };

  const handleRestart = (deviceName: string) => {
    showNotification(`Restarting ${deviceName}...`);
  };

  const handleEdit = (deviceName: string) => {
    showNotification(`Editing ${deviceName}...`);
  };

  const handleDelete = (deviceName: string) => {
    showNotification(`Deleting ${deviceName}...`);
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || device.type === filterType;
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Device Management</h1>
          <p className="text-gray-400 mt-1">Monitor and control all network devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddDevice}
            className="bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 text-nexlytix-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Add Device
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBulkActions}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Bulk Actions
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nexlytix-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-nexlytix-500 [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all" className="bg-gray-800 text-white">All Types</option>
              <option value="gateway" className="bg-gray-800 text-white">Gateways</option>
              <option value="node" className="bg-gray-800 text-white">Nodes</option>
              <option value="sensor" className="bg-gray-800 text-white">Sensors</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-nexlytix-500 [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all" className="bg-gray-800 text-white">All Status</option>
              <option value="online" className="bg-gray-800 text-white">Online</option>
              <option value="warning" className="bg-gray-800 text-white">Warning</option>
              <option value="offline" className="bg-gray-800 text-white">Offline</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="glass-effect rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Devices</p>
              <p className="text-2xl font-bold text-white mt-1">{devices.length}</p>
            </div>
            <div className="p-3 bg-nexlytix-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-nexlytix-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Online</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {devices.filter((d) => d.status === "online").length}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Power className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Warning</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {devices.filter((d) => d.status === "warning").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Offline</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {devices.filter((d) => d.status === "offline").length}
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Power className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => {
          const Icon = typeIcons[device.type];
          return (
            <motion.div
              key={device.id}
              className="glass-effect rounded-xl p-5 hover:border-nexlytix-500/50 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusColors[device.status]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{device.name}</h3>
                    <p className="text-gray-400 text-xs capitalize">{device.type}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColors[device.status]}`}
                >
                  {device.status}
                </span>
              </div>

              {/* Device Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Signal className="w-4 h-4" />
                    <span>Signal</span>
                  </div>
                  <span className="text-white font-medium">{device.rssi} dBm</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Battery className="w-4 h-4" />
                    <span>Battery</span>
                  </div>
                  <span className={`font-medium ${device.battery < 20 ? 'text-red-400' : device.battery < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {device.battery}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Activity className="w-4 h-4" />
                    <span>Temp</span>
                  </div>
                  <span className="text-white font-medium">{device.temperature}°C</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <span className="text-white font-medium text-xs">{device.location}</span>
                </div>
              </div>

              {/* Device Info */}
              <div className="border-t border-white/10 pt-3 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Firmware: <span className="text-white">{device.firmware}</span></span>
                  <span>Last seen: <span className="text-white">{device.lastSeen}</span></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleConfigure(device.name)}
                  className="flex-1 bg-nexlytix-500/20 hover:bg-nexlytix-500/30 border border-nexlytix-500/30 text-nexlytix-400 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Configure</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRestart(device.name)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                  title="Restart"
                >
                  <RefreshCw className="w-3 h-3 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(device.name)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-3 h-3 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(device.name)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredDevices.length === 0 && (
        <motion.div
          className="glass-effect rounded-xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No devices found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}

export default Devices;
