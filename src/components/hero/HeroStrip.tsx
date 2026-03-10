import React from 'react';
import { motion } from 'framer-motion';
import { useStockStore } from '../../store/stockStore';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { formatINR, formatMarketCap, formatChange } from '../../utils/formatters';

export const HeroStrip: React.FC = () => {
  const { stockData, isLoading } = useStockStore();

  if (isLoading) return <LoadingSkeleton variant="hero" />;
  if (!stockData) return null;

  const { info, aiInsight } = stockData;
  const change = info.ltp - info.prevClose;
  const changePct = (change / info.prevClose) * 100;
  const { text: changeText, pctText, isPositive } = formatChange(change, changePct);
  const rangePercent = ((info.ltp - info.low52W) / (info.high52W - info.low52W)) * 100;

  return (
    <motion.div
      id="overview"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="w-full backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4 sm:p-6"
    >
      <div className="flex flex-wrap gap-6 items-start lg:items-center">
        {/* Stock Identity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-1 min-w-[200px]"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-white">{info.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
              NSE: {info.nseSymbol}
            </span>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              BSE: {info.bseCode}
            </span>
            <span className="text-xs text-teal bg-teal/10 px-2 py-0.5 rounded">
              {info.sector}
            </span>
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              {info.industry}
            </span>
          </div>
        </motion.div>

        {/* LTP + Change */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col"
        >
          <span className="text-4xl font-bold text-white tracking-tight">
            {formatINR(info.ltp)}
          </span>
          <div className={`flex items-center gap-2 text-sm font-semibold ${isPositive ? 'text-teal' : 'text-danger'}`}>
            <span>{changeText}</span>
            <span className="bg-white/5 px-2 py-0.5 rounded">{pctText}</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Prev Close: {formatINR(info.prevClose)}
          </div>
        </motion.div>

        {/* 52W Range */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-[200px] max-w-xs flex flex-col gap-1"
        >
          <span className="text-xs text-gray-400 font-medium">52-Week Range</span>
          <div className="relative h-2 rounded-full overflow-hidden bg-gray-800">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, #FF4D4D, #F0B429, #00D4AA)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-900 shadow-lg"
              style={{ left: `calc(${rangePercent}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span className="text-danger">L: {formatINR(info.low52W)}</span>
            <span className="text-teal">H: {formatINR(info.high52W)}</span>
          </div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-4 sm:gap-6 flex-wrap"
        >
          {[
            { label: 'Market Cap', value: formatMarketCap(info.marketCap) },
            { label: 'P/E (TTM)', value: info.pe.toFixed(1) },
            { label: 'EPS (TTM)', value: formatINR(info.eps) },
            { label: 'Div Yield', value: `${info.dividendYield.toFixed(2)}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="flex flex-col">
              <span className="text-xs text-gray-500">{kpi.label}</span>
              <span className="text-sm font-semibold text-gold">{kpi.value}</span>
            </div>
          ))}
        </motion.div>

        {/* AI Insight Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-2 bg-teal/5 border border-teal/20 rounded-xl px-3 py-2 max-w-xs"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-teal mt-1 shrink-0"
          />
          <p className="text-xs text-gray-300 leading-relaxed">{aiInsight}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
