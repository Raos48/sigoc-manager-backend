import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';

// Dados fictícios para os gráficos
const processosData = [
  { mes: 'Jan', quantidade: 65 },
  { mes: 'Fev', quantidade: 45 },
  { mes: 'Mar', quantidade: 78 },
  { mes: 'Abr', quantidade: 54 },
  { mes: 'Mai', quantidade: 89 },
  { mes: 'Jun', quantidade: 67 },
];

const distribuicaoData = [
  { name: 'Em Andamento', value: 45 },
  { name: 'Concluídos', value: 30 },
  { name: 'Pendentes', value: 15 },
  { name: 'Arquivados', value: 10 },
];

const desempenhoData = [
  { mes: 'Jan', processos: 30, conclusoes: 25 },
  { mes: 'Fev', processos: 45, conclusoes: 35 },
  { mes: 'Mar', processos: 55, conclusoes: 45 },
  { mes: 'Abr', processos: 40, conclusoes: 38 },
  { mes: 'Mai', processos: 50, conclusoes: 42 },
  { mes: 'Jun', processos: 65, conclusoes: 55 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Charts = () => {
  const handleGenerateReport = (type) => {
    // Simulação de geração de relatório
    console.log(`Gerando relatório ${type}...`);
    alert(`Relatório ${type} gerado com sucesso!`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Gráficos e Relatórios
      </Typography>

      <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Gráfico de Barras */}
        <Grid item xs={12} md={6} sx={{ width: '50%' }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Processos por Mês
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#1976d2" name="Quantidade de Processos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<PdfIcon />}
                onClick={() => handleGenerateReport('PDF')}
                variant="outlined"
                size="small"
              >
                Exportar PDF
              </Button>
              <Button
                startIcon={<TableIcon />}
                onClick={() => handleGenerateReport('Excel')}
                variant="outlined"
                size="small"
              >
                Exportar Excel
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6} sx={{ width: '50%' }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Distribuição de Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {distribuicaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleGenerateReport('Status')}
                variant="outlined"
                size="small"
              >
                Gerar Relatório
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Gráfico de Linha */}
        <Grid item xs={12} md={6} sx={{ width: '50%' }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Desempenho Mensal
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={desempenhoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="processos"
                    stroke="#1976d2"
                    name="Processos Recebidos"
                  />
                  <Line
                    type="monotone"
                    dataKey="conclusoes"
                    stroke="#2e7d32"
                    name="Processos Concluídos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<PdfIcon />}
                onClick={() => handleGenerateReport('Desempenho')}
                variant="outlined"
                size="small"
              >
                Relatório Detalhado
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;
