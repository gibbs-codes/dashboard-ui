/**
 * Projector Display Entry Point
 * Main entry point for Projector display mode
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './core/App';
import './styles/index.css';
import './styles/projector.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App displayType="projector" />
  </React.StrictMode>
);
