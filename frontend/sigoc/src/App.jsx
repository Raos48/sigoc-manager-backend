import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Tema personalizado
import theme from './theme/theme';

// Contexto de autenticação atualizado
import { AuthProvider } from './context/AuthContext';

// Componentes de layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Componentes
import ProcessosList from './components/processos/ProcessosList';
import ProcessoDetalhes from './components/processos/ProcessoDetalhes';
import Dashboard from './components/dashboard/Dashboard'; // Importe o componente Dashboard
import NovoProcessoForm from './components/processos/NovoProcessoForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rota de login acessível sem autenticação */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Layout com rotas protegidas */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute />}>                  
                  <Route index element={<HomePage />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  <Route index element={<ProcessosList />} />
                  

                  <Route path="processos">
                    <Route index element={<ProcessosList />} />
                    <Route path=":id" element={<ProcessoDetalhes />} /> {/* Use o novo componente aqui */}
                    <Route path=":id/editar" element={<div>Editar Processo (a ser implementado)</div>} />
                    <Route path="novo" element={<NovoProcessoForm />} />
                  </Route>

                </Route>
              </Route>
              
              {/* Redirecionar para a página inicial para rotas não encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
