import { useEffect, useCallback } from 'react';
import { useStockStore } from '../store/stockStore';
import { DataService } from '../services/DataService';
import type { StockData } from '../types/stock.types';

export function useStockData() {
  const { currentTicker, stockData, isLoading, error, setStockData, setLoading, setError } =
    useStockStore();

  const fetchData = useCallback(
    async (ticker: string) => {
      setLoading(true);
      setError(null);
      try {
        const data: StockData = await DataService.getStockQuote(ticker);
        setStockData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    },
    [setStockData, setLoading, setError]
  );

  useEffect(() => {
    void fetchData(currentTicker);
  }, [currentTicker, fetchData]);

  const refetch = useCallback(() => {
    void fetchData(currentTicker);
  }, [currentTicker, fetchData]);

  return { stockData, isLoading, error, refetch };
}
