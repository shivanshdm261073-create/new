import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_TABS = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'technicals', label: 'Technicals', active: true },
  { id: 'fundamentals', label: 'Fundamentals', active: false },
  { id: 'valuation', label: 'Valuation', active: false },
  { id: 'macro', label: 'Macro', active: false },
  { id: 'micro', label: 'Micro', active: false },
  { id: 'industry', label: 'Industry', active: false },
  { id: 'ai', label: 'AI Insights', active: false },
];

export const StickyNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleTabClick = (tab: (typeof NAV_TABS)[0]) => {
    if (tab.active) {
      setActiveTab(tab.id);
      const el = document.getElementById(tab.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0F1E]/80 border-b border-white/[0.08]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
          {NAV_TABS.map((tab) => (
            <div key={tab.id} className="relative" onMouseLeave={() => setTooltip(null)}>
              <button
                onClick={() => handleTabClick(tab)}
                onMouseEnter={() => !tab.active && setTooltip(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-gold'
                    : tab.active
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </button>
              <AnimatePresence>
                {tooltip === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-lg whitespace-nowrap z-50 border border-white/10"
                  >
                    Coming Soon
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
