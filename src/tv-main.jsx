/**
 * TV Display Entry Point
 * Main entry point for TV display mode
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './core/App';
import './styles/index.css';
import './styles/tv.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App displayType="tv" />
  </React.StrictMode>
);
