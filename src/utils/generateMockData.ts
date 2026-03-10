import type { PricePoint, TechnicalIndicators } from '../types/stock.types';

// Seeded pseudo-random for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function calcSMA(prices: number[], period: number): number[] {
  return prices.map((_, i) => {
    if (i < period - 1) return NaN;
    const slice = prices.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function calcEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = new Array(prices.length).fill(NaN);
  let ema = prices[0];
  result[0] = ema;
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    result[i] = ema;
  }
  return result;
}

function calcBollinger(prices: number[], period = 20, multiplier = 2): { upper: number[]; middle: number[]; lower: number[] } {
  const sma = calcSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      upper.push(mean + multiplier * std);
      lower.push(mean - multiplier * std);
    }
  }
  return { upper, middle: sma, lower };
}

function calcRSI(prices: number[], period = 14): number[] {
  const result: number[] = new Array(prices.length).fill(NaN);
  if (prices.length < period + 1) return result;

  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return result;
}

function calcMACD(prices: number[]): { macdLine: number[]; signalLine: number[]; histogram: number[] } {
  const ema12 = calcEMA(prices, 12);
  const ema26 = calcEMA(prices, 26);
  const macdLine = prices.map((_, i) => ema12[i] - ema26[i]);
  const signalLine = calcEMA(macdLine, 9);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);
  return { macdLine, signalLine, histogram };
}

function calcStochastic(highs: number[], lows: number[], closes: number[], kPeriod = 14, dPeriod = 3): { k: number[]; d: number[] } {
  const k: number[] = closes.map((close, i) => {
    if (i < kPeriod - 1) return NaN;
    const sliceHigh = highs.slice(i - kPeriod + 1, i + 1);
    const sliceLow = lows.slice(i - kPeriod + 1, i + 1);
    const highest = Math.max(...sliceHigh);
    const lowest = Math.min(...sliceLow);
    if (highest === lowest) return 50;
    return ((close - lowest) / (highest - lowest)) * 100;
  });
  const d = calcSMA(k.map(v => (isNaN(v) ? 0 : v)), dPeriod);
  return { k, d };
}

function calcADX(highs: number[], lows: number[], closes: number[], period = 14): { adx: number[]; plusDI: number[]; minusDI: number[] } {
  const n = closes.length;
  const adx: number[] = new Array(n).fill(NaN);
  const plusDI: number[] = new Array(n).fill(NaN);
  const minusDI: number[] = new Array(n).fill(NaN);

  if (n < period * 2) return { adx, plusDI, minusDI };

  const tr: number[] = [0];
  const plusDM: number[] = [0];
  const minusDM: number[] = [0];

  for (let i = 1; i < n; i++) {
    const hl = highs[i] - lows[i];
    const hpc = Math.abs(highs[i] - closes[i - 1]);
    const lpc = Math.abs(lows[i] - closes[i - 1]);
    tr.push(Math.max(hl, hpc, lpc));
    const upMove = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  let smoothTR = tr.slice(1, period + 1).reduce((a, b) => a + b, 0);
  let smoothPlusDM = plusDM.slice(1, period + 1).reduce((a, b) => a + b, 0);
  let smoothMinusDM = minusDM.slice(1, period + 1).reduce((a, b) => a + b, 0);

  const diPlus = [smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100];
  const diMinus = [smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100];
  const dx = [diPlus[0] + diMinus[0] === 0 ? 0 : (Math.abs(diPlus[0] - diMinus[0]) / (diPlus[0] + diMinus[0])) * 100];

  for (let i = period + 1; i < n; i++) {
    smoothTR = smoothTR - smoothTR / period + tr[i];
    smoothPlusDM = smoothPlusDM - smoothPlusDM / period + plusDM[i];
    smoothMinusDM = smoothMinusDM - smoothMinusDM / period + minusDM[i];
    const dp = smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100;
    const dm = smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100;
    diPlus.push(dp);
    diMinus.push(dm);
    const dxVal = dp + dm === 0 ? 0 : (Math.abs(dp - dm) / (dp + dm)) * 100;
    dx.push(dxVal);
  }

  let adxVal = dx.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const adxArr = [adxVal];
  for (let i = period; i < dx.length; i++) {
    adxVal = (adxVal * (period - 1) + dx[i]) / period;
    adxArr.push(adxVal);
  }

  const offset = period;
  for (let i = 0; i < diPlus.length; i++) {
    plusDI[i + offset] = diPlus[i];
    minusDI[i + offset] = diMinus[i];
  }
  for (let i = 0; i < adxArr.length; i++) {
    adx[i + offset * 2] = adxArr[i];
  }

  return { adx, plusDI, minusDI };
}

function calcVWAP(points: PricePoint[]): number[] {
  // Rolling 20-day VWAP approximation
  return points.map((_, i) => {
    const period = Math.min(20, i + 1);
    const slice = points.slice(i - period + 1, i + 1);
    const totalPV = slice.reduce((acc, p) => acc + ((p.high + p.low + p.close) / 3) * p.volume, 0);
    const totalV = slice.reduce((acc, p) => acc + p.volume, 0);
    return totalV === 0 ? 0 : totalPV / totalV;
  });
}

export function generatePriceHistory(): PricePoint[] {
  const rand = seededRandom(42);
  const points: PricePoint[] = [];

  // Start date: 2021-03-10, end: 2026-03-10 (~1260 trading days)
  const startDate = new Date('2021-03-10');
  let price = 1900;

  // Trend parameters
  const annualDrift = 0.055; // ~5.5% annual return
  const annualVol = 0.22; // 22% annual volatility
  const dailyDrift = annualDrift / 252;
  const dailyVol = annualVol / Math.sqrt(252);

  // Generate 1300 calendar days and skip weekends
  const currentDate = new Date(startDate);
  let tradingDayCount = 0;

  // Sector-specific events (approximate corrections)
  const corrections: { start: number; end: number; magnitude: number }[] = [
    { start: 50, end: 80, magnitude: -0.12 },   // Mid 2021 correction
    { start: 200, end: 240, magnitude: -0.08 },  // End 2021 pullback
    { start: 310, end: 380, magnitude: -0.18 },  // 2022 Russia-Ukraine selloff
    { start: 500, end: 540, magnitude: -0.10 },  // 2022 RBI rate hike fears
    { start: 650, end: 700, magnitude: -0.08 },  // 2023 correction
    { start: 850, end: 890, magnitude: -0.06 },  // 2024 minor correction
    { start: 1050, end: 1100, magnitude: -0.07 }, // 2025 minor selloff
  ];

  let correctionFactor = 1.0;

  while (tradingDayCount < 1300) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Apply correction factor
      const activeCorrection = corrections.find(c => tradingDayCount >= c.start && tradingDayCount <= c.end);
      if (activeCorrection) {
        const progress = (tradingDayCount - activeCorrection.start) / (activeCorrection.end - activeCorrection.start);
        if (progress < 0.5) {
          correctionFactor = 1 + activeCorrection.magnitude * (progress * 2);
        } else {
          correctionFactor = 1 + activeCorrection.magnitude * (1 - (progress - 0.5) * 2);
        }
      } else {
        correctionFactor = 1.0;
      }

      const dailyReturn = dailyDrift * correctionFactor + dailyVol * (rand() * 2 - 1) * Math.sqrt(1);
      const open = price * (1 + (rand() - 0.5) * 0.005);
      const closeRaw = price * (1 + dailyReturn);
      const high = Math.max(open, closeRaw) * (1 + rand() * 0.008);
      const low = Math.min(open, closeRaw) * (1 - rand() * 0.008);
      const close = Math.min(Math.max(closeRaw, low), high);
      const volume = Math.floor(5000000 + rand() * 8000000);

      points.push({
        date: currentDate.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
      });

      price = close;
      tradingDayCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return points;
}

export function generateTechnicals(points: PricePoint[]): TechnicalIndicators {
  const closes = points.map(p => p.close);
  const highs = points.map(p => p.high);
  const lows = points.map(p => p.low);

  const sma20 = calcSMA(closes, 20);
  const sma50 = calcSMA(closes, 50);
  const sma200 = calcSMA(closes, 200);
  const ema9 = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const bollinger = calcBollinger(closes, 20, 2);
  const vwap = calcVWAP(points);
  const rsi = calcRSI(closes, 14);
  const macd = calcMACD(closes);
  const stochastic = calcStochastic(highs, lows, closes, 14, 3);
  const adx = calcADX(highs, lows, closes, 14);

  return {
    sma20,
    sma50,
    sma200,
    ema9,
    ema21,
    bollingerUpper: bollinger.upper,
    bollingerMiddle: bollinger.middle,
    bollingerLower: bollinger.lower,
    vwap,
    rsi,
    macd,
    stochastic,
    adx,
  };
}
