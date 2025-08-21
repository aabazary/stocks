import { StockData } from '../types/stock';
import { StocksData } from '../types/stocksData';
import stocksData from '../data/stocks.json';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export const DEFAULT_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

// Cache search results to reduce API calls
const stockNameCache = new Map<string, Array<{symbol: string, name: string}>>();

export const searchStocks = async (query: string): Promise<Array<{symbol: string, name: string}>> => {
  try {
    if (stockNameCache.has(query)) {
      return stockNameCache.get(query) || [];
    }
    
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch stocks");
    const data = await res.json();
    
    const results = data.result || [];
    const searchResults = results.slice(0, 10).map((item: any) => ({
      symbol: item.symbol,
      name: item.description || item.symbol
    }));
    
    stockNameCache.set(query, searchResults);
    return searchResults;
  } catch (error) {
    console.error("Error searching stocks:", error);
    return getMockSearchNames(query);
  }
};

export const getStockQuote = async (symbol: string): Promise<StockData | null> => {
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_API_KEY}`);
    
    if (!res.ok) {
      console.error(`API request failed for ${symbol}:`, res.status, res.statusText);
      throw new Error(`Failed to fetch stock quote: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();

    if (data.error) {
      console.error(`Finnhub API error for ${symbol}:`, data.error);
      throw new Error(`Finnhub API error: ${data.error}`);
    }

    if (!data.c || data.c === 0) {
      return getMockQuote(symbol);
    }

    const stockData = {
      symbol: symbol.toUpperCase(),
      price: parseFloat(data.c.toFixed(2)),
      change: parseFloat((data.c - data.pc).toFixed(2)),
      changePercent: parseFloat(((data.c - data.pc) / data.pc * 100).toFixed(2)),
      companyName: `${symbol.toUpperCase()} Corporation`,
    };
    
    return stockData;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return getMockQuote(symbol);
  }
};

export const getHistoricalData = async (symbol: string, period: string = '1d'): Promise<any[]> => {
  // Historical data requires a paid Finnhub plan, so we'll use mock data
  // This ensures a consistent user experience without API errors
  return getMockHistoricalData(symbol, period);
};

export const getMultipleStockQuotes = async (symbols: string[]): Promise<StockData[]> => {
  const stockData: StockData[] = [];
  
  // Add delay between requests to avoid rate limiting
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    const quote = await getStockQuote(symbol);
    if (quote) {
      stockData.push(quote);
    }
    
    if (i < symbols.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return stockData;
};

const getMockQuote = (symbol: string): StockData => {
  const basePrice = 100 + Math.random() * 900;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    companyName: `${symbol.toUpperCase()} Corporation`,
  };
};

const getMockSearchNames = (query: string): Array<{symbol: string, name: string}> => {
  const mockSymbols = (stocksData as StocksData).stocks;
  
  const queryLower = query.toLowerCase();
  
  // Enhanced search logic with priority ordering
  const filtered = mockSymbols.filter(item => {
    const symbolLower = item.symbol.toLowerCase();
    const nameLower = item.name.toLowerCase();
    
    if (symbolLower === queryLower) return true;
    if (symbolLower.includes(queryLower)) return true;
    if (nameLower.includes(queryLower)) return true;
    
    const queryWords = queryLower.split(' ').filter(word => word.length > 1);
    const nameWords = nameLower.split(' ').filter(word => word.length > 1);
    
    return queryWords.some(queryWord => 
      nameWords.some(nameWord => nameWord.includes(queryWord))
    );
  });
  
  const sorted = filtered.sort((a, b) => {
    const aSymbolLower = a.symbol.toLowerCase();
    const bSymbolLower = b.symbol.toLowerCase();
    
    if (aSymbolLower === queryLower && bSymbolLower !== queryLower) return -1;
    if (bSymbolLower === queryLower && aSymbolLower !== queryLower) return 1;
    
    if (aSymbolLower.startsWith(queryLower) && !bSymbolLower.startsWith(queryLower)) return -1;
    if (bSymbolLower.startsWith(queryLower) && !aSymbolLower.startsWith(queryLower)) return 1;
    
    return aSymbolLower.localeCompare(bSymbolLower);
  });
  
  // Fallback: create mock entry for any searched symbol not in database
  if (sorted.length === 0 && query.trim().length > 0) {
    const queryUpper = query.toUpperCase();
    let companyName = `${queryUpper} Corporation`;
    
    if (queryUpper.endsWith('INC')) {
      companyName = `${queryUpper.replace('INC', '')} Inc.`;
    } else if (queryUpper.endsWith('CORP')) {
      companyName = `${queryUpper.replace('CORP', '')} Corporation`;
    } else if (queryUpper.endsWith('CO')) {
      companyName = `${queryUpper.replace('CO', '')} Company`;
    } else if (queryUpper.endsWith('LTD')) {
      companyName = `${queryUpper.replace('LTD', '')} Limited`;
    }
    
    return [{
      symbol: queryUpper,
      name: companyName
    }];
  }
  
  return sorted.slice(0, 10);
};

const getMockHistoricalData = (symbol: string, period: string): any[] => {
  const data = [];
  const basePrice = Math.round(100 + Math.random() * 900);
  let currentPrice = basePrice;
  
  let dataPoints = 9;
  
  switch (period) {
    case '1d':
      dataPoints = 9;
      break;
    case '1mo':
      dataPoints = 20;
      break;
    case '3mo':
      dataPoints = 30;
      break;
    case '1y':
      dataPoints = 52;
      break;
    case '5y':
      dataPoints = 60;
      break;
    case 'max':
      dataPoints = 72;
      break;
  }
  
  for (let i = 0; i < dataPoints; i++) {
    const change = (Math.random() - 0.5) * 4;
    currentPrice += change;
    
    let timeLabel = '';
    if (period === '1d') {
      const hour = 9 + i;
      timeLabel = `${hour}:00`;
    } else {
      const date = new Date();
      
      if (period === '1mo') {
        date.setDate(date.getDate() - (dataPoints - i - 1) * 1.5);
        timeLabel = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      } else if (period === '3mo') {
        date.setDate(date.getDate() - (dataPoints - i - 1) * 3);
        timeLabel = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      } else if (period === '1y') {
        date.setDate(date.getDate() - (dataPoints - i - 1) * 7);
        timeLabel = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      } else {
        date.setMonth(date.getMonth() - (dataPoints - i - 1));
        timeLabel = date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit'
        });
      }
    }
    
    data.push({
      time: timeLabel,
      price: parseFloat(currentPrice.toFixed(2)),
      symbol: symbol
    });
  }
  
  return data;
};

