import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProcessosList from './components/ProcessosList';
import ProcessDetail from './components/ProcessoDetail';
import ProcessoForm from './components/ProcessoForm';
import Charts from './components/Charts';
import ProtectedRoute from './components/ProtectedRoute';
import { appTheme } from './shared-theme/AppTheme';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota pública para login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<ProcessosList />} />
                <Route path="processos">
                  <Route index element={<ProcessosList />} />
                  <Route path=":id" element={<ProcessDetail />} />
                  <Route path="novo" element={<ProcessoForm />} />
                </Route>
                {/* Rotas futuras para outros endpoints da API */}
                <Route path="dashboard" element={<Typography>Painel de Controle (Em desenvolvimento)</Typography>} />
                <Route path="visao-geral" element={<Typography>Visão Geral (Em desenvolvimento)</Typography>} />
                <Route path="relatorios" element={<Typography>Relatórios (Em desenvolvimento)</Typography>} />
                <Route path="graficos" element={<Charts />} />
                <Route path="configuracoes" element={<Typography>Configurações (Em desenvolvimento)</Typography>} />
                <Route path="tipos-demanda" element={<Typography>Tipos de Demanda (Em desenvolvimento)</Typography>} />
                <Route path="tipos-reuniao" element={<Typography>Tipos de Reunião (Em desenvolvimento)</Typography>} />
                <Route path="reunioes" element={<Typography>Reuniões (Em desenvolvimento)</Typography>} />
                <Route path="atribuicoes" element={<Typography>Atribuições (Em desenvolvimento)</Typography>} />
                <Route path="grupos-auditores" element={<Typography>Grupos de Auditores (Em desenvolvimento)</Typography>} />
                <Route path="auditores" element={<Typography>Auditores (Em desenvolvimento)</Typography>} />
                <Route path="unidades" element={<Typography>Unidades (Em desenvolvimento)</Typography>} />
                <Route path="tipos-processo" element={<Typography>Tipos de Processo (Em desenvolvimento)</Typography>} />
                <Route path="situacoes" element={<Typography>Situações (Em desenvolvimento)</Typography>} />
                <Route path="categorias" element={<Typography>Categorias (Em desenvolvimento)</Typography>} />
              </Route>
            </Route>
            
            {/* Redirecionar qualquer outra rota para a página inicial */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;