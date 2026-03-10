import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import { useTechnicals } from '../../hooks/useTechnicals';
import { useStockStore } from '../../store/stockStore';

type IndicatorType = 'RSI' | 'MACD' | 'Stochastic' | 'ADX';

interface IndicatorPaneProps {
  type: IndicatorType;
}

const PANE_HEIGHT = 130;

export const IndicatorPane: React.FC<IndicatorPaneProps> = ({ type }) => {
  const { chartData } = useTechnicals();
  const { activeIndicators } = useStockStore();

  if (!activeIndicators.includes(type) || !chartData.length) return null;

  const thinData = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 200)) === 0);

  const commonAxis = (
    <>
      <XAxis dataKey="date" hide />
      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
    </>
  );

  const formatXAxis = (tick: string) => {
    if (!tick) return '';
    const d = new Date(tick);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const tooltipStyle = {
    background: '#1F2937',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '11px',
  };

  if (type === 'RSI') {
    const currentRSI = thinData[thinData.length - 1]?.rsi;
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-4 py-1">
          <span className="text-xs text-gray-400 font-medium">RSI (14)</span>
          {currentRSI !== undefined && !isNaN(currentRSI) && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                currentRSI >= 70
                  ? 'bg-danger/20 text-danger'
                  : currentRSI <= 30
                  ? 'bg-teal/20 text-teal'
                  : 'bg-white/10 text-white'
              }`}
            >
              {currentRSI.toFixed(1)}
            </span>
          )}
        </div>
        <div style={{ height: PANE_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={thinData} margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
              {commonAxis}
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} ticks={[0, 30, 50, 70, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v?.toFixed(1), 'RSI']} />
              <ReferenceLine y={70} stroke="#FF4D4D" strokeDasharray="4 2" strokeOpacity={0.6} />
              <ReferenceLine y={30} stroke="#00D4AA" strokeDasharray="4 2" strokeOpacity={0.6} />
              <Area type="monotone" dataKey="rsi" stroke="#00D4AA" strokeWidth={1.5} fill="#00D4AA" fillOpacity={0.05} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (type === 'MACD') {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 px-4 py-1">
          <span className="text-xs text-gray-400 font-medium">MACD (12, 26, 9)</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-blue-400 inline-block" />MACD</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-orange-400 inline-block" />Signal</span>
        </div>
        <div style={{ height: PANE_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={thinData} margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
              {commonAxis}
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v: number) => v.toFixed(0)} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine y={0} stroke="#4B5563" />
              <Bar dataKey="histogram" fill="#6B7280">
                {thinData.map((d, i) => (
                  <Cell key={i} fill={(d.histogram ?? 0) >= 0 ? '#00D4AA' : '#FF4D4D'} fillOpacity={0.7} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="macdLine" stroke="#3B82F6" strokeWidth={1.5} dot={false} connectNulls />
              <Line type="monotone" dataKey="signalLine" stroke="#F97316" strokeWidth={1.5} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (type === 'Stochastic') {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 px-4 py-1">
          <span className="text-xs text-gray-400 font-medium">Stochastic (14, 3)</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-blue-400 inline-block" />%K</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-orange-400 inline-block" />%D</span>
        </div>
        <div style={{ height: PANE_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={thinData} margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
              {commonAxis}
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} ticks={[0, 20, 50, 80, 100]} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine y={80} stroke="#FF4D4D" strokeDasharray="4 2" strokeOpacity={0.6} />
              <ReferenceLine y={20} stroke="#00D4AA" strokeDasharray="4 2" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="stochK" stroke="#3B82F6" strokeWidth={1.5} dot={false} connectNulls />
              <Line type="monotone" dataKey="stochD" stroke="#F97316" strokeWidth={1.5} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (type === 'ADX') {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 px-4 py-1">
          <span className="text-xs text-gray-400 font-medium">ADX (14)</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-yellow-400 inline-block" />ADX</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-green-400 inline-block" />+DI</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-0.5 bg-red-400 inline-block" />-DI</span>
        </div>
        <div style={{ height: PANE_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={thinData} margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
              {commonAxis}
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 60]} tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine y={25} stroke="#6B7280" strokeDasharray="4 2" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="adx" stroke="#F0B429" strokeWidth={1.5} dot={false} connectNulls />
              <Line type="monotone" dataKey="plusDI" stroke="#00D4AA" strokeWidth={1} dot={false} connectNulls />
              <Line type="monotone" dataKey="minusDI" stroke="#FF4D4D" strokeWidth={1} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
};
