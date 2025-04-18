// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importações das fontes Roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import axios from 'axios';

// Configuração global do Axios
axios.defaults.withCredentials = true; // Importante para enviar cookies

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);