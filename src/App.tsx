import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StickyNav } from './components/layout/StickyNav';
import { HeroStrip } from './components/hero/HeroStrip';
import { TechnicalsDashboard } from './components/charts/TechnicalsDashboard';
import { HotelSearchPage } from './components/hotels/HotelSearchPage';
import { useStockData } from './hooks/useStockData';
import { useStockStore } from './store/stockStore';

function App() {
  const { isLoading } = useStockData();
  const { currentTicker, setTicker } = useStockStore();
  const [searchInput, setSearchInput] = useState(currentTicker);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTicker(searchInput.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0F1E' }}>
      {/* Search Bar */}
      <div className="w-full border-b border-white/[0.08] bg-[#0A0F1E]/95 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search stock (e.g. RELIANCE, TCS)"
                className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 transition-colors"
                style={{ caretColor: '#F0B429' }}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Search
            </button>
            <span className="text-xs text-gray-500 hidden sm:block">
              Currently showing: <span className="text-yellow-400 font-medium">{currentTicker}</span>
            </span>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <StickyNav />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentTicker}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8"
        >
          <HeroStrip />
          <TechnicalsDashboard />
          <HotelSearchPage />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;
