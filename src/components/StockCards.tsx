
import { StockData } from '../types/stock';
import { getChangeBackgroundClass, formatChangePercent } from '../utils/stockUtils';

interface StockCardsProps {
  stocks: StockData[];
  selectedStock: StockData | null;
  onSelectStock: (stock: StockData) => void;
  onRemoveStock: (symbol: string) => void;
}

const StockCards: React.FC<StockCardsProps> = ({ 
  stocks, 
  selectedStock, 
  onSelectStock, 
  onRemoveStock 
}) => {
  if (stocks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stocks.map((stock) => (
        <div 
          key={stock.symbol} 
          className={`card relative group cursor-pointer transition-all ${
            selectedStock?.symbol === stock.symbol 
              ? 'ring-2 ring-primary bg-primary-light' 
              : 'hover:shadow-lg'
          }`}
          onClick={() => onSelectStock(stock)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveStock(stock.symbol);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-tertiary hover:text-danger hover:bg-danger-light rounded z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-text-primary">{stock.symbol}</h3>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getChangeBackgroundClass(stock.change)}`}>
              {formatChangePercent(stock.changePercent)}
            </span>
          </div>
          
          <div className="text-2xl font-bold text-text-primary mb-1">
            ${stock.price.toFixed(2)}
          </div>
          <div className="text-sm text-text-secondary">
            {stock.companyName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockCards;
