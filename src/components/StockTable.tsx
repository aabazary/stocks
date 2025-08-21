
import { RefreshCw } from 'lucide-react';
import { StockData } from '../types/stock';
import LoadingSpinner from './LoadingSpinner';
import { getChangeColorClass, formatChange, formatChangePercent } from '../utils/stockUtils';

interface StockTableProps {
  stocks: StockData[];
  loading: boolean;
  onRefresh: () => void;
  onSelectStock: (stock: StockData) => void;
  selectedStock: StockData | null;
}

const StockTable: React.FC<StockTableProps> = ({ 
  stocks, 
  loading, 
  onRefresh, 
  onSelectStock,
  selectedStock 
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">Stock Details</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-secondary bg-surface-secondary rounded-lg hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading && stocks.length === 0 ? (
        <div className="text-center py-8">
          <LoadingSpinner size="md" text="Loading stock data..." />
        </div>
      ) : stocks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No stocks to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Company</th>
                <th className="text-right py-3 px-4 font-semibold text-text-primary">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-text-primary">Change</th>
                <th className="text-right py-3 px-4 font-semibold text-text-primary">Change %</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr 
                  key={stock.symbol} 
                  className={`border-b border-border cursor-pointer transition-colors ${
                    selectedStock?.symbol === stock.symbol 
                      ? 'bg-primary-light border-l-4 border-primary' 
                      : 'hover:bg-surface-secondary'
                  }`} 
                  onClick={() => onSelectStock(stock)}
                >
                  <td className="py-3 px-4 font-medium text-text-primary">
                    {stock.symbol}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {stock.companyName}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-text-primary">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${getChangeColorClass(stock.change)}`}>
                    {formatChange(stock.change)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${getChangeColorClass(stock.changePercent)}`}>
                    {formatChangePercent(stock.changePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-xs text-text-secondary text-center">
        Click on any row to view the stock's price chart above
      </div>
    </div>
  );
};

export default StockTable;

