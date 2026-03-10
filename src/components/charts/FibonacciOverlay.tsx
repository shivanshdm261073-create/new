import React from 'react';
import { useStockStore } from '../../store/stockStore';

export const FibonacciOverlay: React.FC = () => {
  const { stockData, showFibonacci } = useStockStore();

  if (!stockData || !showFibonacci) return null;

  const { fibonacci } = stockData;
  const { levels, swingHigh, swingLow } = fibonacci;

  const levelEntries = Object.entries(levels).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest">
          Fibonacci Retracement
        </h3>
        <span className="text-xs text-gray-500">
          {swingLow.toLocaleString('en-IN')} → {swingHigh.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {levelEntries.map(([pct, price]) => (
          <div
            key={pct}
            className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-all"
          >
            <span
              className="text-xs font-bold w-12 text-right"
              style={{
                color:
                  pct === '0' ? '#00D4AA'
                  : pct === '100' ? '#FF4D4D'
                  : '#F0B429',
              }}
            >
              {pct}%
            </span>
            <div className="flex-1 h-px border-t border-dashed border-yellow-400/30" />
            <span className="text-xs text-white font-mono">
              ₹{(price as number).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
