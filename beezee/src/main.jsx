import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/design-tokens.css';
import './index.css';
import './i18n';
import { initTheme } from './utils/darkMode';
import { createSkipLink } from './utils/accessibility';

// Initialize IndexedDB on app load
import { initDB } from './utils/offlineSync';
initDB().catch(console.error);

// Initialize theme
initTheme();

// Create skip link for accessibility
createSkipLink();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

