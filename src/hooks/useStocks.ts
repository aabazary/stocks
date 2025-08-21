import { useState, useCallback } from 'react';
import { StockData } from '../types/stock';
import { getMultipleStockQuotes, DEFAULT_STOCKS } from '../services/stockApi';

export const useStocks = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const savedStocks = localStorage.getItem('stockSymbols');
      let stockSymbols = savedStocks ? JSON.parse(savedStocks) : DEFAULT_STOCKS;
      
      if (!stockSymbols || stockSymbols.length === 0) {
        stockSymbols = DEFAULT_STOCKS;
      }
      
      const stockData = await getMultipleStockQuotes(stockSymbols);
      setStocks(stockData);
      
      const successfulSymbols = stockData.map(stock => stock.symbol);
      localStorage.setItem('stockSymbols', JSON.stringify(successfulSymbols));
      
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addStock = useCallback((newStock: StockData) => {
    setStocks(prev => {
      const updated = [...prev, newStock];
      localStorage.setItem('stockSymbols', JSON.stringify(updated.map(s => s.symbol)));
      return updated;
    });
  }, []);

  const removeStock = useCallback((symbol: string) => {
    setStocks(prev => {
      const updated = prev.filter(stock => stock.symbol !== symbol);
      localStorage.setItem('stockSymbols', JSON.stringify(updated.map(s => s.symbol)));
      return updated;
    });
  }, []);

  // Get the first stock for default selection
  const firstStock = stocks.length > 0 ? stocks[0] : null;

  return {
    stocks,
    loading,
    error,
    firstStock,
    fetchStocks,
    addStock,
    removeStock
  };
};
