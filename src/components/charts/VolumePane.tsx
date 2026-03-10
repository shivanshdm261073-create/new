import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTechnicals } from '../../hooks/useTechnicals';
import { formatVolume } from '../../utils/formatters';

export const VolumePane: React.FC = () => {
  const { chartData } = useTechnicals();
  if (!chartData.length) return null;

  const thinData = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 200)) === 0);

  const formatXAxis = (tick: string) => {
    if (!tick) return '';
    const d = new Date(tick);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div style={{ height: 100 }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={thinData} margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fill: '#6B7280', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatVolume}
            tick={{ fill: '#6B7280', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value: number) => [formatVolume(value), 'Volume']}
            labelFormatter={(label: string) => label}
            contentStyle={{
              background: '#1F2937',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '11px',
            }}
          />
          <Bar dataKey="volume" radius={[1, 1, 0, 0]}>
            {thinData.map((d, i) => (
              <Cell key={i} fill={d.close >= d.open ? '#00D4AA' : '#FF4D4D'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
