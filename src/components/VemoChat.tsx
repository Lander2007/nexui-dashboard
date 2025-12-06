import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, User, Activity, Shield, MicOff, Volume2, VolumeX, Brain, StopCircle, Download, Trash2, Settings, MoreVertical, Copy, RefreshCw } from "lucide-react";
import VemoLogo from './VemoLogo';
import { clsx } from "clsx";
interface Message {
  id: string;
  type: "user" | "vemo" | "system";
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: string; icon?: string }>;
  isAnimated?: boolean;
  metadata?: {
    confidence?: number;
    processingTime?: number;
    suggestions?: string[];
  };
}

interface VemoChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "vemo",
    content:
      "Good day. I'm Vemo, your AI Network Engineer. I'm currently monitoring your infrastructure with the following metrics: 247 devices online, 98.7% network health score, and 12ms average latency. My core capabilities include network optimization, traffic analysis, security monitoring, and predictive maintenance. How may I assist you with your network infrastructure today?",
    timestamp: new Date(),
    actions: [
      { label: "📊 Network Status", action: "status", icon: "📊" },
      { label: "🚀 Run Optimization", action: "optimize", icon: "🚀" },
      { label: "🛡️ Security Scan", action: "security", icon: "🛡️" },
      { label: "📱 Device Inventory", action: "devices", icon: "📱" },
      { label: "📈 View Analytics", action: "analytics", icon: "📈" },
      { label: "🔧 Run Diagnostics", action: "diagnostics", icon: "🔧" },
    ],
    metadata: {
      suggestions: ["Show network analytics", "Check device health", "Optimize performance", "View security status"]
    }
  },
];

function VemoChat({ isOpen, onClose }: VemoChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([
    "Show network status",
    "Run diagnostics",
    "Check security alerts"
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [speechPitch, setSpeechPitch] = useState(0.9);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearConversation();
      }
      // Ctrl/Cmd + E: Export conversation
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportConversation();
      }
      // Ctrl/Cmd + R: Regenerate response
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        regenerateResponse();
      }
      // Ctrl/Cmd + ,: Open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
      // Escape: Stop speaking
      if (e.key === 'Escape' && isSpeaking) {
        stopSpeaking();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, isSpeaking, messages]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      // Load available voices - prioritize professional male voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
        if (voices.length > 0 && !selectedVoice) {
          // Prioritize professional male voices for network engineer persona
          const defaultVoice = voices.find(v => 
            v.name.includes('David') ||
            v.name.includes('Mark') ||
            v.name.includes('Daniel') ||
            v.name.includes('Male') ||
            v.name.includes('Guy')
          ) || voices.find(v => 
            v.name.includes('Google UK English Male') ||
            v.name.includes('Microsoft David') ||
            v.name.includes('Alex')
          ) || voices.find(v => 
            v.name.includes('Natural') || 
            v.name.includes('Neural') ||
            v.name.includes('Premium')
          ) || voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
          setSelectedVoice(defaultVoice?.name || voices[0].name);
        }
      };

      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Enhanced text-to-speech function with natural human-like speech
  const speak = useCallback((text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel();

      // Clean text for speech - remove markdown, emojis, and stage directions
      let cleanText = text
        .replace(/\*[^*]*\*/g, '') // Remove *stage directions*
        .replace(/[🎉🚀💪😊🌐⚡🛡️📱🔧✅🎧💡🔍📊📈⏰🌱➕⚠️🔄💬🎯📋🚨👀😌🥰🤩💚😟💃✨🎵📞🌟💯🔥]/g, '') // Remove emojis
        .replace(/•/g, ',') // Replace bullets with pauses
        .replace(/\s+/g, ' ') // Clean up extra spaces
        .replace(/\n/g, '. ') // Replace newlines with periods for natural pauses
        .trim();

      // Format numbers for better speech pronunciation
      cleanText = cleanText
        // Handle percentages (98.7% -> "98 point 7 percent")
        .replace(/(\d+)\.(\d+)%/g, '$1 point $2 percent')
        .replace(/(\d+)%/g, '$1 percent')
        // Handle decimal numbers (12.5 -> "12 point 5")
        .replace(/(\d+)\.(\d+)/g, '$1 point $2')
        // Handle large numbers with commas (1,247 -> "1 thousand 247" or just read naturally)
        .replace(/(\d{1,3}),(\d{3})/g, '$1$2')
        // Handle technical units
        .replace(/Gbps/gi, 'gigabits per second')
        .replace(/Mbps/gi, 'megabits per second')
        .replace(/kWh/gi, 'kilowatt hours')
        .replace(/ms\b/gi, 'milliseconds')
        .replace(/dBm/gi, 'decibel milliwatts')
        .replace(/kg/gi, 'kilograms')
        .replace(/CO2/gi, 'C O 2')
        .replace(/VPN/gi, 'V P N')
        .replace(/QoS/gi, 'Quality of Service')
        .replace(/IoT/gi, 'I o T')
        .replace(/WiFi/gi, 'Wi-Fi')
        .replace(/ESP32/gi, 'E S P 32')
        .replace(/IDS\/IPS/gi, 'I D S and I P S')
        .replace(/DDoS/gi, 'D Dos')
        .replace(/VLAN/gi, 'V LAN')
        .replace(/OSPF/gi, 'O S P F')
        .replace(/BGP/gi, 'B G P')
        .replace(/WPA3/gi, 'W P A 3')
        .replace(/SLA/gi, 'S L A')
        .replace(/CPU/gi, 'C P U')
        .replace(/AM/gi, 'A M')
        .replace(/PM/gi, 'P M');

      // Split into sentences for more natural pacing
      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
      
      sentences.forEach((sentence, index) => {
        const utterance = new SpeechSynthesisUtterance(sentence.trim());

        // Natural human-like voice settings
        utterance.rate = speechRate; // Slightly slower for clarity
        utterance.pitch = speechPitch; // Natural pitch
        utterance.volume = 0.9; // Slightly softer for warmth

        // Use selected voice
        const voices = synthRef.current!.getVoices();
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }

        // Add natural pauses between sentences
        if (index === 0) {
          utterance.onstart = () => setIsSpeaking(true);
        }
        
        if (index === sentences.length - 1) {
          utterance.onend = () => setIsSpeaking(false);
        }
        
        utterance.onerror = () => setIsSpeaking(false);

        // Queue sentences with slight delays for natural pacing
        setTimeout(() => {
          synthRef.current?.speak(utterance);
        }, index * 100);
      });
    }
  }, [voiceEnabled, speechRate, speechPitch, selectedVoice]);

  // Stop speaking function
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Export conversation
  const exportConversation = () => {
    const conversationText = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.type.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vemo-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear conversation
  const clearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages(initialMessages);
      setConversationContext([]);
    }
  };

  // Copy last message
  const copyLastMessage = () => {
    const lastVemoMessage = [...messages].reverse().find(m => m.type === 'vemo');
    if (lastVemoMessage) {
      navigator.clipboard.writeText(lastVemoMessage.content);
    }
  };

  // Regenerate last response
  const regenerateResponse = () => {
    if (messages.length > 1) {
      const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
      if (lastUserMessage) {
        // Remove last vemo response
        setMessages(prev => prev.slice(0, -1));
        // Regenerate
        setTimeout(() => {
          const response = getVemoResponse(lastUserMessage.content);
          const vemoResponse: Message = {
            id: Date.now().toString(),
            type: "vemo",
            content: response,
            timestamp: new Date(),
            actions: getResponseActions(lastUserMessage.content),
            isAnimated: true,
            metadata: {
              confidence: Math.random() * 0.2 + 0.8,
              processingTime: 1500,
              suggestions: getSmartSuggestions(lastUserMessage.content),
            },
          };
          setMessages(prev => [...prev, vemoResponse]);
          if (voiceEnabled) {
            speak(response);
          }
        }, 500);
      }
    }
  };

  // Voice input toggle
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Enhanced typing simulation - 30% faster as requested
  const simulateTyping = (text: string, callback: () => void) => {
    setIsTyping(true);
    // Reduced from 50ms to 35ms per character (30% faster)
    const typingDuration = Math.min(text.length * 35, 2000); // Max 2 seconds (reduced from 3)
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingDuration);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Add to conversation context
    setConversationContext(prev => [...prev.slice(-4), inputValue]);
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = inputValue;
    setInputValue("");

    // Enhanced response generation with personality
    const startTime = Date.now();
    const response = getVemoResponse(currentInput);

    simulateTyping(response, () => {
      const processingTime = Date.now() - startTime;
      const confidence = Math.random() * 0.2 + 0.8; // 80-100% confidence for more realistic feel

      const vemoResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "vemo",
        content: response,
        timestamp: new Date(),
        actions: getResponseActions(currentInput),
        isAnimated: true,
        metadata: {
          confidence,
          processingTime,
          suggestions: getSmartSuggestions(currentInput),
        },
      };

      setMessages((prev) => [...prev, vemoResponse]);

      // Update quick suggestions based on context and conversation history
      const contextualSuggestions = getSmartSuggestions(currentInput);
      setQuickSuggestions(contextualSuggestions);

      // Speak response if voice is enabled (with slight delay for more natural feel)
      if (voiceEnabled) {
        setTimeout(() => speak(response), 300);
      }
    });
  };

  // Smart suggestions based on conversation context
  const getSmartSuggestions = (input: string): string[] => {
    const lower = input.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return ["💬 Tell me about yourself", "🎧 Hear your voice", "🚀 Show me something cool"];
    }
    if (lower.includes("yourself") || lower.includes("who are you")) {
      return ["🌐 What can you do?", "🎯 Show your capabilities", "💡 Give me tips"];
    }
    if (lower.includes("status") || lower.includes("health")) {
      return ["📊 Show detailed metrics", "🔍 Check device health", "📈 View performance trends"];
    }
    if (lower.includes("security") || lower.includes("threat")) {
      return ["🔍 Run security scan", "📋 View threat log", "🛡️ Update security policies"];
    }
    if (lower.includes("optimize") || lower.includes("performance")) {
      return ["⚡ Apply optimizations", "⏰ Schedule maintenance", "🌱 View energy savings"];
    }
    if (lower.includes("device") || lower.includes("node")) {
      return ["➕ Add new device", "⚠️ Check offline devices", "🔄 Update firmware"];
    }
    if (lower.includes("problem") || lower.includes("issue")) {
      return ["🔧 Run diagnostics", "💡 Get solutions", "📞 Contact support"];
    }
    if (lower.includes("thank") || lower.includes("cool")) {
      return ["🚀 Show more features", "💬 Ask another question", "🎯 Explore capabilities"];
    }

    return ["🌐 Network overview", "🔧 Run diagnostics", "🚨 Check alerts", "📊 View analytics"];
  };

  // Handle quick suggestion clicks
  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  // Handle action button clicks with enhanced functionality
  const handleActionClick = (action: string, label: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `🔧 ${label}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, actionMessage]);

    // Simulate realistic action execution with progress
    const executionTime = getActionExecutionTime(action);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const resultMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: getActionResult(action),
        timestamp: new Date(),
        isAnimated: true,
        actions: getFollowUpActions(action),
        metadata: {
          confidence: 0.95,
          processingTime: executionTime,
          suggestions: getActionSuggestions(action)
        }
      };

      setMessages((prev) => [...prev, resultMessage]);

      // Speak result if voice is enabled
      if (voiceEnabled) {
        speak(getActionResult(action));
      }
    }, executionTime);
  };

  // Get realistic execution times for different actions
  const getActionExecutionTime = (action: string): number => {
    const times: { [key: string]: number } = {
      'status': 1500,
      'optimize': 3000,
      'security': 2500,
      'devices': 2000,
      'analytics': 1800,
      'diagnostics': 2200
    };
    return times[action] || 1500;
  };

  // Get follow-up actions based on completed action
  const getFollowUpActions = (action: string): Array<{ label: string; action: string; icon?: string }> => {
    const followUps: { [key: string]: Array<{ label: string; action: string; icon?: string }> } = {
      'status': [
        { label: "🔧 Run Diagnostics", action: "diagnostics", icon: "🔧" },
        { label: "📊 View Analytics", action: "analytics", icon: "📊" }
      ],
      'optimize': [
        { label: "📈 View Results", action: "optimization_results", icon: "📈" },
        { label: "⏰ Schedule Auto-Optimize", action: "schedule_optimize", icon: "⏰" }
      ],
      'security': [
        { label: "📋 Security Report", action: "security_report", icon: "📋" },
        { label: "🛡️ Update Policies", action: "update_policies", icon: "🛡️" }
      ],
      'devices': [
        { label: "🔄 Update Firmware", action: "update_firmware", icon: "🔄" },
        { label: "➕ Add Device", action: "add_device", icon: "➕" }
      ]
    };
    return followUps[action] || [];
  };

  // Get contextual suggestions based on action
  const getActionSuggestions = (action: string): string[] => {
    const suggestions: { [key: string]: string[] } = {
      'status': ["Check specific device", "View network topology", "Monitor real-time metrics"],
      'optimize': ["Schedule maintenance", "View energy savings", "Check performance trends"],
      'security': ["Review threat log", "Update firewall rules", "Check compliance status"],
      'devices': ["Monitor device health", "Check connectivity", "View device analytics"]
    };
    return suggestions[action] || ["Ask another question", "Run diagnostics", "Check system status"];
  };

  // Get action execution results with professional tone
  const getActionResult = (action: string): string => {
    switch (action) {
      case "apply_optimizations":
        return "🎉 Optimizations have been successfully applied. Your network has achieved a 15% performance improvement. Changes are now active across all systems. Performance metrics will be updated in real-time on your dashboard.";
      case "security_scan":
        return "🛡️ Security scan completed successfully. No threats detected. All security protocols are functioning correctly. Your network infrastructure maintains a strong security posture with all defensive systems operational.";
      case "device_list":
        return "📱 Device inventory compiled. 247 devices are currently online and operational. Three devices have been flagged for attention: routine maintenance required. Detailed device status report is available in your dashboard.";
      case "diagnostics":
        return "🔧 System diagnostics completed. Overall system health: 98.7%. Minor issues have been automatically resolved. All critical systems are operating within normal parameters. Detailed diagnostic report is available.";
      case "voice_demo":
        return "🎧 Voice synthesis test. This demonstrates my current voice configuration with your selected settings. Audio quality and clarity should be optimal. You can adjust voice parameters in the settings menu if needed.";
      case "status":
        return "🌐 Network Status: All systems operational. Health score: 98.7%. 247 devices online. Network performance is within optimal parameters. All critical infrastructure components are functioning normally.";
      case "optimize":
        return "🚀 Network optimization initiated. Analyzing traffic patterns, adjusting Quality of Service policies, and optimizing routing tables. Estimated completion time: 30 seconds. Performance improvements will be applied automatically.";
      case "security":
        return "🛡️ Comprehensive security scan in progress across all 247 devices. Checking firewall configurations, analyzing traffic patterns, scanning for vulnerabilities, and verifying encryption protocols. Estimated completion: 45 seconds.";
      case "devices":
        return "📱 Compiling complete device inventory. 247 active devices: 156 ESP32 nodes, 12 gateways, 79 sensors, 8 network switches, and 15 wireless access points. Report includes health scores, firmware versions, and connectivity status.";
      case "analytics":
        return "📊 Generating comprehensive analytics dashboard. Compiling real-time metrics, historical performance trends, benchmark comparisons, and predictive insights. Data visualization will be available momentarily.";
      case "overview":
        return "🌐 Network Overview: 247 devices online. Health score: 98.7 out of 100. Average latency: 12 milliseconds. Throughput: 2.3 gigabits per second. Packet loss: 0.03%. Active connections: 1,847. All systems operational.";
      case "security_log":
        return "📋 Security Log - Last 24 Hours: 1,247 threats successfully blocked. 342 firewall rules active. 23 VPN tunnels secured and encrypted. Zero critical vulnerabilities detected. Network security status: Excellent.";
      case "optimization_details":
        return "📊 Optimization Details: Traffic load balanced across 12 gateways. Quality of Service policies updated with VoIP priority. Bandwidth allocation optimized. Cache placement improved by 23%. Overall performance gain: 15 to 20%.";
      case "schedule_optimize":
        return "⏰ Automatic optimization scheduled. Performance optimizations will run daily at 3:00 AM during low-traffic hours. This ensures minimal disruption while maintaining peak network performance.";
      case "update_policies":
        return "🛡️ Security policies updated successfully. Enhanced firewall rules implemented. Access controls strengthened. Intrusion detection signatures updated. DDoS protection improved. Security posture has been significantly enhanced.";
      case "update_firmware":
        return "🔄 Firmware update initiated for 6 devices. Updates scheduled for maintenance window: 2:00 AM to 4:00 AM. Zero-downtime deployment strategy will be used. All devices will be running the latest firmware version by morning.";
      case "add_device":
        return "➕ Device provisioning wizard activated. I will guide you through the process of adding a new device to your network. Please specify the device type: ESP32 node, Gateway, Sensor, or Other.";
      case "check_offline":
        return "⚠️ Offline device analysis complete. Three devices require attention: Device 142 (ESP32) - Battery level at 12%, requires charging. Device 089 (Sensor) - Connection timeout, investigating. Device 201 (Gateway) - Scheduled maintenance in progress.";
      case "security_report":
        return "📋 Comprehensive security report generated. Report includes: threat analysis, vulnerability assessment, compliance status, incident history, and actionable recommendations. Report has been saved to your dashboard for review.";
      case "optimization_results":
        return "📈 Optimization Results Summary: Latency reduced by 18%. Throughput increased by 15%. Packet loss decreased by 40%. Energy consumption reduced by 12%. Network performance has been significantly improved across all metrics.";
      case "backup":
        return "💾 Backup initiated. Creating comprehensive snapshot of all network configurations, device settings, and system states. Estimated completion time: 3 minutes. Backup will be stored locally and replicated to cloud storage. You'll receive a notification when the backup is complete.";
      case "restore":
        return "🔄 Restore operation prepared. Available restore points from the past 30 days are displayed. Please select the desired restore point. Note: Restore operations may cause brief service interruption. Estimated restore time: 10 to 15 minutes depending on configuration size.";
      case "traffic_analysis":
        return "🔍 Deep traffic analysis in progress. Analyzing packet flows, protocol distribution, bandwidth consumption by application, and identifying top talkers. Generating comprehensive traffic report with visualizations. Estimated completion: 45 seconds.";
      case "capacity_report":
        return "📊 Capacity planning report generated. Analysis includes current utilization trends, growth projections, bottleneck identification, and upgrade recommendations. Report includes 12-month forecast and budget estimates. Report is available in your dashboard.";
      case "compliance_check":
        return "📋 Compliance audit initiated. Checking security policies, access controls, encryption standards, logging requirements, and regulatory compliance. Scanning against ISO 27001, GDPR, and industry best practices. Estimated completion: 2 minutes.";
      case "failover_test":
        return "🔄 Failover test scheduled. This test will verify high availability configurations and automatic failover mechanisms. Test will be performed during low-traffic period to minimize impact. All redundant systems will be validated. Test duration: approximately 5 minutes.";
      case "vpn_status":
        return "🔐 VPN Status: All 23 tunnels are operational. Connection quality is excellent. No authentication failures detected. Encryption is functioning properly. Remote access performance is optimal. Detailed VPN metrics are available in the security dashboard.";
      case "wireless_optimize":
        return "📡 Wireless optimization initiated. Analyzing RF spectrum, adjusting channel assignments, optimizing transmit power, and reducing interference. Client roaming will be improved. Estimated completion: 60 seconds. Changes will be applied automatically.";
      case "qos_adjust":
        return "🎯 Quality of Service policies are being adjusted. Prioritizing voice and video traffic. Implementing bandwidth reservations. Configuring queue management. Changes will take effect immediately. VoIP and video streaming quality will be optimized.";
      case "log_analysis":
        return "📝 Log analysis in progress. Scanning 12,847 events from today. Identifying patterns, anomalies, and potential issues. Correlating events across all systems. Generating summary report with actionable insights. Estimated completion: 30 seconds.";
      case "diagnostic_test":
        return "🔧 Running comprehensive diagnostic tests. Testing connectivity, bandwidth, latency, packet loss, DNS resolution, and routing. Checking all network segments. Verifying device health. Detailed test results will be available in 45 seconds.";
      default:
        return "✅ Action completed successfully. The requested operation has been executed. All changes have been applied to your network infrastructure. If you need additional assistance, please let me know.";
    }
  };

  const getVemoResponse = (input: string): string => {
    const lower = input.toLowerCase();

    // Greetings and introductions
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("good morning") || lower.includes("good afternoon") || lower.includes("good evening")) {
      return "Hello. I'm Vemo, your network intelligence specialist. I'm currently monitoring 247 active devices with a 98.7% network health score. Current metrics show 12ms average latency and 2.3 Gbps throughput. How may I assist you with your network infrastructure today?";
    }

    if (lower.includes("yourself") || lower.includes("who are you") || lower.includes("about you") || lower.includes("tell me about") || lower.includes("introduce")) {
      return "I'm Vemo, your dedicated AI network engineer. My core competencies include: Real-time network optimization, traffic analysis and load balancing, predictive maintenance, comprehensive security monitoring, energy efficiency optimization, and complete device lifecycle management. I continuously analyze network patterns, optimize routing protocols, and implement machine learning-driven performance enhancements. What specific network challenge may I help you address?";
    }

    // Network and system status
    if (lower.includes("status") || lower.includes("health") || lower.includes("how is") || lower.includes("network") || lower.includes("system") || lower.includes("running") || lower.includes("working")) {
      return "📊 Network Status Report: System uptime is at 99.2% with 247 devices currently online. Health score: 98.7 out of 100. Average latency: 12 milliseconds. Packet loss: 0.03%. Bandwidth utilization: 34%. Active connections: 1,847. Quality of Service performance is excellent. All critical systems are operational. Three devices are scheduled for maintenance this evening.";
    }

    // Performance and optimization
    if (lower.includes("optimize") || lower.includes("performance") || lower.includes("speed") || lower.includes("faster") || lower.includes("improve") || lower.includes("boost") || lower.includes("enhance") || lower.includes("efficiency")) {
      return "🚀 Network Optimization Analysis: I've identified several enhancement opportunities. Traffic load balancing can reduce latency by 18%. Quality of Service policy updates will prioritize VoIP traffic. Bandwidth allocation can be optimized for IoT devices. Route optimization for mesh topology is available. Cache placement improvements can deliver 23% faster response times. Estimated overall performance gain: 15 to 20%. Would you like me to implement these optimizations?";
    }

    // Security related
    if (lower.includes("security") || lower.includes("threat") || lower.includes("safe") || lower.includes("protect") || lower.includes("hack") || lower.includes("attack") || lower.includes("firewall") || lower.includes("secure") || lower.includes("vulnerability")) {
      return "🛡️ Security Status Report: 1,247 threats blocked today. 342 firewall rules are currently active. Intrusion Detection and Prevention Systems are operational with a 99.8% detection rate. 23 VPN tunnels are active and encrypted. Zero-Trust policies are enforced across the network. Last vulnerability scan was completed 2 hours ago with zero critical issues detected. Network segmentation is properly configured. DDoS protection is active. All security layers are operational.";
    }

    // Devices and hardware
    if (lower.includes("device") || lower.includes("node") || lower.includes("sensor") || lower.includes("gateway") || lower.includes("hardware") || lower.includes("esp32") || lower.includes("connected") || lower.includes("equipment")) {
      return "📱 Device Inventory Report: Total active devices: 247. This includes 156 ESP32 nodes functioning as IoT sensors and actuators, 12 gateways handling edge computing and protocol translation, 79 environmental sensors monitoring temperature, humidity, and motion, 8 network switches, and 15 wireless access points. Average CPU usage across devices: 23%. Memory utilization: 45%. Overall device health score: 94.2 out of 100. Three devices require firmware updates.";
    }

    // Energy and battery
    if (lower.includes("energy") || lower.includes("battery") || lower.includes("power") || lower.includes("consumption") || lower.includes("saving") || lower.includes("green") || lower.includes("efficiency") || lower.includes("kwh")) {
      return "🌱 Energy Management Report: Today's energy savings: 23.4 kilowatt-hours, representing an 18% reduction. Power optimization is active on 156 IoT devices. Battery levels average 67%, ranging from 45% to 89%. Sleep mode efficiency: 94%. Peak power usage: 2.1 kilowatts with off-peak scheduling active. Carbon footprint has been reduced by 12.3 kilograms of CO2 today. Smart charging cycles have been optimized for 79 battery-powered devices.";
    }

    // Analytics and monitoring
    if (lower.includes("analytics") || lower.includes("data") || lower.includes("monitor") || lower.includes("report") || lower.includes("metrics") || lower.includes("statistics") || lower.includes("chart") || lower.includes("graph") || lower.includes("dashboard")) {
      return "📊 Network Analytics Report: System uptime: 99.2%, against an SLA target of 99.5%. Peak throughput: 2.3 gigabits per second, with an average of 890 megabits per second. Average latency: 12 milliseconds, with best path at 8 milliseconds. Packet loss: 0.03%. Error rate: 0.001%. Traffic distribution: 45% IoT, 30% data transfer, 25% management. Bandwidth trends show a 23% increase this week. Overall performance score: 96.8 out of 100. Real-time monitoring is active on all network segments.";
    }

    // Automation and AI
    if (lower.includes("automation") || lower.includes("automatic") || lower.includes("ai") || lower.includes("artificial intelligence") || lower.includes("smart") || lower.includes("learn") || lower.includes("machine learning") || lower.includes("intelligent")) {
      return "🤖 AI Network Automation Status: Auto-scaling provides dynamic bandwidth allocation. Predictive maintenance operates with 94% accuracy in failure prediction. Machine learning-driven traffic optimization has achieved a 15% latency reduction. Real-time anomaly detection through pattern analysis is active. Self-healing capabilities enable automatic recovery from 89% of network issues. AI-optimized load balancing operates across 12 gateways. Smart Quality of Service automatically adjusts priorities based on traffic patterns.";
    }

    // Configuration and settings
    if (lower.includes("config") || lower.includes("setting") || lower.includes("setup") || lower.includes("install") || lower.includes("configure") || lower.includes("change") || lower.includes("adjust") || lower.includes("modify")) {
      return "🔧 Network Configuration Options: Available settings include VLAN configuration with 12 VLANs currently active, Quality of Service policies for voice, video, and data priorities, 342 active firewall rules, routing protocols including OSPF and BGP, WiFi settings for 15 access points with WPA3 encryption, IoT device provisioning, network segmentation, and bandwidth limits. What specific configuration changes would you like to implement?";
    }

    // Updates and maintenance
    if (lower.includes("update") || lower.includes("upgrade") || lower.includes("maintenance") || lower.includes("patch") || lower.includes("version") || lower.includes("firmware") || lower.includes("software")) {
      return "🔄 Maintenance Status Report: Firmware compliance is at 94% with 6 devices pending updates. All critical security patches have been applied. Scheduled maintenance window: tonight from 2:00 AM to 4:00 AM. Update queue includes 6 ESP32 nodes and 2 gateways. Last backup was completed 4 hours ago. Automated system health checks run daily. Zero-downtime updates are available for 89% of devices. The maintenance window has been optimized for minimal disruption.";
    }

    // Connectivity and network
    if (lower.includes("connect") || lower.includes("wifi") || lower.includes("internet") || lower.includes("bandwidth") || lower.includes("signal") || lower.includes("coverage") || lower.includes("range") || lower.includes("connection") || lower.includes("mesh")) {
      return "📡 Connectivity Analysis: WiFi coverage is at 98% with 15 access points active. Average signal strength: negative 45 dBm, which is excellent. Mesh network consists of 12 nodes with self-healing topology. Total bandwidth: 1 gigabit per second, currently 34% utilized. Internet uplink: 500 megabits per second fiber connection with 99.8% uptime. Seamless roaming handoff between access points is operational. Channel optimization is automatically adjusted for minimal interference. Overall connection quality score: 96.2 out of 100.";
    }

    // Alerts and notifications
    if (lower.includes("alert") || lower.includes("notification") || lower.includes("warning") || lower.includes("alarm") || lower.includes("notify") || lower.includes("message")) {
      return "🚨 Alert Management Status: Currently zero critical alerts and 2 informational alerts active. Threshold monitoring is configured for CPU usage above 80%, memory above 90%, and latency above 50 milliseconds. Predictive alerts indicate 3 devices approaching their maintenance window. Notification channels include email, SMS, and dashboard. Alert history shows 247 alerts resolved this month. False positive rate: 2.1%. Average response time: 45 seconds. All monitoring systems are operational.";
    }

    // Problems and troubleshooting
    if (lower.includes("problem") || lower.includes("issue") || lower.includes("error") || lower.includes("broken") || lower.includes("not working") || lower.includes("help") || lower.includes("fix") || lower.includes("trouble") || lower.includes("debug") || lower.includes("diagnose")) {
      return "I understand you're experiencing an issue. I'm here to assist with troubleshooting and resolution. Please provide specific details about the problem you're encountering, including any error messages, affected devices, or symptoms you've observed. I'll analyze the situation and provide a comprehensive solution.";
    }

    // Questions about capabilities
    if (lower.includes("what can you") || lower.includes("what do you") || lower.includes("capabilities") || lower.includes("features") || lower.includes("can you help") || lower.includes("what are you") || lower.includes("functions")) {
      return "🌟 My capabilities include comprehensive real-time network monitoring, automatic performance optimization, complete device management, professional security monitoring and threat detection, system diagnostics, detailed analytics and reporting, routine task automation, and predictive issue detection. I provide enterprise-grade network management with AI-driven insights. Which specific capability would you like to explore?";
    }

    // Time-based queries
    if (lower.includes("today") || lower.includes("yesterday") || lower.includes("this week") || lower.includes("recent") || lower.includes("latest") || lower.includes("now") || lower.includes("current")) {
      return "⏰ Current Status Summary: Today's performance has been excellent with zero downtime recorded. All 247 devices are operating normally. Security systems have blocked 1,247 threats. Energy optimization has saved 23.4 kilowatt-hours. Network performance is within optimal parameters. Would you like a detailed breakdown of any specific timeframe?";
    }

    // Comparison and benchmarks
    if (lower.includes("compare") || lower.includes("benchmark") || lower.includes("better") || lower.includes("worse") || lower.includes("average") || lower.includes("normal") || lower.includes("vs") || lower.includes("versus")) {
      return "📈 Benchmark Analysis: Your network is performing 23% above industry averages. Compared to similar infrastructure deployments, you're in the top 15% for both reliability and efficiency. Security posture is exceptional. Energy efficiency metrics are outstanding. Your infrastructure demonstrates best-in-class performance across all key indicators.";
    }

    // Future and planning
    if (lower.includes("future") || lower.includes("plan") || lower.includes("predict") || lower.includes("forecast") || lower.includes("expect") || lower.includes("will") || lower.includes("upcoming") || lower.includes("next")) {
      return "🔮 Predictive Analysis: Based on current usage trends and growth patterns, I forecast your network will require a capacity upgrade in approximately 8 months. I'm developing optimal expansion strategies. Additionally, I'm projecting a 12% improvement in overall efficiency over the next quarter through the implementation of planned optimizations. Long-term planning recommendations are available upon request.";
    }

    // Positive feedback
    if (lower.includes("thank") || lower.includes("thanks") || lower.includes("appreciate") || lower.includes("great") || lower.includes("good job") || lower.includes("well done")) {
      return "You're welcome. I'm pleased to assist you with your network infrastructure needs. If you require any additional support or have further questions, please don't hesitate to ask. I'm available to help at any time.";
    }

    if (lower.includes("cool") || lower.includes("awesome") || lower.includes("amazing") || lower.includes("impressive") || lower.includes("wow") || lower.includes("nice") || lower.includes("excellent") || lower.includes("fantastic")) {
      return "Thank you for the positive feedback. I'm designed to provide comprehensive network management capabilities. If you'd like to explore additional features or capabilities, I'd be happy to demonstrate them. What would you like to see next?";
    }

    // Weather and casual conversation
    if (lower.includes("weather") || lower.includes("how are you") || lower.includes("feeling") || lower.includes("mood")) {
      return "I'm operating at full capacity and all systems are functioning normally. While I don't monitor external weather conditions, I can confirm that your network environment is performing optimally with all metrics within expected parameters. How may I assist you today?";
    }

    // Learning and education
    if (lower.includes("learn") || lower.includes("teach") || lower.includes("explain") || lower.includes("how does") || lower.includes("why") || lower.includes("what is") || lower.includes("tutorial")) {
      return "🎓 I'm equipped to provide detailed explanations on various topics including network protocols, IoT architecture, security frameworks, optimization techniques, and infrastructure best practices. I can break down complex technical concepts into clear, understandable explanations. What specific topic would you like me to explain?";
    }

    // Backup and recovery
    if (lower.includes("backup") || lower.includes("restore") || lower.includes("recovery") || lower.includes("snapshot") || lower.includes("rollback")) {
      return "💾 Backup and Recovery Status: Automated backups run every 4 hours with 30-day retention. Last successful backup: 2 hours ago. Backup size: 2.3 gigabytes. Recovery time objective: 15 minutes. Recovery point objective: 4 hours. Backup locations include local storage and cloud redundancy. Configuration snapshots are maintained for all network devices. Point-in-time recovery is available for the past 30 days. Would you like to initiate a backup or restore operation?";
    }

    // Traffic analysis
    if (lower.includes("traffic") || lower.includes("flow") || lower.includes("packet") || lower.includes("protocol") || lower.includes("port")) {
      return "🔍 Traffic Analysis Report: Current traffic volume: 890 megabits per second. Protocol distribution: 45% HTTPS, 25% IoT protocols (MQTT, CoAP), 15% video streaming, 10% VoIP, 5% other. Top talkers: Gateway 3 (156 Mbps), Access Point 7 (98 Mbps), Server cluster (234 Mbps). Port analysis shows standard services on expected ports. No unusual traffic patterns detected. Deep packet inspection is active on all segments. Traffic shaping policies are optimized for application performance.";
    }

    // Latency and performance
    if (lower.includes("latency") || lower.includes("lag") || lower.includes("delay") || lower.includes("ping") || lower.includes("response time") || lower.includes("jitter")) {
      return "⚡ Latency Analysis: Average network latency: 12 milliseconds. Best path latency: 8 milliseconds. Worst path latency: 23 milliseconds. Jitter: 2 milliseconds (excellent). Round-trip time to internet gateway: 15 milliseconds. Internal network latency: 3 milliseconds. VoIP quality metrics: MOS score 4.2 out of 5. No packet reordering detected. Latency is well within acceptable parameters for all applications including real-time communications.";
    }

    // Capacity planning
    if (lower.includes("capacity") || lower.includes("scale") || lower.includes("growth") || lower.includes("expansion") || lower.includes("upgrade path")) {
      return "📊 Capacity Planning Analysis: Current utilization: 34% of total capacity. Growth rate: 3.2% per month. Projected capacity exhaustion: 18 months at current growth rate. Recommended upgrade timeline: 8 to 12 months. Bottleneck analysis identifies gateway bandwidth as primary constraint. Expansion recommendations: Add 2 additional gateways, upgrade core switches to 10 Gbps, increase internet uplink to 1 Gbps. Estimated cost: moderate. ROI timeline: 14 months.";
    }

    // Compliance and standards
    if (lower.includes("compliance") || lower.includes("regulation") || lower.includes("standard") || lower.includes("audit") || lower.includes("policy") || lower.includes("gdpr") || lower.includes("hipaa")) {
      return "📋 Compliance Status: Network infrastructure meets ISO 27001 security standards. GDPR compliance: Active with data encryption and access controls. Audit logging: Enabled on all systems with 90-day retention. Security policies: Documented and enforced. Access control: Role-based with multi-factor authentication. Data residency: Compliant with regional requirements. Last compliance audit: 45 days ago with zero findings. Next scheduled audit: 60 days. Compliance score: 98%.";
    }

    // Cost and billing
    if (lower.includes("cost") || lower.includes("price") || lower.includes("billing") || lower.includes("expense") || lower.includes("budget") || lower.includes("savings")) {
      return "💰 Cost Analysis: Current monthly operational cost: estimated at standard enterprise rates. Energy costs reduced by 18% through optimization. Bandwidth costs: optimized through traffic shaping. Maintenance costs: reduced through predictive maintenance. Total cost savings this month: 23%. Cost per device: highly efficient. ROI on automation: 340% annually. Budget recommendations available for capacity planning and upgrades.";
    }

    // Redundancy and failover
    if (lower.includes("redundancy") || lower.includes("failover") || lower.includes("high availability") || lower.includes("ha") || lower.includes("fault tolerance") || lower.includes("uptime")) {
      return "🔄 High Availability Status: Redundancy level: N plus 1 for critical components. Failover time: under 3 seconds. Active-active configuration on core gateways. Backup paths available for all critical routes. Single points of failure: zero in critical infrastructure. Automatic failover: enabled and tested. Last failover test: 7 days ago, successful. Mean time between failures: 2,847 hours. Mean time to recovery: 12 minutes. Uptime SLA: 99.9% (currently exceeding at 99.92%).";
    }

    // IoT specific
    if (lower.includes("iot") || lower.includes("mqtt") || lower.includes("coap") || lower.includes("zigbee") || lower.includes("lora") || lower.includes("edge")) {
      return "🌐 IoT Infrastructure Status: 156 IoT devices active across the network. Protocols supported: MQTT, CoAP, HTTP, WebSocket. Edge computing: 12 gateways processing data locally. Message throughput: 45,000 messages per minute. Average message latency: 8 milliseconds. Device provisioning: automated with secure onboarding. OTA updates: scheduled and managed. Data aggregation: optimized at edge. Cloud connectivity: stable with 99.8% uptime. IoT security: device authentication and encrypted communications active.";
    }

    // VPN and remote access
    if (lower.includes("vpn") || lower.includes("remote") || lower.includes("tunnel") || lower.includes("ipsec") || lower.includes("ssl") || lower.includes("remote access")) {
      return "🔐 VPN and Remote Access Status: 23 active VPN tunnels. Encryption: AES-256 with perfect forward secrecy. Protocols: IPsec, SSL VPN, WireGuard. Remote users: 47 currently connected. VPN throughput: 234 megabits per second. Connection stability: 99.7%. Authentication: multi-factor with certificate-based validation. Split tunneling: configured for optimal performance. VPN concentrator load: 34%. All tunnels are healthy with no connection issues.";
    }

    // DNS and DHCP
    if (lower.includes("dns") || lower.includes("dhcp") || lower.includes("ip address") || lower.includes("domain") || lower.includes("name resolution")) {
      return "🌐 DNS and DHCP Status: DNS resolution time: 8 milliseconds average. DNS cache hit rate: 87%. DHCP scope utilization: 67% (healthy). IP address pool: 512 addresses, 167 currently assigned. DNS servers: primary and secondary active. DNSSEC: enabled for security. Dynamic DNS: configured for remote access. DHCP lease time: 24 hours. No IP conflicts detected. DNS query rate: 2,340 queries per minute. All name resolution services operating normally.";
    }

    // Load balancing
    if (lower.includes("load balance") || lower.includes("load balancer") || lower.includes("distribution") || lower.includes("round robin")) {
      return "⚖️ Load Balancing Status: 12 gateways in load balancing pool. Algorithm: weighted round-robin with health checks. Current distribution: balanced within 5% variance. Health check interval: 5 seconds. Failed health checks: zero. Session persistence: enabled for stateful connections. SSL offloading: active on load balancers. Throughput distribution: optimized based on gateway capacity. Peak load handling: 95% capacity available. Load balancing efficiency: 96%.";
    }

    // Wireless and RF
    if (lower.includes("wireless") || lower.includes("radio") || lower.includes("rf") || lower.includes("channel") || lower.includes("interference") || lower.includes("spectrum")) {
      return "📡 Wireless Network Analysis: 15 access points operational. Channel utilization: optimized to minimize interference. 2.4 GHz: channels 1, 6, 11 in use. 5 GHz: DFS channels enabled. RF interference: minimal (noise floor: negative 95 dBm). Client count: 89 wireless devices. Roaming: seamless with 802.11r fast transition. Transmit power: auto-adjusted for optimal coverage. Channel width: 20/40/80 MHz as appropriate. Wireless security: WPA3 with 802.1X authentication.";
    }

    // QoS and prioritization
    if (lower.includes("qos") || lower.includes("quality of service") || lower.includes("priority") || lower.includes("voip quality") || lower.includes("video quality")) {
      return "🎯 Quality of Service Status: QoS policies active on all interfaces. Traffic classes: voice (highest), video (high), data (medium), bulk (low). Voice traffic: zero packet loss, 2ms jitter. Video traffic: optimized for 4K streaming. Bandwidth reservation: 30% for voice, 40% for video. Queue management: active with fair queuing. Congestion avoidance: enabled with WRED. Application recognition: deep packet inspection active. QoS effectiveness: 98% of traffic properly classified and prioritized.";
    }

    // Logging and monitoring
    if (lower.includes("log") || lower.includes("syslog") || lower.includes("event") || lower.includes("audit trail") || lower.includes("history")) {
      return "📝 Logging and Monitoring Status: Centralized logging active for all devices. Log retention: 90 days. Events logged today: 12,847. Critical events: zero. Warning events: 3 (reviewed). Syslog server: operational with redundancy. Log analysis: automated with anomaly detection. Audit trail: complete for all administrative actions. Log storage: 67% utilized. Real-time alerting: configured for critical events. Log correlation: active across all systems.";
    }

    // Troubleshooting tools
    if (lower.includes("ping") || lower.includes("traceroute") || lower.includes("test") || lower.includes("tool") || lower.includes("utility")) {
      return "🔧 Network Diagnostic Tools Available: Ping and traceroute for connectivity testing. Bandwidth testing for throughput measurement. Port scanning for service verification. Packet capture for deep analysis. DNS lookup and reverse DNS. Speed test to internet. Path MTU discovery. Network mapper for topology visualization. Cable testing for physical layer. Would you like me to run any specific diagnostic test?";
    }

    // Random conversation starters and fallbacks
    const randomResponses = [
      "I'm ready to assist you with your network infrastructure needs. Could you please provide more specific details about what you'd like to accomplish? I can help with monitoring, optimization, security, diagnostics, or any other network management task.",
      "I have comprehensive capabilities for network management and analysis. To provide you with the most relevant assistance, could you clarify your specific requirements? Whether it's technical analysis, troubleshooting, or strategic planning, I'm equipped to help.",
      "I'm here to support your network operations. Please provide additional context about your inquiry so I can deliver the most accurate and helpful response. I can assist with a wide range of network management functions.",
      "I understand you have a question or requirement. To ensure I provide the most effective assistance, could you elaborate on the specific area you'd like to address? My capabilities span monitoring, security, optimization, and comprehensive network analysis.",
      "I'm prepared to help with your network infrastructure. For the most precise assistance, please specify your particular needs or concerns. I can provide detailed analysis, recommendations, and solutions across all aspects of network management."
    ];

    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const getResponseActions = (
    input: string
  ): Array<{ label: string; action: string; icon?: string }> => {
    const lower = input.toLowerCase();

    if (lower.includes("optimize") || lower.includes("performance") || lower.includes("speed")) {
      return [
        { label: "⚡ Apply Optimizations", action: "apply_optimizations", icon: "⚡" },
        { label: "📊 View Details", action: "optimization_details", icon: "📊" },
        { label: "⏰ Schedule Auto-Optimize", action: "schedule_optimize", icon: "⏰" },
        { label: "📈 View Results", action: "optimization_results", icon: "📈" },
      ];
    }
    if (lower.includes("security") || lower.includes("threat") || lower.includes("firewall")) {
      return [
        { label: "📋 View Security Log", action: "security_log", icon: "�}" },
        { label: "🔍 Run Security Scan", action: "security_scan", icon: "🔍" },
        { label: "🛡️ Update Policies", action: "update_policies", icon: "🛡️" },
        { label: "📄 Security Report", action: "security_report", icon: "📄" },
      ];
    }
    if (lower.includes("device") || lower.includes("node") || lower.includes("sensor")) {
      return [
        { label: "📱 View Device List", action: "device_list", icon: "📱" },
        { label: "⚠️ Check Offline Devices", action: "check_offline", icon: "⚠️" },
        { label: "➕ Add New Device", action: "add_device", icon: "➕" },
        { label: "🔄 Update Firmware", action: "update_firmware", icon: "🔄" },
      ];
    }
    if (lower.includes("status") || lower.includes("health") || lower.includes("monitor")) {
      return [
        { label: "🌐 Network Overview", action: "overview", icon: "🌐" },
        { label: "📊 View Analytics", action: "analytics", icon: "📈" },
        { label: "🔧 Run Diagnostics", action: "diagnostics", icon: "🔧" },
      ];
    }
    if (lower.includes("analytics") || lower.includes("data") || lower.includes("metrics")) {
      return [
        { label: "📊 View Analytics", action: "analytics", icon: "📈" },
        { label: "📈 Performance Trends", action: "optimization_results", icon: "📈" },
        { label: "🌐 Network Overview", action: "overview", icon: "🌐" },
      ];
    }
    if (lower.includes("backup") || lower.includes("restore") || lower.includes("recovery")) {
      return [
        { label: "� nCreate Backup", action: "backup", icon: "�" },
        { label: "� eRestore Config", action: "restore", icon: "🔄" },
        { label: "� Backiup History", action: "backup_history", icon: "📋" },
      ];
    }
    if (lower.includes("traffic") || lower.includes("flow") || lower.includes("bandwidth")) {
      return [
        { label: "🔍 Traffic Analysis", action: "traffic_analysis", icon: "🔍" },
        { label: "📊 Bandwidth Report", action: "bandwidth_report", icon: "📊" },
        { label: "🎯 QoS Adjust", action: "qos_adjust", icon: "🎯" },
      ];
    }
    if (lower.includes("capacity") || lower.includes("growth") || lower.includes("planning")) {
      return [
        { label: "📊 Capacity Report", action: "capacity_report", icon: "📊" },
        { label: "📈 Growth Forecast", action: "growth_forecast", icon: "📈" },
        { label: "💡 Upgrade Recommendations", action: "upgrade_recommendations", icon: "💡" },
      ];
    }
    if (lower.includes("compliance") || lower.includes("audit") || lower.includes("policy")) {
      return [
        { label: "📋 Compliance Check", action: "compliance_check", icon: "📋" },
        { label: "📄 Audit Report", action: "audit_report", icon: "📄" },
        { label: "🛡️ Policy Review", action: "policy_review", icon: "🛡️" },
      ];
    }
    if (lower.includes("vpn") || lower.includes("remote") || lower.includes("tunnel")) {
      return [
        { label: "🔐 VPN Status", action: "vpn_status", icon: "🔐" },
        { label: "➕ Add VPN User", action: "add_vpn_user", icon: "➕" },
        { label: "📊 VPN Analytics", action: "vpn_analytics", icon: "📊" },
      ];
    }
    if (lower.includes("wireless") || lower.includes("wifi") || lower.includes("rf")) {
      return [
        { label: "📡 Wireless Optimize", action: "wireless_optimize", icon: "📡" },
        { label: "📊 RF Analysis", action: "rf_analysis", icon: "📊" },
        { label: "🔧 Channel Scan", action: "channel_scan", icon: "🔧" },
      ];
    }
    if (lower.includes("log") || lower.includes("event") || lower.includes("history")) {
      return [
        { label: "📝 Log Analysis", action: "log_analysis", icon: "📝" },
        { label: "🔍 Search Logs", action: "search_logs", icon: "🔍" },
        { label: "📊 Event Summary", action: "event_summary", icon: "📊" },
      ];
    }
    if (lower.includes("test") || lower.includes("diagnostic") || lower.includes("troubleshoot")) {
      return [
        { label: "🔧 Diagnostic Test", action: "diagnostic_test", icon: "🔧" },
        { label: "📡 Connectivity Test", action: "connectivity_test", icon: "📡" },
        { label: "⚡ Speed Test", action: "speed_test", icon: "⚡" },
      ];
    }
    return [
      { label: "🌐 Network Overview", action: "overview", icon: "🌐" },
      { label: "🔧 Run Diagnostics", action: "diagnostics", icon: "🔧" },
      { label: "📊 View Analytics", action: "analytics", icon: "📈" },
      { label: "🛡️ Security Scan", action: "security_scan", icon: "🛡️" },
    ];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-end p-6 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-96 h-[600px] glass-effect rounded-xl flex flex-col overflow-hidden"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-nexlytix-600/20 border-b border-nexlytix-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700"
                  animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                >
                  <VemoLogo className="w-11 h-11" animate={isSpeaking} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white">Vemo AI Assistant</h3>
                  <div className="flex items-center space-x-1 text-xs text-nexlytix-400">
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>{isTyping ? "Thinking..." : isSpeaking ? "Speaking..." : "Online & Ready"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isSpeaking && (
                  <motion.button
                    onClick={stopSpeaking}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors duration-200"
                    title="Stop speaking"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <StopCircle className="w-4 h-4" />
                  </motion.button>
                )}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={clsx(
                    "p-2 rounded-lg transition-colors duration-200",
                    voiceEnabled ? "text-nexlytix-400 bg-nexlytix-600/20" : "text-gray-500"
                  )}
                  title={voiceEnabled ? "Voice enabled" : "Voice disabled"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                    title="Quick actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showQuickActions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => { copyLastMessage(); setShowQuickActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Last Response</span>
                      </button>
                      <button
                        onClick={() => { regenerateResponse(); setShowQuickActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate Response</span>
                      </button>
                      <button
                        onClick={() => { exportConversation(); setShowQuickActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export Conversation</span>
                      </button>
                      <button
                        onClick={() => { clearConversation(); setShowQuickActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear Chat</span>
                      </button>
                      <div className="border-t border-white/10"></div>
                      <button
                        onClick={() => { setShowSettings(true); setShowQuickActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Voice Settings</span>
                      </button>
                    </motion.div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            {quickSuggestions.length > 0 && (
              <div className="border-b border-white/10 p-3">
                <div className="text-xs text-gray-400 mb-2 flex items-center space-x-1">
                  <Brain className="w-3 h-3" />
                  <span>Quick suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 3).map((suggestion, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-xs bg-nexlytix-600/10 hover:bg-nexlytix-600/20 border border-nexlytix-500/20 text-nexlytix-300 px-2 py-1 rounded-full transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={clsx("flex", m.type === "user" ? "justify-end" : "justify-start")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={clsx(
                      "max-w-[80%] rounded-lg p-3",
                      m.type === "user"
                        ? "bg-nexlytix-600/30 text-white ml-4"
                        : "bg-white/10 text-gray-100 mr-4"
                    )}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      {m.type === "vemo" ? (
                        <VemoLogo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-sm leading-relaxed">{m.content}</div>
                    </div>

                    {m.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {m.actions.map((a, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleActionClick(a.action, a.label)}
                            className="text-xs bg-gradient-to-r from-nexlytix-600/20 to-nexlytix-500/20 hover:from-nexlytix-600/40 hover:to-nexlytix-500/40 border border-nexlytix-500/30 hover:border-nexlytix-400/50 text-nexlytix-300 hover:text-nexlytix-200 px-3 py-1.5 rounded-full transition-all duration-200 flex items-center space-x-1 shadow-lg hover:shadow-nexlytix-500/20"
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {a.icon && <span>{a.icon}</span>}
                            <span>{a.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Smart suggestions for this message */}
                    {m.metadata?.suggestions && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <div className="text-xs text-gray-400 mb-2">💡 You might also ask:</div>
                        <div className="flex flex-wrap gap-1">
                          {m.metadata.suggestions.map((suggestion, i) => (
                            <motion.button
                              key={i}
                              onClick={() => handleQuickSuggestion(suggestion)}
                              className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-2 py-1 rounded-full transition-all duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white/10 rounded-lg p-3 mr-4">
                    <div className="flex items-center space-x-2">
                      <VemoLogo className="w-5 h-5" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-nexlytix-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-nexlytix-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-nexlytix-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={isListening ? "🎤 Listening..." : "Chat with Vemo... (I'm excited to help! 😊)"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nexlytix-500 focus:border-transparent text-sm transition-all duration-200"
                    disabled={isListening}
                  />
                  {isListening && (
                    <motion.div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-nexlytix-600 to-nexlytix-500 hover:from-nexlytix-500 hover:to-nexlytix-400 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-nexlytix-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={toggleVoiceInput}
                  className={clsx(
                    "p-3 rounded-xl transition-all duration-200 shadow-lg",
                    isListening
                      ? "bg-red-500 hover:bg-red-400 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Enhanced status indicators */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <motion.div
                      className="flex items-center space-x-1"
                      animate={isTyping ? { opacity: [0.5, 1, 0.5] } : {}}
                      transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
                    >
                      <Activity className="w-3 h-3" />
                      <span>{isTyping ? "Vemo is thinking..." : "Real-time monitoring"}</span>
                    </motion.div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure AI</span>
                    </div>
                  </div>

                  {conversationContext.length > 0 && (
                    <div className="text-nexlytix-400">
                      💭 {conversationContext.length} context memories
                    </div>
                  )}
                </div>
                
                {/* Keyboard shortcuts hint */}
                <div className="text-xs text-gray-600 flex items-center space-x-3">
                  <span>⌘K Clear</span>
                  <span>⌘E Export</span>
                  <span>⌘R Regenerate</span>
                  <span>⌘, Settings</span>
                  <span>ESC Stop</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Modal */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[110]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
              >
                <motion.div
                  className="w-96 bg-gray-900 border border-white/10 rounded-xl p-6 shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>Voice Settings</span>
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Voice Selection */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Voice</label>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-nexlytix-500"
                      >
                        {availableVoices.map((voice) => (
                          <option key={voice.name} value={voice.name} className="bg-gray-800">
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Speech Rate */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Speech Speed: {speechRate.toFixed(1)}x
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">Slow</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={speechRate}
                          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                          className="flex-1 accent-nexlytix-500"
                        />
                        <span className="text-xs text-gray-400">Fast</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => setSpeechRate(0.8)}
                          className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded"
                        >
                          0.8x
                        </button>
                        <button
                          onClick={() => setSpeechRate(1.0)}
                          className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded"
                        >
                          1.0x
                        </button>
                        <button
                          onClick={() => setSpeechRate(1.2)}
                          className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded"
                        >
                          1.2x
                        </button>
                        <button
                          onClick={() => setSpeechRate(1.5)}
                          className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded"
                        >
                          1.5x
                        </button>
                      </div>
                    </div>

                    {/* Speech Pitch */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Voice Pitch: {speechPitch.toFixed(1)}
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">Low</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={speechPitch}
                          onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                          className="flex-1 accent-nexlytix-500"
                        />
                        <span className="text-xs text-gray-400">High</span>
                      </div>
                    </div>

                    {/* Test Voice */}
                    <button
                      onClick={() => speak("Hello. This is a voice synthesis test using your current configuration settings. Audio quality and clarity should be optimal for professional communication.")}
                      className="w-full py-2 bg-gradient-to-r from-nexlytix-600 to-nexlytix-500 hover:from-nexlytix-500 hover:to-nexlytix-400 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Test Voice</span>
                    </button>

                    {/* Reset to Defaults */}
                    <button
                      onClick={() => {
                        setSpeechRate(0.95);
                        setSpeechPitch(0.9);
                        const defaultVoice = availableVoices.find(v => 
                          v.name.includes('David') ||
                          v.name.includes('Mark') ||
                          v.name.includes('Daniel') ||
                          v.name.includes('Male')
                        ) || availableVoices.find(v => 
                          v.name.includes('Natural') || 
                          v.name.includes('Neural') ||
                          v.name.includes('Premium')
                        );
                        if (defaultVoice) setSelectedVoice(defaultVoice.name);
                      }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all duration-200 text-sm"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VemoChat;
