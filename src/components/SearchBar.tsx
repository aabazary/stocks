import { useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { searchStocks, getStockQuote } from '../services/stockApi';
import { StockData } from '../types/stock';
import LoadingSpinner from './LoadingSpinner';

interface SearchBarProps {
  onAddStock: (stock: StockData) => void;
  existingStocks: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddStock, existingStocks }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{symbol: string, name: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const performSearch = useCallback(async () => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchStocks(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const handleAddStock = async (stockInfo: {symbol: string, name: string}) => {
    try {
      const stockData = await getStockQuote(stockInfo.symbol);
      if (stockData) {
        stockData.companyName = stockInfo.name;
        onAddStock(stockData);
        setQuery('');
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const filteredResults = results.filter(stock => 
    !existingStocks.includes(stock.symbol)
  );

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text-tertiary" />
      </div>
      <input
        type="text"
        placeholder="Search for stocks (e.g., AAPL, Apple, Tesla)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        className="block w-full pl-10 pr-3 py-3 border border-border-secondary rounded-lg leading-5 bg-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
      {isSearching && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {showResults && (query.trim().length >= 2) && (
        <div className="absolute z-10 w-full mt-1 bg-surface shadow-lg rounded-lg border border-border max-h-60 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="px-4 py-3 text-sm text-text-secondary">
              {results.length === 0 ? 'No stocks found' : 'All stocks already added'}
            </div>
          ) : (
            <ul>
              {filteredResults.map((stock) => (
                <li key={stock.symbol}>
                  <button
                    onClick={() => handleAddStock(stock)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-secondary flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-text-primary">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {stock.name}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-text-tertiary group-hover:text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div 
        className="fixed inset-0 z-5" 
        onClick={() => setShowResults(false)}
        style={{ display: showResults ? 'block' : 'none' }}
      />
    </div>
  );
};

export default SearchBar;

