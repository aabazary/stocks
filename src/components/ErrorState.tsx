

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="text-danger text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Unable to Load Data
        </h1>
        <p className="text-text-secondary mb-6">{error}</p>
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
