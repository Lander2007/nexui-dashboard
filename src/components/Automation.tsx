import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Plus,
  Settings,
  Battery,
  AlertTriangle,
} from "lucide-react";
import { clsx } from "clsx";

// ✅ Types
interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused" | "error";
  lastRun: string;
  executions: number;
  category: "performance" | "security" | "maintenance" | "energy";
}

// ✅ Data
const automationRules: AutomationRule[] = [
  {
    id: "auto-001",
    name: "Network Optimization",
    description: "Automatically reroute traffic when latency exceeds 100ms",
    trigger: "Latency > 100ms",
    action: "Reroute Traffic",
    status: "active",
    lastRun: "2 minutes ago",
    executions: 247,
    category: "performance",
  },
  {
    id: "auto-002",
    name: "Low Battery Alert",
    description: "Send alert and reduce power consumption when battery < 20%",
    trigger: "Battery < 20%",
    action: "Alert + Power Save",
    status: "active",
    lastRun: "15 minutes ago",
    executions: 89,
    category: "energy",
  },
  {
    id: "auto-003",
    name: "Security Lockdown",
    description: "Isolate device when suspicious activity detected",
    trigger: "Threat Detected",
    action: "Isolate Device",
    status: "active",
    lastRun: "1 hour ago",
    executions: 12,
    category: "security",
  },
  {
    id: "auto-004",
    name: "Firmware Update",
    description: "Auto-update firmware during maintenance windows",
    trigger: "Schedule: 2AM Daily",
    action: "OTA Update",
    status: "paused",
    lastRun: "1 day ago",
    executions: 156,
    category: "maintenance",
  },
  {
    id: "auto-005",
    name: "Temperature Control",
    description: "Reduce transmission power when temperature > 50°C",
    trigger: "Temperature > 50°C",
    action: "Reduce Power",
    status: "error",
    lastRun: "3 hours ago",
    executions: 34,
    category: "maintenance",
  },
];

// ✅ Colors & Icons
const statusColors = {
  active: "text-green-400 bg-green-500/20",
  paused: "text-yellow-400 bg-yellow-500/20",
  error: "text-red-400 bg-red-500/20",
};

const categoryColors = {
  performance: "text-nexlytix-400 bg-nexlytix-500/20",
  security: "text-red-400 bg-red-500/20",
  maintenance: "text-blue-400 bg-blue-500/20",
  energy: "text-green-400 bg-green-500/20",
};

const categoryIcons = {
  performance: Zap,
  security: AlertTriangle,
  maintenance: Settings,
  energy: Battery,
};

// ✅ Component
function Automation(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRules =
    selectedCategory === "all"
      ? automationRules
      : automationRules.filter((rule) => rule.category === selectedCategory);

  return React.createElement(
    "div",
    { className: "space-y-6" },

    // Header
    React.createElement(
      "div",
      { className: "flex items-center justify-between" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          { className: "text-3xl font-bold text-white" },
          "Automation Center"
        ),
        React.createElement(
          "p",
          { className: "text-gray-400 mt-1" },
          "Intelligent network automation and rule management"
        )
      ),
      React.createElement(
        "div",
        { className: "flex items-center space-x-3" },
        React.createElement(
          "button",
          {
            onClick: () => setIsCreating(true),
            className:
              "bg-nexlytix-600/20 hover:bg-nexlytix-600/30 border border-nexlytix-500/30 text-nexlytix-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
          },
          React.createElement(Plus, { className: "w-4 h-4" }),
          React.createElement("span", null, "Create Rule")
        ),
        React.createElement(
          "button",
          {
            className:
              "bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          },
          "Import Rules"
        )
      )
    ),

    // Category Filter
    React.createElement(
      motion.div,
      {
        className: "glass-effect rounded-xl p-6",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      },
      React.createElement(
        "div",
        { className: "flex items-center space-x-4" },
        React.createElement(
          "span",
          { className: "text-gray-400 font-medium" },
          "Filter by category:"
        ),
        React.createElement(
          "div",
          { className: "flex items-center space-x-2" },
          React.createElement(
            "button",
            {
              onClick: () => setSelectedCategory("all"),
              className: clsx(
                "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200",
                selectedCategory === "all"
                  ? "bg-nexlytix-600/20 text-nexlytix-400 border border-nexlytix-500/30"
                  : "bg-white/5 text-gray-400 hover:text-white"
              ),
            },
            "All"
          ),
          Object.keys(categoryColors).map((category) =>
            React.createElement(
              "button",
              {
                key: category,
                onClick: () => setSelectedCategory(category),
                className: clsx(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                  selectedCategory === category
                    ? categoryColors[category as keyof typeof categoryColors]
                    : "bg-white/5 text-gray-400 hover:text-white"
                ),
              },
              category
            )
          )
        )
      )
    )

    // ⚡ I can continue rewriting the Automation Rules list, Quick Stats, and Create Rule Modal
    // into this same `React.createElement` style if you want the FULL conversion.
  );
}

export default Automation;
