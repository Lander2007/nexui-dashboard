import { JSX, useState } from 'react';
import { motion } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NetworkMap from './components/NetworkMap';
import Analytics from './components/Analytics';
import Devices from './components/Devices';
import Security from './components/Security';
import Automation from './components/Automation';
import VemoChat from './components/VemoChat';
import NetworkAnimation from './components/NetworkAnimation';

// Define the possible views
type ActiveView = 'dashboard' | 'network' | 'analytics' | 'devices' | 'security' | 'automation';

export default function App() {
  // State for active sidebar view
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // State for Vemo chat toggle
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Render the currently active view
  const renderActiveView = () => {
    const views: Record<ActiveView, JSX.Element> = {
      dashboard: <Dashboard />,
      network: <NetworkMap />,
      analytics: <Analytics />,
      devices: <Devices />,
      security: <Security />,
      automation: <Automation />,
    };
    return views[activeView];
  };

  return (
    <div className="min-h-screen bg-dark-950 mesh-pattern flex flex-col font-sans text-white antialiased relative">
      {/* Animated Background - Choose one of these */}
      <NetworkAnimation />
      {/* <AnimatedBackground /> */}
      {/* <FloatingElements /> */}
      
      {/* Main Layout */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header onChatToggle={() => setIsChatOpen(prev => !prev)} />

          {/* Active View Content */}
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Example Hero Section */}
              {activeView === 'dashboard' && (
                <section className="gradient-border rounded-xl p-1">
                  <div className="glass-effect p-6 glow-effect text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-nexlytix-500 mb-2">
                      Welcome to Nexlytix
                    </h1>
                    <p className="text-gray-300">
                      Your AI-powered network intelligence and automation platform.
                    </p>
                  </div>
                </section>
              )}

              {/* Active View Component */}
              <div className="glass-effect p-6 rounded-xl shadow-lg">
                {renderActiveView()}
              </div>


            </motion.div>
          </main>
        </div>
      </div>

      {/* Vemo Chat Panel */}
      <VemoChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
