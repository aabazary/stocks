import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData } from '../types/stock';
import { getHistoricalData } from '../services/stockApi';
import LoadingSpinner from './LoadingSpinner';
import { getChangeColorClass, formatChange, formatChangePercent } from '../utils/stockUtils';

type TimePeriod = '1d' | '1mo' | '3mo' | '1y' | '5y' | 'max';

interface StockChartProps {
  selectedStock: StockData | null;
  loading: boolean;
}

const timePeriods: { value: TimePeriod; label: string }[] = [
  { value: '1d', label: '1D' },
  { value: '1mo', label: '1M' },
  { value: '3mo', label: '3M' },
  { value: '1y', label: '1Y' },
  { value: '5y', label: '5Y' },
  { value: 'max', label: 'Max' },
];

const StockChart: React.FC<StockChartProps> = ({ selectedStock, loading }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1d');
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    if (selectedStock) {
      const loadChartData = async () => {
        setChartLoading(true);
        try {
          const data = await getHistoricalData(selectedStock.symbol, timePeriod);
          setChartData(data);
        } catch {
          // Error is already handled in the API function, just log for debugging
          console.log('Chart data loading completed with fallback');
        } finally {
          setChartLoading(false);
        }
      };
      loadChartData();
    }
  }, [selectedStock, timePeriod]);

  const calculateYDomain = (data: any[]) => {
    if (!data || data.length === 0) return [0, 100];
    
    const prices = data.map(item => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    const padding = range * 0.1;
    const paddedMin = minPrice - padding;
    const paddedMax = maxPrice + padding;
    
    const niceRange = paddedMax - paddedMin;
    const niceStep = Math.pow(10, Math.floor(Math.log10(niceRange / 5)));
    
    const niceMin = Math.floor(paddedMin / niceStep) * niceStep;
    const niceMax = Math.ceil(paddedMax / niceStep) * niceStep;
    
    return [niceMin, niceMax];
  };

  const calculateXAxisInterval = (dataLength: number) => {
    if (dataLength <= 10) return 0;
    if (dataLength <= 20) return 1;
    if (dataLength <= 40) return 2;
    return Math.floor(dataLength / 8);
  };

  const yDomain = calculateYDomain(chartData);
  const xAxisInterval = calculateXAxisInterval(chartData.length);

  if (!selectedStock) {
    return (
      <div className="card p-8 text-center">
        <div className="text-text-secondary text-lg">
          Select a stock from the cards above or table below to view its chart
        </div>
      </div>
    );
  }

  if (loading || chartLoading) {
    return (
      <div className="card p-8 text-center">
        <LoadingSpinner size="md" text="Loading chart data..." />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {selectedStock.symbol} - {selectedStock.companyName}
          </h2>
          <p className="text-sm text-text-secondary">
            Current Price: ${selectedStock.price.toFixed(2)} 
            <span className={`ml-2 ${getChangeColorClass(selectedStock.change)}`}>
              {formatChange(selectedStock.change)} ({formatChangePercent(selectedStock.changePercent)})
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-surface-secondary rounded-lg p-1">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setTimePeriod(period.value)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                timePeriod === period.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgb(var(--color-border))"
            />
            <XAxis 
              dataKey="time" 
              stroke="rgb(var(--color-text-secondary))"
              interval={xAxisInterval}
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="rgb(var(--color-text-secondary))"
              domain={yDomain}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(var(--color-surface))',
                border: '1px solid rgb(var(--color-border))',
                borderRadius: '8px',
                color: 'rgb(var(--color-text-primary))'
              }}
              labelStyle={{ color: 'rgb(var(--color-text-secondary))' }}
              formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="rgb(var(--color-primary))" 
              strokeWidth={2}
              dot={false}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-text-secondary text-center">
        Chart shows {timePeriod === '1d' ? 'hourly' : 
                     timePeriod === '1mo' ? 'every 1.5 days' :
                     timePeriod === '3mo' ? 'every 3 days' :
                     timePeriod === '1y' ? 'weekly' : 
                     'monthly'} simulated data for {selectedStock.symbol}
      </div>
    </div>
  );
};

export default StockChart;

