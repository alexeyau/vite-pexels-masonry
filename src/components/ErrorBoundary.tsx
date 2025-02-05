import React, { ReactNode, useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorInfo(event.message);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setErrorInfo(event.reason?.toString() || 'Unknown promise rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        {fallback || (
          <>
            <h2>Something went wrong.</h2>
            {errorInfo && <p>Error: {errorInfo}</p>}
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;