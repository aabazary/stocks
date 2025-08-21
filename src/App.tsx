import { useState, useEffect } from 'react';
import { TrendingUp, Moon, Sun } from 'lucide-react';
import { StockData } from './types/stock';
import StockTable from './components/StockTable';
import StockChart from './components/StockChart';
import SearchBar from './components/SearchBar';
import StockCards from './components/StockCards';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { useStocks } from './hooks/useStocks';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { stocks, loading, error, firstStock, fetchStocks, addStock, removeStock } = useStocks();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  // Auto-select first stock when stocks are loaded
  useEffect(() => {
    if (firstStock && !selectedStock) {
      setSelectedStock(firstStock);
    }
  }, [firstStock, selectedStock]);

  // Handle case when selected stock is removed
  useEffect(() => {
    if (selectedStock && !stocks.find(stock => stock.symbol === selectedStock.symbol)) {
      setSelectedStock(firstStock);
    }
  }, [stocks, selectedStock, firstStock]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleRemoveStock = (symbol: string) => {
    removeStock(symbol);
    if (selectedStock?.symbol === symbol) {
      setSelectedStock(firstStock);
    }
  };

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
  };

  const handleAddStock = (newStock: StockData) => {
    addStock(newStock);
    if (stocks.length === 0) {
      setSelectedStock(newStock);
    }
  };

  if (error && stocks.length === 0) {
    return <ErrorState error={error} onRetry={fetchStocks} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors">
        <header className="bg-surface shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-text-primary">Stocks</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-surface-secondary text-text-primary hover:bg-border"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <SearchBar 
              onAddStock={handleAddStock}
              existingStocks={stocks.map(s => s.symbol)}
            />
          </div>

          {loading && stocks.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="lg" text="Loading stock data..." />
            </div>
          ) : (
            <>
              <StockCards 
                stocks={stocks}
                selectedStock={selectedStock}
                onSelectStock={handleSelectStock}
                onRemoveStock={handleRemoveStock}
              />

              {selectedStock && (
                <div className="mb-8">
                  <StockChart selectedStock={selectedStock} loading={loading} />
                </div>
              )}

              <StockTable 
                stocks={stocks} 
                loading={loading} 
                onRefresh={fetchStocks}
                onSelectStock={handleSelectStock}
                selectedStock={selectedStock}
              />

              {!loading && stocks.length === 0 && !error && <EmptyState />}
            </>
          )}
        </main>

                       <footer className="bg-surface border-t border-border mt-16">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                   <div className="text-center text-sm text-text-secondary">
                     <p>Data provided by Finnhub API</p>
                   </div>
                 </div>
               </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;

