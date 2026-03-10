import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { TimeframeSelector } from './TimeframeSelector';
import { IndicatorToggle } from './IndicatorToggle';
import { PriceChart } from './PriceChart';
import { VolumePane } from './VolumePane';
import { IndicatorPane } from './IndicatorPane';
import { PatternRecognition } from './PatternRecognition';
import { FibonacciOverlay } from './FibonacciOverlay';
import { useStockStore } from '../../store/stockStore';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export const TechnicalsDashboard: React.FC = () => {
  const { isLoading, stockData } = useStockStore();

  return (
    <section id="technicals" className="flex flex-col gap-4">
      <SectionHeader title="Price Chart & Technical Analysis" subtitle="Interactive chart with overlays and indicator panes" />

      {/* Controls Row */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <TimeframeSelector />
        <div className="flex-1 min-w-0">
          <IndicatorToggle />
        </div>
      </div>

      {/* Main Chart Area */}
      {isLoading ? (
        <LoadingSkeleton variant="chart" />
      ) : stockData ? (
        <div className="backdrop-blur-xl bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4">
            <PriceChart />
          </div>
          <div className="border-t border-white/[0.05] px-4 pb-4">
            <div className="pt-2">
              <span className="text-xs text-gray-500 font-medium px-4 pb-1 block">Volume</span>
              <VolumePane />
            </div>
          </div>
          <div className="border-t border-white/[0.05] divide-y divide-white/[0.05]">
            <IndicatorPane type="RSI" />
            <IndicatorPane type="MACD" />
            <IndicatorPane type="Stochastic" />
            <IndicatorPane type="ADX" />
          </div>
        </div>
      ) : null}

      {/* Pattern Recognition + Fibonacci side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PatternRecognition />
        <FibonacciOverlay />
      </div>
    </section>
  );
};
