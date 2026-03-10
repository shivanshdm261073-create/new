import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { useStockStore } from '../../store/stockStore';
import { useTechnicals, type ChartDataPoint } from '../../hooks/useTechnicals';
import { formatINR } from '../../utils/formatters';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as ChartDataPoint;
  if (!d) return null;

  const change = d.close - d.open;
  const changePct = (change / d.open) * 100;
  const isPositive = change >= 0;

  return (
    <div className="bg-[#1F2937] border border-white/10 rounded-xl p-3 text-xs shadow-xl min-w-[180px]">
      <div className="font-semibold text-gray-300 mb-2">{d.date}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-gray-500">Open</span><span className="text-white">{formatINR(d.open)}</span>
        <span className="text-gray-500">High</span><span className="text-teal">{formatINR(d.high)}</span>
        <span className="text-gray-500">Low</span><span className="text-danger">{formatINR(d.low)}</span>
        <span className="text-gray-500">Close</span><span className="font-semibold text-white">{formatINR(d.close)}</span>
        <span className="text-gray-500">Change</span>
        <span className={isPositive ? 'text-teal' : 'text-danger'}>
          {isPositive ? '+' : ''}{changePct.toFixed(2)}%
        </span>
        <span className="text-gray-500">Volume</span>
        <span className="text-gray-300">{(d.volume / 100000).toFixed(1)}L</span>
      </div>
    </div>
  );
};

export const PriceChart: React.FC = () => {
  const { stockData, isLoading, activeOverlays, showFibonacci } = useStockStore();
  const { chartData } = useTechnicals();

  if (isLoading) return <LoadingSkeleton variant="chart" />;
  if (!stockData || chartData.length === 0) return null;

  const closes = chartData.map((d) => d.close).filter((v) => !isNaN(v));
  const yMin = Math.floor(Math.min(...closes) * 0.97);
  const yMax = Math.ceil(Math.max(...closes) * 1.02);

  const { supportResistance, fibonacci } = stockData;
  const showSR = true;

  const formatXAxis = (tick: string) => {
    if (!tick) return '';
    const d = new Date(tick);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const thinData = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 200)) === 0);

  return (
    <div className="w-full" style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={thinData} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bollingerFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            axisLine={{ stroke: '#1F2937' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Main price area */}
          <Area
            type="monotone"
            dataKey="close"
            stroke="#00D4AA"
            strokeWidth={1.5}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#00D4AA' }}
          />

          {/* SMA lines */}
          {activeOverlays.includes('SMA 20') && (
            <Line type="monotone" dataKey="sma20" stroke="#3B82F6" strokeWidth={1} dot={false} connectNulls />
          )}
          {activeOverlays.includes('SMA 50') && (
            <Line type="monotone" dataKey="sma50" stroke="#F97316" strokeWidth={1} dot={false} connectNulls />
          )}
          {activeOverlays.includes('SMA 200') && (
            <Line type="monotone" dataKey="sma200" stroke="#A855F7" strokeWidth={1.5} dot={false} connectNulls />
          )}

          {/* EMA lines */}
          {activeOverlays.includes('EMA 9') && (
            <Line type="monotone" dataKey="ema9" stroke="#06B6D4" strokeWidth={1} dot={false} connectNulls />
          )}
          {activeOverlays.includes('EMA 21') && (
            <Line type="monotone" dataKey="ema21" stroke="#EC4899" strokeWidth={1} dot={false} connectNulls />
          )}

          {/* Bollinger Bands */}
          {activeOverlays.includes('Bollinger Bands') && (
            <>
              <Line type="monotone" dataKey="bollingerUpper" stroke="#6366F1" strokeWidth={1} strokeDasharray="4 2" dot={false} connectNulls />
              <Line type="monotone" dataKey="bollingerMiddle" stroke="#6366F1" strokeWidth={0.5} dot={false} connectNulls />
              <Line type="monotone" dataKey="bollingerLower" stroke="#6366F1" strokeWidth={1} strokeDasharray="4 2" dot={false} connectNulls />
            </>
          )}

          {/* VWAP */}
          {activeOverlays.includes('VWAP') && (
            <Line type="monotone" dataKey="vwap" stroke="#F0B429" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls />
          )}

          {/* Support/Resistance lines */}
          {showSR &&
            supportResistance.map((sr) => (
              <ReferenceLine
                key={`${sr.type}-${sr.level}`}
                y={sr.level}
                stroke={sr.type === 'support' ? '#00D4AA' : '#FF4D4D'}
                strokeDasharray="6 3"
                strokeOpacity={sr.strength === 'strong' ? 0.8 : 0.4}
                label={{
                  value: `${sr.type === 'support' ? 'S' : 'R'}: ₹${sr.level.toLocaleString('en-IN')}`,
                  fill: sr.type === 'support' ? '#00D4AA' : '#FF4D4D',
                  fontSize: 9,
                  position: 'insideTopRight',
                }}
              />
            ))}

          {/* Fibonacci levels */}
          {showFibonacci &&
            Object.entries(fibonacci.levels).map(([pct, price]) => (
              <ReferenceLine
                key={`fib-${pct}`}
                y={price}
                stroke="#F0B429"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: `${pct}% ₹${price.toLocaleString('en-IN')}`,
                  fill: '#F0B429',
                  fontSize: 8,
                  position: 'insideLeft',
                }}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
