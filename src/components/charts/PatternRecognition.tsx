import React from 'react';
import { motion } from 'framer-motion';
import { useStockStore } from '../../store/stockStore';

export const PatternRecognition: React.FC = () => {
  const { stockData, showPatterns } = useStockStore();

  if (!stockData || !showPatterns) return null;
  const { patterns } = stockData;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest">
          Detected Patterns
        </h3>
        <span className="text-xs text-gray-500">{patterns.length} patterns</span>
      </div>
      <div className="flex flex-col gap-2">
        {patterns.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all"
          >
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">{p.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.type === 'bullish'
                      ? 'bg-teal/15 text-teal'
                      : p.type === 'bearish'
                      ? 'bg-danger/15 text-danger'
                      : 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500">{p.date}</span>
              </div>
              <p className="text-xs text-gray-400">{p.description}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs text-gray-500">Confidence</span>
              <span
                className={`text-sm font-bold ${
                  p.confidence >= 80
                    ? 'text-teal'
                    : p.confidence >= 60
                    ? 'text-gold'
                    : 'text-gray-400'
                }`}
              >
                {p.confidence}%
              </span>
              <div className="w-16 h-1 rounded-full bg-gray-700 mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.confidence}%`,
                    background: p.confidence >= 80 ? '#00D4AA' : p.confidence >= 60 ? '#F0B429' : '#6B7280',
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
