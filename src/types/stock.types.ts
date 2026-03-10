export interface StockInfo {
  name: string;
  ticker: string;
  bseCode: string;
  nseSymbol: string;
  sector: string;
  industry: string;
  marketCap: number;
  pe: number;
  eps: number;
  dividendYield: number;
  high52W: number;
  low52W: number;
  ltp: number;
  prevClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume20D: number;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  sma20: number[];
  sma50: number[];
  sma200: number[];
  ema9: number[];
  ema21: number[];
  bollingerUpper: number[];
  bollingerLower: number[];
  bollingerMiddle: number[];
  vwap: number[];
  rsi: number[];
  macd: { macdLine: number[]; signalLine: number[]; histogram: number[] };
  stochastic: { k: number[]; d: number[] };
  adx: { adx: number[]; plusDI: number[]; minusDI: number[] };
}

export interface Pattern {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  date: string;
  confidence: number;
  description: string;
}

export interface SupportResistance {
  level: number;
  type: 'support' | 'resistance';
  strength: 'strong' | 'moderate' | 'weak';
}

export interface FibonacciLevels {
  swingHigh: number;
  swingLow: number;
  levels: Record<string, number>;
}

export interface StockData {
  info: StockInfo;
  aiInsight: string;
  priceHistory: PricePoint[];
  technicals: TechnicalIndicators;
  patterns: Pattern[];
  supportResistance: SupportResistance[];
  fibonacci: FibonacciLevels;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y';

export interface StockStore {
  currentTicker: string;
  stockData: StockData | null;
  isLoading: boolean;
  error: string | null;
  selectedTimeframe: Timeframe;
  activeOverlays: string[];
  activeIndicators: string[];
  showFibonacci: boolean;
  showElliottWave: boolean;
  showPatterns: boolean;
  setTicker: (ticker: string) => void;
  setStockData: (data: StockData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimeframe: (tf: Timeframe) => void;
  toggleOverlay: (overlay: string) => void;
  toggleIndicator: (indicator: string) => void;
  toggleFibonacci: () => void;
  toggleElliottWave: () => void;
  togglePatterns: () => void;
}
