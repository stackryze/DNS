import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { installDomSafetyGuards } from './lib/domSafety.js';

// Must run before the first render so React's DOM commits survive third-party
// DOM mutators (Google Translate / browser translation / extensions).
installDomSafetyGuards();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
