import React from 'react';
import { motion } from 'framer-motion';
import { useStockStore } from '../../store/stockStore';
import type { Timeframe } from '../../types/stock.types';

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y'];

export const TimeframeSelector: React.FC = () => {
  const { selectedTimeframe, setTimeframe } = useStockStore();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/[0.08]">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf)}
          className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            selectedTimeframe === tf
              ? 'text-gray-900'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {selectedTimeframe === tf && (
            <motion.div
              layoutId="tf-indicator"
              className="absolute inset-0 rounded-lg bg-gold"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tf}</span>
        </button>
      ))}
    </div>
  );
};
