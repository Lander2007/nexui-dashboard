import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Network, BarChart3, Cpu, Shield, Zap, Bot } from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "network", label: "Network Map", icon: Network },
  { id: "analytics", label: "AI Analytics", icon: BarChart3 },
  { id: "devices", label: "Devices", icon: Cpu },
  { id: "security", label: "Security", icon: Shield },
  { id: "automation", label: "Automation", icon: Zap },
];

function Sidebar({ activeView, setActiveView }: SidebarProps): React.ReactElement {
  return React.createElement(
    "div",
    { className: "w-64 bg-dark-900/50 backdrop-blur-xl border-r border-white/10 h-screen relative" },

    // Logo
    React.createElement(
      "div",
      { className: "p-6" },
      React.createElement(
        "div",
        { className: "flex items-center space-x-3 mb-8" },
        React.createElement(
          "div",
          { className: "w-10 h-10 bg-gradient-to-br from-nexlytix-500 to-nexlytix-700 rounded-lg flex items-center justify-center" },
          React.createElement(Bot, { className: "w-6 h-6 text-white" })
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h1",
            { className: "text-xl font-bold bg-gradient-to-r from-nexlytix-400 to-nexlytix-600 bg-clip-text text-transparent" },
            "Nexlytix"
          ),
          React.createElement("p", { className: "text-xs text-gray-400" }, "AI Network Intelligence")
        )
      ),

      // Navigation Menu
      React.createElement(
        "nav",
        { className: "space-y-2" },
        ...menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return React.createElement(
            motion.button,
            {
              key: item.id,
              onClick: () => setActiveView(item.id),
              className: clsx(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isActive
                  ? "bg-nexlytix-600/20 text-nexlytix-400 border border-nexlytix-500/30"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              ),
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
            },
            React.createElement(Icon, { className: "w-5 h-5" }),
            React.createElement("span", { className: "font-medium" }, item.label)
          );
        })
      )
    ),

    // Bottom Status
    React.createElement(
      "div",
      { className: "absolute bottom-6 left-6 right-6" },
      React.createElement(
        "div",
        { className: "glass-effect rounded-lg p-4" },
        React.createElement(
          "div",
          { className: "flex items-center space-x-3 mb-2" },
          React.createElement("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }),
          React.createElement("span", { className: "text-sm font-medium text-green-400" }, "System Online")
        ),
        React.createElement("p", { className: "text-xs text-gray-400" }, "247 devices connected")
      )
    )
  );
}

export default Sidebar;
