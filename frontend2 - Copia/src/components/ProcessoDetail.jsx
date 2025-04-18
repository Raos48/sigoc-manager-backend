import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Attachment as AttachmentIcon,
} from '@mui/icons-material';
import api from "../services/api";

const ProcessoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar detalhes do processo
  useEffect(() => {
    const fetchProcesso = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/processos/${id}/`);
        setProcesso(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar detalhes do processo:', err);
        setError('Não foi possível carregar os detalhes deste processo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProcesso();
  }, [id]);

  // Formatação de datas
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Renderizar status com cor apropriada
  const renderStatus = (situacao) => {
    if (!situacao) return <Chip label="Não definido" color="default" />;

    let color = "default";
    if (situacao.toLowerCase().includes("andamento")) color = "primary";
    if (situacao.toLowerCase().includes("concluído")) color = "success";
    if (situacao.toLowerCase().includes("atrasado")) color = "error";
    if (situacao.toLowerCase().includes("pendente")) color = "warning";

    return <Chip label={situacao} color={color} />;
  };

  // Renderizar prioridade com cor apropriada
  const renderPrioridade = (prioridade) => {
    if (!prioridade) return <Chip label="Não definida" color="default" />;

    let color = "info";
    if (prioridade.toLowerCase() === "alta") color = "error";
    if (prioridade.toLowerCase() === "média") color = "warning";

    return <Chip label={prioridade} color={color} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/processos')}
          >
            Voltar para a lista
          </Button>
        </Box>
      </Alert>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 2,
          backgroundColor: '#1976d2',
          padding: '10px 20px',
          borderRadius: '4px'
        }}
      >
        <Breadcrumbs
          sx={{
            '& .MuiBreadcrumbs-separator': {
              color: 'white'
            }
          }}
        >
          <Link
            sx={{
              color: 'white',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
            component="button"
            underline="hover"
            onClick={() => navigate('/')}
          >
            Dashboard
          </Link>
          <Link
            sx={{
              color: 'white',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
            component="button"
            underline="hover"
            onClick={() => navigate('/processos')}
          >
            Processos
          </Link>
          <Typography sx={{ color: 'white' }}>
            Detalhes do Processo
          </Typography>
        </Breadcrumbs>
      </Paper>

      {/* Cabeçalho com ações */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="primary"
            aria-label="voltar"
            onClick={() => navigate('/processos')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {processo?.assunto || 'Detalhes do Processo'}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/processos/${id}/editar`)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      {/* Informações do processo */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Número SEI
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.numero_sei || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Órgão Demandante
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.orgao_demandante?.nome || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.tipo?.nome || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Situação
            </Typography>
            <Box sx={{ mb: 2 }}>
              {renderStatus(processo?.situacao?.nome)}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Prioridade
            </Typography>
            <Box sx={{ mb: 2 }}>
              {renderPrioridade(processo?.prioridade)}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Prazo
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(processo?.prazo)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Ano de Solicitação
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.ano_solicitacao || '—'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Descrição
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {processo?.descricao || 'Sem descrição disponível.'}
        </Typography>

        {processo?.observacao && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Observações
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {processo.observacao}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Seção de informações adicionais */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Informações Adicionais
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Número Processo Externo
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.numero_processo_externo || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Correlação LAR
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.correlacao_lar ? 'Sim' : 'Não'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data Resposta
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(processo?.data_resposta)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Número SEI Resposta
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.numero_sei_resposta || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data Envio Resposta
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(processo?.data_envio_resposta)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Reiterado
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {processo?.reiterado ? 'Sim' : 'Não'}
            </Typography>
          </Grid>
          {processo?.reiterado && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Data Reiteração
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDate(processo?.data_reiteracao)}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Informações sobre execução */}
        {(processo?.local_execucao || processo?.duracao_execucao || processo?.forma_execucao) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações de Execução
            </Typography>
            <Grid container spacing={3}>
              {processo?.local_execucao && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Local de Execução
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {processo.local_execucao}
                  </Typography>
                </Grid>
              )}
              {processo?.duracao_execucao && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duração da Execução
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {processo.duracao_execucao} dias
                  </Typography>
                </Grid>
              )}
              {processo?.forma_execucao && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Forma de Execução
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {processo.forma_execucao}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* Resultado e achados */}
        {(processo?.resultado_pretendido || processo?.achados || processo?.identificacao_achados) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resultados e Achados
            </Typography>

            {processo?.resultado_pretendido && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resultado Pretendido
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {processo.resultado_pretendido}
                </Typography>
              </Box>
            )}

            {processo?.identificacao_achados && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Identificação de Achados
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {processo.identificacao_achados}
                </Typography>
              </Box>
            )}

            {processo?.achados && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Achados
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {processo.achados}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Abas de navegação para outras informações relacionadas */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<TimelineIcon />}
          sx={{ mx: 1 }}
          disabled
        >
          Histórico
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssignmentIcon />}
          sx={{ mx: 1 }}
          disabled
        >
          Atividades
        </Button>
        <Button
          variant="outlined"
          startIcon={<AttachmentIcon />}
          sx={{ mx: 1 }}
          disabled
        >
          Anexos
        </Button>
      </Box>
    </>
  );
};

export default ProcessoDetail;
