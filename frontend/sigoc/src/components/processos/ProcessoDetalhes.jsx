// src/components/processos/ProcessoDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
    Button,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    Alert,
    Breadcrumbs,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Assignment as AssignmentIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Flag as FlagIcon,
    Label as LabelIcon
} from '@mui/icons-material';
// import { format } from 'date-fns';
// import { ptBR } from 'date-fns/locale';
import api from '../../services/api';
import ProcessoTreeNode from './ProcessoTreeNode';

const ProcessoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [processo, setProcesso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchProcessoTree = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/processos/${id}/arvore/`);
                setProcesso(response.data);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar árvore:', err);
                setError('Não foi possível carregar os dados do processo. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchProcessoTree();
    }, [id]);



    // const formatDate = (dateString) => {
    //     if (!dateString) return 'Não informado';
    //     try {
    //         return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    //     } catch (e) {
    //         { { console.log(e) } }
    //         return 'Data inválida';
    //     }
    // };

    // const getPrioridadeColor = (prioridade) => {
    //     switch (prioridade?.toLowerCase()) {
    //         case 'alta':
    //             return 'error';
    //         case 'normal':
    //             return 'primary';
    //         case 'baixa':
    //             return 'success';
    //         default:
    //             return 'default';
    //     }
    // };

    // const getStatusColor = (situacao) => {
    //     switch (situacao?.nome?.toLowerCase()) {
    //         case 'em andamento':
    //             return 'primary';
    //         case 'concluído':
    //             return 'success';
    //         case 'pendente':
    //             return 'warning';
    //         case 'atrasado':
    //             return 'error';
    //         default:
    //             return 'default';
    //     }
    // };

    const handleBackToList = () => {
        navigate('/processos');
    };

    const handleEdit = () => {
        navigate(`/processos/${id}/editar`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToList}
                    sx={{ mt: 2 }}
                >
                    Voltar para a lista
                </Button>
            </Box>
        );
    }

    if (!processo) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="info">Processo não encontrado</Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToList}
                    sx={{ mt: 2 }}
                >
                    Voltar para a lista
                </Button>
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ mb: 4 }}>
                    {/* Breadcrumbs */}
                    <Breadcrumbs sx={{ mb: 2 }}>
                        <Link color="inherit" href="#" onClick={() => navigate('/')}>
                            Início
                        </Link>
                        <Link color="inherit" href="#" onClick={() => navigate('/processos')}>
                            Processos
                        </Link>
                        <Typography color="text.primary">Detalhes do Processo #{processo.id}</Typography>
                    </Breadcrumbs>

                    {/* Cabeçalho */}
                    {/* <Paper
                        sx={{
                            p: 3,
                            mb: 3,
                            borderLeft: (theme) => `5px solid ${theme.palette.primary.main}`,
                            boxShadow: 2
                        }}
                    >
                        <Grid container spacing={2}>
                            
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                        {processo.assunto}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <Chip
                                        label={processo.situacao?.nome || 'Não definido'}
                                        color={getStatusColor(processo.situacao)}
                                        size="small"
                                    />
                                    <Chip
                                        label={`Prioridade: ${processo.prioridade || 'Não definida'}`}
                                        color={getPrioridadeColor(processo.prioridade)}
                                        size="small"
                                        icon={<FlagIcon />}
                                    />
                                    <Chip
                                        label={processo.tipo_processo?.nome || 'Tipo não definido'}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Identificador:</strong> {processo.identificador}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Número SEI:</strong> {processo.numero_sei || 'Não informado'}
                                </Typography>
                                {processo.numero_processo_externo && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Processo Externo:</strong> {processo.numero_processo_externo}
                                    </Typography>
                                )}
                            </Grid>


                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Órgão Demandante:</strong> {processo.orgao_demandante || 'Não informado'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Data de Criação:</strong> {formatDate(processo.data_criacao)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        <strong>Última Atualização:</strong> {formatDate(processo.data_atualizacao)}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                        sx={{ mt: 2 }}
                                    >
                                        Editar Processo
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper> */}

                    <Grid container spacing={3}>
                        {/* Informações principais */}
                        {/* <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader
                                    title="Informações Principais"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" width="40%">Categoria</TableCell>
                                                    <TableCell>{processo.categoria?.nome || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Tipo</TableCell>
                                                    <TableCell>{processo.tipo || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Tipo de Processo</TableCell>
                                                    <TableCell>{processo.tipo_processo?.nome || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Situação</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={processo.situacao?.nome || 'Não definido'}
                                                            color={getStatusColor(processo.situacao)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Atribuição</TableCell>
                                                    <TableCell>{processo.atribuicao?.nome || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Ano de Solicitação</TableCell>
                                                    <TableCell>{processo.ano_solicitacao || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Correlação LAR</TableCell>
                                                    <TableCell>{processo.correlacao_lar ? 'Sim' : 'Não'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Reiterado</TableCell>
                                                    <TableCell>{processo.reiterado === 'sim' ? 'Sim' : 'Não'}</TableCell>
                                                </TableRow>
                                                {processo.reiterado === 'sim' && processo.data_reiteracao && (
                                                    <TableRow>
                                                        <TableCell component="th">Data de Reiteração</TableCell>
                                                        <TableCell>{formatDate(processo.data_reiteracao)}</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid> */}

                        {/* Prazos e Datas */}
                        {/* <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader
                                    title="Prazos e Datas"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    avatar={<AccessTimeIcon />}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" width="40%">Data de Criação</TableCell>
                                                    <TableCell>{formatDate(processo.data_criacao)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Última Atualização</TableCell>
                                                    <TableCell>{formatDate(processo.data_atualizacao)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Prazo Inicial</TableCell>
                                                    <TableCell>{formatDate(processo.prazo_inicial)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Prazo (Final)</TableCell>
                                                    <TableCell>{formatDate(processo.prazo)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Data de Resposta</TableCell>
                                                    <TableCell>{formatDate(processo.data_resposta)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Data de Envio da Resposta</TableCell>
                                                    <TableCell>{formatDate(processo.data_envio_resposta)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid> */}

                        {/* Responsáveis */}
                        {/* <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader
                                    title="Responsáveis"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    avatar={<PersonIcon />}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Auditores Responsáveis:</Typography>
                                    {processo.auditores_responsaveis && processo.auditores_responsaveis.length > 0 ? (
                                        <Box sx={{ ml: 2 }}>
                                            {processo.auditores_responsaveis.map((auditor) => (
                                                <Typography key={auditor.id} variant="body2" sx={{ mb: 0.5 }}>
                                                    • {auditor.nome}
                                                    {auditor.email && ` - ${auditor.email}`}
                                                    {auditor.telefone && ` - ${auditor.telefone}`}
                                                </Typography>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum auditor responsável atribuído.
                                        </Typography>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Unidades Auditadas:</Typography>
                                    {processo.unidade_auditada && processo.unidade_auditada.length > 0 ? (
                                        <Box sx={{ ml: 2 }}>
                                            {processo.unidade_auditada.map((unidade) => (
                                                <Typography key={unidade.id} variant="body2" sx={{ mb: 0.5 }}>
                                                    • {unidade.nome}
                                                </Typography>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhuma unidade auditada atribuída.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid> */}

                        {/* Documentos e Números */}
                        {/* <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader
                                    title="Documentos e Referências"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    avatar={<AssignmentIcon />}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" width="40%">Número SEI</TableCell>
                                                    <TableCell>{processo.numero_sei || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Número SEI da Resposta</TableCell>
                                                    <TableCell>{processo.numero_sei_resposta || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Número do Processo Externo</TableCell>
                                                    <TableCell>{processo.numero_processo_externo || 'Não informado'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th">Documento de Resposta</TableCell>
                                                    <TableCell>{processo.documento_resposta || 'Não informado'}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid> */}

                        {/* Detalhes e Informações Adicionais */}
                        {/* <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title="Detalhes e Informações Adicionais"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    {processo.tag && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <LabelIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Tags:
                                            </Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2">{processo.tag}</Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.descricao && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Descrição:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {processo.descricao}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.observacao && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Observações:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {processo.observacao}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.achados && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Achados:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {processo.achados}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.identificacao_achados && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Identificação de Achados:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {processo.identificacao_achados}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.resultado_pretendido && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Resultado Pretendido:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {processo.resultado_pretendido}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}

                                    {processo.local_execucao && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" gutterBottom>Local de Execução:</Typography>
                                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="body2">{processo.local_execucao}</Typography>
                                            </Paper>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid> */}

                        {/* Processos Filhos */}
                        <Grid item xs={12}>
                            <Card>
                                {/* <CardHeader
                                    title="Árvore de Processos Vinculados"
                                    titleTypographyProps={{ variant: 'h6' }}
                                    sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
                                /> */}
                                <CardContent>
                                    {processo ? (
                                        <ProcessoTreeNode processo={processo} />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhuma informação disponível para o processo.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBackToList}
                        >
                            Voltar para a lista
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                        >
                            Editar Processo
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProcessoDetail;
