import { useMemo } from 'react';
import { useStockStore } from '../store/stockStore';
import type { PricePoint, TechnicalIndicators } from '../types/stock.types';

const TIMEFRAME_DAYS: Record<string, number> = {
  '1D': 1,
  '1W': 5,
  '1M': 22,
  '3M': 66,
  '6M': 132,
  '1Y': 252,
  '3Y': 756,
  '5Y': 1260,
};

export interface ChartDataPoint extends PricePoint {
  sma20?: number;
  sma50?: number;
  sma200?: number;
  ema9?: number;
  ema21?: number;
  bollingerUpper?: number;
  bollingerMiddle?: number;
  bollingerLower?: number;
  vwap?: number;
  rsi?: number;
  macdLine?: number;
  signalLine?: number;
  histogram?: number;
  stochK?: number;
  stochD?: number;
  adx?: number;
  plusDI?: number;
  minusDI?: number;
}

export function useTechnicals() {
  const { stockData, selectedTimeframe, activeOverlays, activeIndicators } = useStockStore();

  const result = useMemo(() => {
    if (!stockData) {
      return { chartData: [], overlayData: [], indicatorData: [] };
    }

    const { priceHistory, technicals } = stockData;
    const days = TIMEFRAME_DAYS[selectedTimeframe] ?? 252;
    const startIdx = Math.max(0, priceHistory.length - days);
    const slicedPrices = priceHistory.slice(startIdx);

    const t: TechnicalIndicators = technicals;

    const chartData: ChartDataPoint[] = slicedPrices.map((point, i) => {
      const absIdx = startIdx + i;
      const d: ChartDataPoint = { ...point };

      if (activeOverlays.includes('SMA 20')) d.sma20 = t.sma20[absIdx];
      if (activeOverlays.includes('SMA 50')) d.sma50 = t.sma50[absIdx];
      if (activeOverlays.includes('SMA 200')) d.sma200 = t.sma200[absIdx];
      if (activeOverlays.includes('EMA 9')) d.ema9 = t.ema9[absIdx];
      if (activeOverlays.includes('EMA 21')) d.ema21 = t.ema21[absIdx];
      if (activeOverlays.includes('Bollinger Bands')) {
        d.bollingerUpper = t.bollingerUpper[absIdx];
        d.bollingerMiddle = t.bollingerMiddle[absIdx];
        d.bollingerLower = t.bollingerLower[absIdx];
      }
      if (activeOverlays.includes('VWAP')) d.vwap = t.vwap[absIdx];

      if (activeIndicators.includes('RSI')) d.rsi = t.rsi[absIdx];
      if (activeIndicators.includes('MACD')) {
        d.macdLine = t.macd.macdLine[absIdx];
        d.signalLine = t.macd.signalLine[absIdx];
        d.histogram = t.macd.histogram[absIdx];
      }
      if (activeIndicators.includes('Stochastic')) {
        d.stochK = t.stochastic.k[absIdx];
        d.stochD = t.stochastic.d[absIdx];
      }
      if (activeIndicators.includes('ADX')) {
        d.adx = t.adx.adx[absIdx];
        d.plusDI = t.adx.plusDI[absIdx];
        d.minusDI = t.adx.minusDI[absIdx];
      }

      return d;
    });

    return { chartData };
  }, [stockData, selectedTimeframe, activeOverlays, activeIndicators]);

  return result;
}
