import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserList } from './components/UserList';
import { ProductList } from './components/ProductList';
import { ApiService } from './services/ApiService';
import './App.css';

/**
 * Main App Component
 * Demonstrates clean architecture with proper separation of concerns
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  React.useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiService = new ApiService();
        await apiService.healthCheck();
        setApiStatus('online');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    switch (apiStatus) {
      case 'online': return '#4CAF50';
      case 'offline': return '#f44336';
      case 'checking': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (): string => {
    switch (apiStatus) {
      case 'online': return 'API Online';
      case 'offline': return 'API Offline';
      case 'checking': return 'Sprawdzanie...';
      default: return 'Nieznany';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>🏗️ Clean Code & Design Patterns Demo</h1>
          <div className="api-status">
            <span 
              className="status-indicator" 
              style={{ backgroundColor: getStatusColor() }}
            />
            <span className="status-text">{getStatusText()}</span>
          </div>
        </header>

        <nav className="app-nav">
          <button
            onClick={() => setActiveTab('users')}
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
          >
            👥 Użytkownicy
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`nav-button ${activeTab === 'products' ? 'active' : ''}`}
          >
            📦 Produkty
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'users' && <UserList />}
          {activeTab === 'products' && <ProductList />}
        </main>

        <footer className="app-footer">
          <p>
            Demo aplikacji pokazującej wzorce projektowe, czysty kod i testowanie
          </p>
          <div className="patterns-info">
            <h4>Zaimplementowane wzorce:</h4>
            <ul>
              <li>🏭 Factory Pattern</li>
              <li>🏪 Repository Pattern</li>
              <li>🔧 Service Layer</li>
              <li>👁️ Observer Pattern</li>
              <li>🏗️ Dependency Injection</li>
              <li>🎣 Custom Hooks</li>
              <li>🧩 Component Pattern</li>
            </ul>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};
