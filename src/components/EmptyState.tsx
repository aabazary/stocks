
import { TrendingUp } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="card text-center py-12">
      <TrendingUp className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-text-primary mb-2">
        No stocks added yet
      </h2>
      <p className="text-text-secondary mb-6">
        Use the search bar above to add stocks to your dashboard
      </p>
      <div className="text-sm text-text-secondary">
        Try searching for: AAPL, GOOGL, MSFT, AMZN, TSLA
      </div>
    </div>
  );
};

export default EmptyState;
