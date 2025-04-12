// Em src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/css/styles.css';

// Atualize estes caminhos para corresponder à sua estrutura atual
import Login from './pages/auth/Login.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import ProcessosListPage from './pages/processes/ProcessosListPage.jsx';

function App() {
  // O restante do código permanece o mesmo
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/processos" replace />} />
            <Route path="processos" element={<ProcessosListPage />} />
          </Route>
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
