import React, { useState, useEffect, useCallback} from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Chip,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import api from "../services/api";

const ProcessosList = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Buscar processos
  const fetchProcessos = useCallback(async () => {
    setLoading(true);
    try {
      // Construir URL com parâmetros de paginação e busca
      let url = `/processos/?limit=${rowsPerPage}&offset=${page * rowsPerPage}`;
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await api.get(url);
      setProcessos(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar processos:', err);
      setError('Não foi possível carregar os processos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);




  // Carregar processos quando os parâmetros mudarem
  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  // Manipuladores de eventos
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewProcesso = (id) => {
    navigate(`/processos/${id}`);
  };

  const handleAddProcesso = () => {
    navigate('/processos/novo');
  };

  // Renderizar status com cor apropriada
  const renderStatus = (situacao) => {
    if (!situacao) return <Chip label="Não definido" color="default" size="small" />;
    
    let color = "default";
    if (situacao.toLowerCase().includes("andamento")) color = "primary";
    if (situacao.toLowerCase().includes("concluído")) color = "success";
    if (situacao.toLowerCase().includes("atrasado")) color = "error";
    if (situacao.toLowerCase().includes("pendente")) color = "warning";
    
    return <Chip label={situacao} color={color} size="small" />;
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Processos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProcesso}
        >
          Novo Processo
        </Button>
      </Box>

      {/* Barra de busca */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por assunto, número SEI ou órgão demandante..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabela de processos */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader aria-label="tabela de processos">
            <TableHead>
              <TableRow>
                <TableCell>Assunto</TableCell>
                <TableCell>Número SEI</TableCell>
                <TableCell>Órgão Demandante</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Situação</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Carregando processos...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : processos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1">
                      Nenhum processo encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                processos.map((processo) => (
                  <TableRow key={processo.id} hover>
                    <TableCell>{processo.assunto || "—"}</TableCell>
                    <TableCell>{processo.numero_sei || "—"}</TableCell>
                    <TableCell>{processo.orgao_demandante?.nome || "—"}</TableCell>
                    <TableCell>{processo.tipo?.nome || "—"}</TableCell>
                    <TableCell>
                      {processo.prioridade ? (
                        <Chip 
                          label={processo.prioridade} 
                          color={
                            processo.prioridade?.toLowerCase() === "alta" ? "error" : 
                            processo.prioridade?.toLowerCase() === "média" ? "warning" : "info"
                          } 
                          size="small" 
                        />
                      ) : "—"}
                    </TableCell>
                    <TableCell>{renderStatus(processo.situacao?.nome)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Visualizar detalhes">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewProcesso(processo.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar processo">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/processos/${processo.id}/editar`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </>
  );
};

export default ProcessosList;