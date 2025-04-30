// src/components/dashboard/Dashboard.jsx
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip
} from '@mui/material';
import {
    AssignmentLate as AssignmentLateIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import EstatisticasDesempenho from '../cards/EstatisticasDesempenho';

// Dados de exemplo para os gráficos
const processosPorTipo = [
    { name: 'Diligência', value: 35 },
    { name: 'Auditoria', value: 25 },
    { name: 'Requisição', value: 20 },
    { name: 'Acórdão', value: 15 },
    { name: 'Relatório', value: 5 },
];
const processosPorOrgao = [
    { name: 'TCU', quantidade: 42 },
    { name: 'CGU', quantidade: 28 },
    { name: 'MPF', quantidade: 18 },
    { name: 'TCE', quantidade: 12 },
];
const processosPorMes = [
    { name: 'Jan', quantidade: 12 },
    { name: 'Fev', quantidade: 19 },
    { name: 'Mar', quantidade: 15 },
    { name: 'Abr', quantidade: 27 },
    { name: 'Mai', quantidade: 18 },
    { name: 'Jun', quantidade: 23 },
    { name: 'Jul', quantidade: 34 },
    { name: 'Ago', quantidade: 30 },
    { name: 'Set', quantidade: 25 },
    { name: 'Out', quantidade: 32 },
    { name: 'Nov', quantidade: 29 },
    { name: 'Dez', quantidade: 20 },
];
// Cores para os gráficos
const COLORS = ['#1f5464', '#376b7c', '#4f8293', '#6699ab', '#7eb0c2'];
// Processos com prazo próximo do vencimento
const processosCriticos = [
    { id: 4, origem: 'TCU', vencimento: '2025-04-30', tipo: 'Acórdão', prioridade: 'Alta' },
    { id: 8, origem: 'TCU', vencimento: '2025-05-05', tipo: 'Acórdão', prioridade: 'Alta' },
    { id: 5, origem: 'CGU', vencimento: '2025-05-10', tipo: 'Relatório', prioridade: 'Média' },
];

export default function Dashboard() {
    // Função para formatar a data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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
    // Função para determinar o ícone de prioridade
    const getPrioridadeIcon = (prioridade) => {
        switch (prioridade) {
            case 'Alta':
                return <ErrorIcon color="error" />;
            case 'Média':
                return <WarningIcon color="warning" />;
            case 'Baixa':
                return <CheckCircleIcon color="success" />;
            default:
                return <AssignmentIcon />;
        }
    };


    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
                '@media (max-width: 700px)': {
                    gridTemplateColumns: '1fr'
                }
            }}
        >
            {/* Processos por tipo (gráfico de pizza) */}
            <Card sx={{ height: '100%' }}>
                <CardHeader
                    title="Processos por Tipo"
                    titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={processosPorTipo}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {processosPorTipo.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} processos`, 'Quantidade']} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            {/* Processos por órgão (gráfico de barras) */}
            <Card sx={{ height: '100%' }}>
                <CardHeader
                    title="Processos por Órgão"
                    titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            data={processosPorOrgao}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantidade" fill="#1f5464" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            {/* Evolução de Processos - ocupa as duas colunas (span 2) */}
            <Box sx={{ gridColumn: 'span 2' }}>
                <Card>
                    <CardHeader
                        title="Evolução de Processos"
                        titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Divider />
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={processosPorMes}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="quantidade" stroke="#1f5464" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>
            {/* Processos críticos */}
            <Card>
                <CardHeader
                    title="Processos com Prazo Crítico"
                    titleTypographyProps={{ variant: 'h6' }}
                    avatar={<AssignmentLateIcon color="error" />}
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                    <List>
                        {processosCriticos.map((processo) => (
                            <React.Fragment key={processo.id}>
                                <ListItem>
                                    <ListItemIcon>
                                        {getPrioridadeIcon(processo.prioridade)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${processo.origem} - ${processo.tipo}`}
                                        secondary={`ID: ${processo.id} | Vencimento: ${formatDate(processo.vencimento)}`}
                                    />
                                    <Chip
                                        label={processo.prioridade}
                                        color={getPrioridadeColor(processo.prioridade)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
            {/* Estatísticas de desempenho */}
            <Card>
                <EstatisticasDesempenho />
            </Card>
        </Box>
    );
}
