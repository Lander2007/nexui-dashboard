import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, User, Search, Wifi, Activity, Settings, LogOut, UserCircle, X, Clock, AlertTriangle, CheckCircle, Info, AlertCircle, Trash2 } from "lucide-react";

interface HeaderProps {
  onChatToggle: () => void;
}

function Header({ onChatToggle }: HeaderProps): React.ReactElement {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sample search suggestions and recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(["Gateway-03", "Security alerts", "Device health"]);

  // Comprehensive search data - devices, alerts, commands, and more
  const searchDatabase = [
    // Devices
    { type: "device", name: "Gateway-01", status: "online", category: "Devices", description: "Main gateway router", ip: "192.168.1.1" },
    { type: "device", name: "Gateway-02", status: "online", category: "Devices", description: "Secondary gateway", ip: "192.168.1.2" },
    { type: "device", name: "Gateway-03", status: "warning", category: "Devices", description: "Edge gateway", ip: "192.168.1.3" },
    { type: "device", name: "ESP32-Node-142", status: "warning", category: "Devices", description: "IoT sensor node", ip: "192.168.2.142" },
    { type: "device", name: "ESP32-Node-089", status: "offline", category: "Devices", description: "Temperature sensor", ip: "192.168.2.89" },
    { type: "device", name: "Access Point 7", status: "online", category: "Devices", description: "WiFi AP - Floor 2", ip: "192.168.3.7" },
    { type: "device", name: "Access Point 12", status: "online", category: "Devices", description: "WiFi AP - Floor 3", ip: "192.168.3.12" },
    { type: "device", name: "Network Switch 1", status: "online", category: "Devices", description: "Core switch", ip: "192.168.1.10" },
    
    // Alerts
    { type: "alert", name: "High latency detected", severity: "warning", category: "Alerts", description: "Gateway-03 latency > 50ms", time: "2 min ago" },
    { type: "alert", name: "Firmware update available", severity: "info", category: "Alerts", description: "6 devices need updates", time: "5 min ago" },
    { type: "alert", name: "Device offline", severity: "critical", category: "Alerts", description: "ESP32-Node-089 disconnected", time: "10 min ago" },
    { type: "alert", name: "Low battery warning", severity: "warning", category: "Alerts", description: "ESP32-Node-142 battery at 12%", time: "15 min ago" },
    { type: "alert", name: "Security scan completed", severity: "success", category: "Alerts", description: "No threats detected", time: "1 hour ago" },
    
    // Commands
    { type: "command", name: "Run Diagnostics", category: "Commands", description: "Execute network diagnostics", icon: "🔧" },
    { type: "command", name: "Network Status", category: "Commands", description: "View network health", icon: "🌐" },
    { type: "command", name: "Security Scan", category: "Commands", description: "Run security check", icon: "🛡️" },
    { type: "command", name: "Device Inventory", category: "Commands", description: "List all devices", icon: "📱" },
    { type: "command", name: "Performance Report", category: "Commands", description: "Generate performance metrics", icon: "📊" },
    { type: "command", name: "Optimize Network", category: "Commands", description: "Run optimization", icon: "🚀" },
    
    // Settings
    { type: "setting", name: "Network Configuration", category: "Settings", description: "Configure network settings" },
    { type: "setting", name: "Security Policies", category: "Settings", description: "Manage security rules" },
    { type: "setting", name: "User Management", category: "Settings", description: "Manage users and permissions" },
    { type: "setting", name: "Backup Settings", category: "Settings", description: "Configure backups" }
  ];

  const filteredSuggestions = searchValue.trim()
    ? searchDatabase.filter(item => {
        const searchLower = searchValue.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          ((item as any).ip && (item as any).ip.includes(searchValue))
        );
      }).slice(0, 10) // Limit to 10 results
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Add to recent searches
      if (!recentSearches.includes(searchValue)) {
        setRecentSearches(prev => [searchValue, ...prev.slice(0, 4)]);
      }
      
      // Execute search
      console.log("Searching for:", searchValue);
      
      // Find exact match
      const exactMatch = searchDatabase.find(item => 
        item.name.toLowerCase() === searchValue.toLowerCase()
      );
      
      if (exactMatch) {
        handleItemClick(exactMatch);
      } else {
        // Show results
        console.log("Search results:", filteredSuggestions);
      }
      
      setShowSearchResults(false);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowSearchResults(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    
    // Add to recent searches
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches(prev => [suggestion, ...prev.slice(0, 4)]);
    }
    
    // Find and execute the item
    const item = searchDatabase.find(i => i.name === suggestion);
    if (item) {
      handleItemClick(item);
    }
    
    setShowSearchResults(false);
  };

  const handleItemClick = (item: any) => {
    console.log("Item clicked:", item);
    
    switch (item.type) {
      case "device":
        console.log(`Opening device: ${item.name} (${item.ip})`);
        alert(`Device: ${item.name}\nStatus: ${item.status}\nIP: ${item.ip}\nDescription: ${item.description}`);
        break;
      case "alert":
        console.log(`Opening alert: ${item.name}`);
        alert(`Alert: ${item.name}\nSeverity: ${item.severity}\nDescription: ${item.description}\nTime: ${item.time}`);
        break;
      case "command":
        console.log(`Executing command: ${item.name}`);
        alert(`Executing: ${item.name}\n${item.description}`);
        break;
      case "setting":
        console.log(`Opening setting: ${item.name}`);
        alert(`Opening Settings: ${item.name}\n${item.description}`);
        break;
      default:
        console.log("Unknown item type");
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: "warning", 
      title: "High Latency Detected",
      message: "Gateway-03 experiencing latency above 50ms threshold", 
      time: "2 min ago",
      device: "Gateway-03",
      read: false,
      priority: "high"
    },
    { 
      id: 2, 
      type: "info", 
      title: "Firmware Update Available",
      message: "6 devices have pending firmware updates ready to install", 
      time: "5 min ago",
      device: "Multiple Devices",
      read: false,
      priority: "medium"
    },
    { 
      id: 3, 
      type: "success", 
      title: "Optimization Complete",
      message: "Network optimization completed with 15% performance improvement", 
      time: "10 min ago",
      device: "Network",
      read: false,
      priority: "low"
    },
    { 
      id: 4, 
      type: "error", 
      title: "Device Offline",
      message: "ESP32-Node-089 has lost connection and is currently offline", 
      time: "15 min ago",
      device: "ESP32-Node-089",
      read: true,
      priority: "critical"
    },
    { 
      id: 5, 
      type: "warning", 
      title: "Low Battery Warning",
      message: "ESP32-Node-142 battery level is critically low at 12%", 
      time: "20 min ago",
      device: "ESP32-Node-142",
      read: true,
      priority: "high"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  return (
    <header className="bg-dark-900/30 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-[100000]">
      <div className="flex items-center justify-between">
        {/* Left: Enhanced Search */}
        <div className="flex items-center space-x-4">
          <div ref={searchRef} className="relative" style={{ zIndex: 999999 }}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${
                  searchFocused ? 'text-nexlytix-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleSearchFocus}
                  placeholder="Search Devices, Alerts, Or Type A Command..."
                  className={`bg-white/5 border rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-400 focus:outline-none w-[500px] transition-all duration-200 ${
                    searchFocused 
                      ? 'border-nexlytix-500 ring-2 ring-nexlytix-500/30 bg-white/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  className="absolute top-full mt-2 w-full bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  style={{ zIndex: 999999, position: 'absolute' }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Recent Searches */}
                  {!searchValue && (
                    <div className="p-3 border-b border-white/10">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            whileHover={{ x: 4 }}
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Results */}
                  {searchValue && filteredSuggestions.length > 0 && (
                    <div className="p-3">
                      <div className="text-xs text-gray-400 mb-2">
                        {filteredSuggestions.length} results found
                      </div>
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {filteredSuggestions.map((item: any, index: number) => {
                          const getStatusColor = () => {
                            if (item.type === 'device') {
                              if (item.status === 'online') return 'bg-green-400';
                              if (item.status === 'offline') return 'bg-red-400';
                              return 'bg-yellow-400';
                            }
                            if (item.type === 'alert') {
                              if (item.severity === 'critical') return 'bg-red-400';
                              if (item.severity === 'warning') return 'bg-yellow-400';
                              if (item.severity === 'success') return 'bg-green-400';
                              return 'bg-blue-400';
                            }
                            if (item.type === 'command') return 'bg-purple-400';
                            return 'bg-gray-400';
                          };

                          const getBadgeColor = () => {
                            if (item.type === 'device') {
                              if (item.status === 'online') return 'bg-green-400/20 text-green-300';
                              if (item.status === 'offline') return 'bg-red-400/20 text-red-300';
                              return 'bg-yellow-400/20 text-yellow-300';
                            }
                            if (item.type === 'alert') {
                              if (item.severity === 'critical') return 'bg-red-400/20 text-red-300';
                              if (item.severity === 'warning') return 'bg-yellow-400/20 text-yellow-300';
                              if (item.severity === 'success') return 'bg-green-400/20 text-green-300';
                              return 'bg-blue-400/20 text-blue-300';
                            }
                            if (item.type === 'command') return 'bg-purple-400/20 text-purple-300';
                            return 'bg-gray-400/20 text-gray-300';
                          };

                          return (
                            <motion.button
                              key={index}
                              onClick={() => {
                                handleSuggestionClick(item.name);
                                handleItemClick(item);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                              whileHover={{ x: 4 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor()}`} />
                                <div className="text-left flex-1 min-w-0">
                                  <div className="font-medium truncate">{item.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{item.description || item.category}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {item.type === 'command' && item.icon && (
                                  <span className="text-lg">{item.icon}</span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getBadgeColor()}`}>
                                  {item.type === 'device' ? item.status : 
                                   item.type === 'alert' ? item.severity :
                                   item.type === 'command' ? 'Execute' :
                                   item.category}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchValue && filteredSuggestions.length === 0 && (
                    <div className="p-6 text-center">
                      <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No results found for "{searchValue}"</p>
                      <p className="text-gray-500 text-xs mt-1">Try searching for devices, alerts, or commands</p>
                    </div>
                  )}

                  {/* Footer Tip */}
                  <div className="p-2 bg-white/5 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                      Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Enter</kbd> to search or <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Esc</kbd> to close
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Network, AI, and Buttons */}
        <div className="flex items-center space-x-4">
          {/* Network & AI status */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Network: Optimal</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-nexlytix-400" />
              <span className="text-gray-300">AI: Active</span>
            </div>
          </div>

          {/* Buttons: Notifications, Ask Vemo, User */}
          <div className="flex items-center space-x-3">
            {/* 🔔 Notifications */}
            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className={`relative p-2.5 rounded-lg transition-all duration-200 ${
                  showNotifications 
                    ? 'bg-nexlytix-600/20 text-nexlytix-400 shadow-lg shadow-nexlytix-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={unreadCount > 0 ? { 
                  rotate: [0, -10, 10, -10, 10, 0],
                } : {}}
                transition={{ 
                  rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
                }}
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                {unreadCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-red-500 to-red-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Full Window Overlay */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end p-6 z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleNotificationClick}
                  >
                    <motion.div
                      className="w-96 max-h-[80vh] bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden mt-16 mr-4"
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 400, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-nexlytix-600/20 to-purple-600/20 border-b border-nexlytix-500/30 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                              <Bell className="w-5 h-5" />
                              <span>Notifications</span>
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                            </p>
                          </div>
                          <button
                            onClick={handleNotificationClick}
                            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-nexlytix-400 hover:text-nexlytix-300 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-12 text-center">
                            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No notifications</p>
                            <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                          </div>
                        ) : (
                          notifications.map((notif, index) => {
                            const getIcon = () => {
                              switch (notif.type) {
                                case 'error': return <AlertCircle className="w-5 h-5" />;
                                case 'warning': return <AlertTriangle className="w-5 h-5" />;
                                case 'success': return <CheckCircle className="w-5 h-5" />;
                                case 'info': return <Info className="w-5 h-5" />;
                                default: return <Bell className="w-5 h-5" />;
                              }
                            };

                            const getColors = () => {
                              switch (notif.type) {
                                case 'error': return {
                                  bg: 'bg-red-500/10',
                                  border: 'border-red-500/30',
                                  text: 'text-red-400',
                                  badge: 'bg-red-500/20 text-red-300',
                                  dot: 'bg-red-500'
                                };
                                case 'warning': return {
                                  bg: 'bg-yellow-500/10',
                                  border: 'border-yellow-500/30',
                                  text: 'text-yellow-400',
                                  badge: 'bg-yellow-500/20 text-yellow-300',
                                  dot: 'bg-yellow-500'
                                };
                                case 'success': return {
                                  bg: 'bg-green-500/10',
                                  border: 'border-green-500/30',
                                  text: 'text-green-400',
                                  badge: 'bg-green-500/20 text-green-300',
                                  dot: 'bg-green-500'
                                };
                                default: return {
                                  bg: 'bg-blue-500/10',
                                  border: 'border-blue-500/30',
                                  text: 'text-blue-400',
                                  badge: 'bg-blue-500/20 text-blue-300',
                                  dot: 'bg-blue-500'
                                };
                              }
                            };

                            const colors = getColors();

                            return (
                              <motion.div
                                key={notif.id}
                                className={`p-4 border-b border-white/5 transition-all duration-200 ${
                                  !notif.read ? 'bg-white/5' : ''
                                }`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                              >
                                <div className="flex items-start space-x-3">
                                  {/* Icon */}
                                  <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                                    {getIcon()}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                      <h4 className={`text-sm font-semibold ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                                        {notif.title}
                                      </h4>
                                      {!notif.read && (
                                        <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0 ml-2 mt-1`} />
                                      )}
                                    </div>
                                    
                                    <p className="text-gray-400 text-xs leading-relaxed mb-2">
                                      {notif.message}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${colors.badge} font-medium`}>
                                          {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {notif.device}
                                        </span>
                                        <span className="text-xs text-gray-600">•</span>
                                        <span className="text-xs text-gray-500">
                                          {notif.time}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex flex-col space-y-1 flex-shrink-0">
                                    {!notif.read && (
                                      <button
                                        onClick={() => markAsRead(notif.id)}
                                        className="p-1.5 text-gray-400 hover:text-nexlytix-400 transition-colors rounded hover:bg-white/10"
                                        title="Mark as read"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteNotification(notif.id)}
                                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                                      title="Delete"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                      
                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-4 bg-gradient-to-r from-dark-800 to-dark-900 border-t border-white/10">
                          <div className="flex space-x-2">
                            <button
                              onClick={clearAllNotifications}
                              className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Clear All</span>
                            </button>
                            <button
                              onClick={() => {
                                // Mark all as read and show alert with all notifications
                                markAllAsRead();
                                alert(`All Notifications (${notifications.length}):\n\n${notifications.map(n => 
                                  `${n.title}\n${n.message}\nDevice: ${n.device} | ${n.time}`
                                ).join('\n\n---\n\n')}`);
                              }}
                              className="flex-1 bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 text-nexlytix-400 hover:text-nexlytix-300 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105 active:scale-95"
                            >
                              <Bell className="w-4 h-4" />
                              <span>View All</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 💬 Ask Vemo */}
            <motion.button
              onClick={onChatToggle}
              className="flex items-center space-x-2 bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 rounded-lg px-3 py-2 text-nexlytix-400 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Vemo</span>
            </motion.button>

            {/* 👤 User Menu */}
            <div className="relative">
              <motion.button
                onClick={handleUserClick}
                className={`flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors ${showUserMenu ? 'text-nexlytix-400' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* User Menu Full Window Overlay */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end p-6 z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleUserClick}
                  >
                    <motion.div
                      className="w-80 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden mt-16 mr-4"
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 400, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="bg-nexlytix-600/20 border-b border-nexlytix-500/30 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-nexlytix-600 rounded-full flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Admin User</p>
                            <p className="text-gray-400 text-sm">Network Administrator</p>
                          </div>
                        </div>
                        <button
                          onClick={handleUserClick}
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-4 space-y-2">
                        <motion.button
                          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", x: 4 }}
                          onClick={() => console.log("Profile clicked")}
                        >
                          <UserCircle className="w-5 h-5" />
                          <div>
                            <span className="text-sm font-medium">Profile Settings</span>
                            <p className="text-xs text-gray-400">Manage your account</p>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", x: 4 }}
                          onClick={() => console.log("Settings clicked")}
                        >
                          <Settings className="w-5 h-5" />
                          <div>
                            <span className="text-sm font-medium">System Settings</span>
                            <p className="text-xs text-gray-400">Configure preferences</p>
                          </div>
                        </motion.button>
                        
                        <div className="border-t border-white/10 my-3" />
                        
                        <motion.button
                          className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                          whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)", x: 4 }}
                          onClick={() => console.log("Logout clicked")}
                        >
                          <LogOut className="w-5 h-5" />
                          <div>
                            <span className="text-sm font-medium">Sign Out</span>
                            <p className="text-xs text-red-300/70">End your session</p>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
