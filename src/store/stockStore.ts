import { create } from 'zustand';
import type { StockData, StockStore, Timeframe } from '../types/stock.types';

export const useStockStore = create<StockStore>((set) => ({
  currentTicker: 'RELIANCE',
  stockData: null,
  isLoading: false,
  error: null,
  selectedTimeframe: '1Y',
  activeOverlays: ['SMA 20', 'SMA 50'],
  activeIndicators: ['RSI'],
  showFibonacci: false,
  showElliottWave: false,
  showPatterns: true,

  setTicker: (ticker: string) => set({ currentTicker: ticker }),
  setStockData: (data: StockData) => set({ stockData: data }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setTimeframe: (tf: Timeframe) => set({ selectedTimeframe: tf }),
  toggleOverlay: (overlay: string) =>
    set((state) => ({
      activeOverlays: state.activeOverlays.includes(overlay)
        ? state.activeOverlays.filter((o) => o !== overlay)
        : [...state.activeOverlays, overlay],
    })),
  toggleIndicator: (indicator: string) =>
    set((state) => ({
      activeIndicators: state.activeIndicators.includes(indicator)
        ? state.activeIndicators.filter((i) => i !== indicator)
        : [...state.activeIndicators, indicator],
    })),
  toggleFibonacci: () => set((state) => ({ showFibonacci: !state.showFibonacci })),
  toggleElliottWave: () => set((state) => ({ showElliottWave: !state.showElliottWave })),
  togglePatterns: () => set((state) => ({ showPatterns: !state.showPatterns })),
}));
