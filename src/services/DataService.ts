import axios from 'axios';
import type { StockData, StockInfo } from '../types/stock.types';
import { generatePriceHistory, generateTechnicals } from '../utils/generateMockData';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
});

export class DataService {
  static async getStockQuote(ticker: string): Promise<StockData> {
    const response = await axiosInstance.get<Omit<StockData, 'priceHistory' | 'technicals'>>(
      `/mock-data/${ticker}.json`
    );
    const partial = response.data;
    const priceHistory = generatePriceHistory();
    const technicals = generateTechnicals(priceHistory);
    return {
      ...partial,
      priceHistory,
      technicals,
    };
  }

  static async getStockBySearch(query: string): Promise<StockInfo[]> {
    // In production this would hit an API; for now return static mock results
    const mockStocks: StockInfo[] = [
      {
        name: 'Reliance Industries Limited',
        ticker: 'RELIANCE',
        bseCode: '500325',
        nseSymbol: 'RELIANCE',
        sector: 'Oil & Gas',
        industry: 'Conglomerate',
        marketCap: 1620000,
        pe: 28.5,
        eps: 86.2,
        dividendYield: 0.32,
        high52W: 2856.15,
        low52W: 2180.5,
        ltp: 2456.75,
        prevClose: 2432.1,
        open: 2440.0,
        dayHigh: 2468.3,
        dayLow: 2425.5,
        volume: 8945623,
        avgVolume20D: 7523456,
      },
    ];
    return mockStocks.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.ticker.toLowerCase().includes(query.toLowerCase())
    );
  }
}
