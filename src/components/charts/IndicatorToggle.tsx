import React from 'react';
import { useStockStore } from '../../store/stockStore';

const OVERLAY_INDICATORS = [
  { id: 'SMA 20', label: 'SMA 20', color: '#3B82F6' },
  { id: 'SMA 50', label: 'SMA 50', color: '#F97316' },
  { id: 'SMA 200', label: 'SMA 200', color: '#A855F7' },
  { id: 'EMA 9', label: 'EMA 9', color: '#06B6D4' },
  { id: 'EMA 21', label: 'EMA 21', color: '#EC4899' },
  { id: 'Bollinger Bands', label: 'Bollinger', color: '#6366F1' },
  { id: 'VWAP', label: 'VWAP', color: '#F0B429' },
];

const SUB_INDICATORS = [
  { id: 'RSI', label: 'RSI (14)', color: '#00D4AA' },
  { id: 'MACD', label: 'MACD', color: '#3B82F6' },
  { id: 'Stochastic', label: 'Stoch', color: '#EC4899' },
  { id: 'ADX', label: 'ADX', color: '#F0B429' },
];

interface TogglePillProps {
  id: string;
  label: string;
  color: string;
  isActive: boolean;
  onToggle: (id: string) => void;
}

const TogglePill: React.FC<TogglePillProps> = ({ id, label, color, isActive, onToggle }) => (
  <button
    onClick={() => onToggle(id)}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
      isActive
        ? 'border-transparent text-gray-900'
        : 'border-white/[0.08] text-gray-400 hover:text-gray-200 bg-transparent'
    }`}
    style={isActive ? { backgroundColor: color } : {}}
  >
    <div
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: isActive ? '#000' : color }}
    />
    {label}
  </button>
);

export const IndicatorToggle: React.FC = () => {
  const { activeOverlays, activeIndicators, toggleOverlay, toggleIndicator, showFibonacci, toggleFibonacci, showPatterns, togglePatterns } =
    useStockStore();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex flex-wrap gap-1.5">
        {OVERLAY_INDICATORS.map((ind) => (
          <TogglePill
            key={ind.id}
            id={ind.id}
            label={ind.label}
            color={ind.color}
            isActive={activeOverlays.includes(ind.id)}
            onToggle={toggleOverlay}
          />
        ))}
      </div>
      <div className="w-px h-5 bg-white/10" />
      <div className="flex flex-wrap gap-1.5">
        {SUB_INDICATORS.map((ind) => (
          <TogglePill
            key={ind.id}
            id={ind.id}
            label={ind.label}
            color={ind.color}
            isActive={activeIndicators.includes(ind.id)}
            onToggle={toggleIndicator}
          />
        ))}
      </div>
      <div className="w-px h-5 bg-white/10" />
      <div className="flex gap-1.5">
        <TogglePill id="fib" label="Fibonacci" color="#F0B429" isActive={showFibonacci} onToggle={() => toggleFibonacci()} />
        <TogglePill id="patterns" label="Patterns" color="#00D4AA" isActive={showPatterns} onToggle={() => togglePatterns()} />
      </div>
    </div>
  );
};
