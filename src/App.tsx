import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MobileProvider } from './context/MobileContext';
import { TickerProvider } from './context/TickerContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { AppRoutes } from './routes';
import { useTokens } from './hooks/useTokens';
import { VolumeTicker } from './components/dashboard/VolumeTicker';
import { TopVolumeBar } from './components/dashboard/TopVolumeBar';
import { ErrorState } from './components/ErrorState';
import { useTickers } from './context/TickerContext';

const AppContent = () => {
  const { tokens, error } = useTokens();
  const { showTickers } = useTickers();

  if (error) {
    return (
      <ErrorState
        title="Application Error"
        message={error}
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      {showTickers && (
        <>
          <ErrorBoundary>
            <VolumeTicker tokens={tokens} />
          </ErrorBoundary>
          <ErrorBoundary>
            <TopVolumeBar tokens={tokens} />
          </ErrorBoundary>
        </>
      )}
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MobileProvider>
          <TickerProvider>
            <Router>
              <AppContent />
            </Router>
          </TickerProvider>
        </MobileProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};