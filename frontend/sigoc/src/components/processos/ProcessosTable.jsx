import React, { useState } from 'react';
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
    TableSortLabel,
    Toolbar,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';

// Função para criar dados fictícios para demonstração
function createData(id, origem, vencimento, tipo, dataCadastro, situacao, prioridade) {
    return { id, origem, vencimento, tipo, dataCadastro, situacao, prioridade };
}

// Dados de exemplo
const rows = [
    createData(1, 'TCU', '2025-05-15', 'Diligência', '2025-04-10', 'Em andamento', 'Alta'),
    createData(2, 'CGU', '2025-05-20', 'Auditoria', '2025-04-08', 'Em andamento', 'Média'),
    createData(3, 'MPF', '2025-06-01', 'Requisição', '2025-04-05', 'Pendente', 'Baixa'),
    createData(4, 'TCU', '2025-04-30', 'Acórdão', '2025-03-28', 'Atrasado', 'Alta'),
    createData(5, 'CGU', '2025-05-10', 'Relatório', '2025-04-01', 'Em andamento', 'Média'),
    createData(6, 'MPF', '2025-05-25', 'Requisição', '2025-04-03', 'Pendente', 'Média'),
    createData(7, 'TCE', '2025-06-10', 'Diligência', '2025-04-12', 'Em andamento', 'Baixa'),
    createData(8, 'TCU', '2025-05-05', 'Acórdão', '2025-03-25', 'Atrasado', 'Alta'),
    createData(9, 'CGU', '2025-05-30', 'Auditoria', '2025-04-07', 'Em andamento', 'Média'),
    createData(10, 'MPF', '2025-06-15', 'Requisição', '2025-04-14', 'Pendente', 'Baixa'),
];

// Função para ordenação
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Função para estabilizar a ordenação
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// Definição das colunas da tabela
const headCells = [
    { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
    { id: 'origem', numeric: false, disablePadding: false, label: 'Origem' },
    { id: 'vencimento', numeric: false, disablePadding: false, label: 'Vencimento' },
    { id: 'tipo', numeric: false, disablePadding: false, label: 'Tipo' },
    { id: 'dataCadastro', numeric: false, disablePadding: false, label: 'Data de Cadastro' },
    { id: 'situacao', numeric: false, disablePadding: false, label: 'Situação' },
    { id: 'prioridade', numeric: false, disablePadding: false, label: 'Prioridade' },
    { id: 'acoes', numeric: false, disablePadding: false, label: 'Ações' },
];

// Componente para o cabeçalho da tabela
function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
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

// Componente para a barra de ferramentas da tabela
function EnhancedTableToolbar() {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) => theme.palette.primary.light + '15',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Processos
            </Typography>
            <TextField
                size="small"
                placeholder="Pesquisar..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mr: 2, width: '300px' }}
            />
            <Tooltip title="Filtrar lista">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}

// Componente principal da tabela de processos
export default function ProcessosTable() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Função para formatar a data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Função para determinar a cor do chip de situação
    const getSituacaoColor = (situacao) => {
        switch (situacao) {
            case 'Em andamento':
                return 'primary';
            case 'Pendente':
                return 'warning';
            case 'Atrasado':
                return 'error';
            default:
                return 'default';
        }
    };

    // Função para determinar a cor do chip de prioridade
    const getPrioridadeColor = (prioridade) => {
        switch (prioridade) {
            case 'Alta':
                return 'error';
            case 'Média':
                return 'warning';
            case 'Baixa':
                return 'success';
            default:
                return 'default';
        }
    };

    // Evitar uma linha em branco no final da tabela
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = stableSort(rows, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, borderRadius: (theme) => theme.shape.borderRadius }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right">{row.id}</TableCell>
                                    <TableCell>{row.origem}</TableCell>
                                    <TableCell>{formatDate(row.vencimento)}</TableCell>
                                    <TableCell>{row.tipo}</TableCell>
                                    <TableCell>{formatDate(row.dataCadastro)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.situacao}
                                            color={getSituacaoColor(row.situacao)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.prioridade}
                                            color={getPrioridadeColor(row.prioridade)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Visualizar">
                                            <IconButton size="small" color="primary">
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="secondary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={8} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>
        </Box>
    );
}
