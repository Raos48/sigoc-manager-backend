import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Button,
    Chip, Tooltip, IconButton, TextField, InputAdornment, CircularProgress,
    Alert, Divider, Stack, Card, CardContent, Grid
} from '@mui/material';
import {
    Add as AddIcon, Search as SearchIcon, FilterList as FilterListIcon,
    Visibility as VisibilityIcon, Edit as EditIcon, OpenInNew as OpenInNewIcon,
    Refresh as RefreshIcon, Clear as ClearIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import api from "/src/services/api";

// Cabeçalho da tabela
const headCells = [
    { id: 'identificador', numeric: false, disablePadding: false, label: 'Identificador' },
    { id: 'assunto', numeric: false, disablePadding: false, label: 'Assunto' },
    { id: 'tipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'tipo_processo', numeric: false, disablePadding: false, label: 'Tipo de Processo' },
    { id: 'categoria', numeric: false, disablePadding: false, label: 'Categoria' },
    { id: 'situacao', numeric: false, disablePadding: false, label: 'Situação' },
    { id: 'prioridade', numeric: false, disablePadding: false, label: 'Prioridade' },
    { id: 'prazo', numeric: false, disablePadding: false, label: 'Prazo' },
    { id: 'acoes', numeric: false, disablePadding: false, label: 'Ações' },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        if (property !== 'acoes') {
            onRequestSort(event, property);
        }
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#1f5464', // Define a cor de fundo do cabeçalho
                            color: 'white', // Define a cor da fonte como branca
                            whiteSpace: 'nowrap',
                            padding: '2px 2px', // Ajuste o padding superior/inferior para reduzir a altura
                            fontSize: '1rem', // Opcional: reduza o tamanho da fonte para ajuste visual
                            '& .MuiTableSortLabel-root': {
                                color: 'white',
                                '&:hover': {
                                    color: 'white', // mantém branco ao passar o mouse
                                },
                                '&.Mui-active': {
                                    color: 'white', // mantém branco quando ativo
                                },
                                '& .MuiTableSortLabel-icon': {
                                    color: 'white !important', // Define a cor das setas como branca
                                },
                            },
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            disabled={headCell.id === 'acoes'}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar({ searchTerm, handleSearchChange, handleSearchSubmit, isSearching, refreshData, handleClearSearch, handleAddProcesso }) {
    return (
        <Card sx={{ boxShadow: 1 }}>
            <Toolbar sx={{ py: 0, px: 1, backgroundColor: (theme) => theme.palette.background.paper }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Gerenciamento de Processos
                </Typography>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar processos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit();
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {isSearching ? (
                                            <CircularProgress size={20} />
                                        ) : searchTerm ? (
                                            <IconButton
                                                size="small"
                                                aria-label="clear search"
                                                onClick={handleClearSearch}
                                                edge="end"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        ) : null}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSearchSubmit}
                            disabled={isSearching}
                            startIcon={<SearchIcon />}
                        >
                            Buscar
                        </Button>
                        <Tooltip title="Filtrar lista">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Atualizar dados">
                            <IconButton onClick={refreshData}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddProcesso}
                            sx={{ fontWeight: 'medium' }}
                        >
                            Novo Processo
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </Card>

    );
}

// === COMPONENTE PRINCIPAL ===
const ProcessosList = () => {
    const [processos, setProcessos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearching] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('identificador');
    const navigate = useNavigate();

    const fetchProcessos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: rowsPerPage,
                offset: page * rowsPerPage,
                ordering: `${order === 'desc' ? '-' : ''}${orderBy}`,
                ...(activeSearch && { search: activeSearch })
            });
            const response = await api.get(`/processos/?${params.toString()}`);
            setProcessos(response.data.results || []);
            setTotalCount(response.data.count || 0);
            setError(null);
        } catch (err) {
            console.log(err)
            setError('Erro ao carregar processos');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, activeSearch, order, orderBy]);

    useEffect(() => {
        fetchProcessos();
    }, [fetchProcessos]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 25));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setPage(0);
        setActiveSearch(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setActiveSearch('');
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleViewProcesso = (id) => {
        navigate(`/processos/${id}`);
    };

    const handleAddProcesso = () => {
        navigate('/processos/novo');
    };

    const refreshData = () => {
        setPage(0);
        fetchProcessos(true);
    };

    const getSituacaoColor = (situacao) => {
        if (!situacao) return 'default';
        const situacaoLower = situacao.toLowerCase();
        if (situacaoLower.includes("andamento")) return 'primary';
        if (situacaoLower.includes("concluído")) return 'success';
        if (situacaoLower.includes("atrasado")) return 'error';
        if (situacaoLower.includes("pendente")) return 'warning';
        return 'default';
    };

    const getPrioridadeColor = (prioridade) => {
        if (!prioridade) return 'default';
        const prioridadeLower = prioridade.toLowerCase();
        if (prioridadeLower === 'alta') return 'error';
        if (prioridadeLower === 'média' || prioridadeLower === 'media') return 'warning';
        if (prioridadeLower === 'baixa') return 'success';
        if (prioridadeLower === 'normal') return 'info';
        return 'default';
    };

    const formatarData = (dataString) => {
        if (!dataString) return "—";
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            console.log(error)
            return dataString;
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                    <EnhancedTableToolbar
                        searchTerm={searchTerm}
                        handleSearchChange={handleSearchChange}
                        handleSearchSubmit={handleSearchSubmit}
                        isSearching={isSearching}
                        refreshData={refreshData}
                        handleClearSearch={handleClearSearch}
                        handleAddProcesso={handleAddProcesso}
                    />
                </CardContent>
            </Card>
            <Card sx={{ boxShadow: 2 }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <Table stickyHeader sx={{
                        minWidth: 750,
                        '& .MuiTableCell-root': {
                            padding: '4px 10px',
                        },
                    }} aria-labelledby="tableTitle" size="small">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {loading && !isSearching ? (
                                <TableRow>
                                    <TableCell colSpan={headCells.length} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Carregando processos...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : processos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={headCells.length} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1">
                                            {activeSearch
                                                ? `Nenhum processo encontrado para "${activeSearch}".`
                                                : "Nenhum processo encontrado."}
                                        </Typography>
                                        {activeSearch && (
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={handleClearSearch}
                                                sx={{ mt: 1 }}
                                            >
                                                Limpar busca
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                processos.map((processo) => (
                                    <TableRow
                                        key={processo.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: (theme) => theme.palette.action.hover,
                                            },
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor: (theme) => theme.palette.primary.light + '15',
                                            },
                                            minHeight: '10px',
                                            padding: '2px',
                                        }}
                                    >
                                        <TableCell>{processo.identificador || "—"}</TableCell>
                                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <Tooltip title={processo.assunto || "—"} arrow>
                                                <span>{processo.assunto || "—"}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{processo.tipo || "—"}</TableCell>
                                        <TableCell>{processo.tipo_processo?.nome || "—"}</TableCell>
                                        <TableCell>{processo.categoria?.nome || "—"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={processo.situacao?.nome || "Não definido"}
                                                color={getSituacaoColor(processo.situacao?.nome)}
                                                size="small"
                                                sx={{ minWidth: '90px', fontWeight: 'medium' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={processo.prioridade || "Não definido"}
                                                color={getPrioridadeColor(processo.prioridade)}
                                                size="small"
                                                sx={{ minWidth: '80px', fontWeight: 'medium' }}
                                            />
                                        </TableCell>
                                        <TableCell>{formatarData(processo.prazo)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<OpenInNewIcon />}
                                                onClick={() => handleViewProcesso(processo.id)}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 'medium',
                                                    boxShadow: 1
                                                }}
                                            >
                                                Acessar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={headCells.length} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider />
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : 'mais de ' + to}`}
                    sx={{ borderTop: 1, borderColor: 'divider' }}
                />
            </Card>
        </Box>
    );
};

export default ProcessosList;
