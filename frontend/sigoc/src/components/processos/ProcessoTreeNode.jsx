import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Stack,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    Edit as EditIcon,
    SyncAlt as SyncAltIcon,
    People as PeopleIcon,
    Email as EmailIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';



// Adicione este tema global no início do componente
const compactStyles = {
    typography: {
        fontSize: '0.875rem', // Reduz todas as fontes para ~14px
    },
    spacing: {
        unit: 0.5 // Reduz o espaçamento padrão
    }
};


const ProcessoTreeNode = ({ processo, nivel = 0 }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Não informado';
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } catch {
            return 'Data inválida';
        }
    };

    // Compacta informações em um único array
    const infoRows = [
        processo.atribuicao && { label: 'Atribuição', value: processo.atribuicao.nome },
        processo.orgao_demandante && { label: 'Órgão Demandante', value: processo.orgao_demandante },
        processo.ano_solicitacao && { label: 'Ano de Solicitação', value: processo.ano_solicitacao },
        processo.correlacao_lar !== undefined && { label: 'Correlação LAR', value: processo.correlacao_lar ? 'Sim' : 'Não' },
        processo.reiterado && { label: 'Reiterado', value: processo.reiterado === 'sim' ? 'Sim' : 'Não' },
        processo.reiterado === 'sim' && processo.data_reiteracao && { label: 'Data de Reiteração', value: formatDate(processo.data_reiteracao) },
        processo.data_criacao && { label: 'Data de Criação', value: formatDate(processo.data_criacao) },
        processo.data_atualizacao && { label: 'Última Atualização', value: formatDate(processo.data_atualizacao) },
        processo.prazo_inicial && { label: 'Prazo Inicial', value: formatDate(processo.prazo_inicial) },
        processo.prazo && { label: 'Prazo Final', value: formatDate(processo.prazo) },
        processo.data_resposta && { label: 'Data de Resposta', value: formatDate(processo.data_resposta) },
        processo.data_envio_resposta && { label: 'Data de Envio', value: formatDate(processo.data_envio_resposta) },
        processo.numero_sei_resposta && { label: 'Nº SEI da Resposta', value: processo.numero_sei_resposta },
        processo.documento_resposta && { label: 'Documento de Resposta', value: processo.documento_resposta },
    ].filter(Boolean);

    // Define cores para processos e subprocessos
    const getBackgroundColor = (level) => {
        return level % 2 === 0 ? '#f9f9f9' : '#e9e9e9'; // Cores neutras suaves alternadas
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper

                variant="outlined"
                sx={{
                    p: 1,
                    fontSize: compactStyles.typography.fontSize,
                    backgroundColor: getBackgroundColor(nivel), // Cor de fundo baseada no nível
                    borderLeft: (theme) => `5px solid ${theme.palette.primary.main}`,
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: 3 }
                }}
            >


                {/* Cabeçalho */}
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                    {/* Tipo em destaque com ícones à direita */}
                    {processo.tipo && (
                        <Box
                            sx={{
                                backgroundColor: '#1f5464',
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 1,
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {processo.tipo}
                            </Typography>
                            {/* Barra de Ferramentas com Tooltips */}
                            <Box sx={{ display: 'flex', ml: 'auto', pl: 1 }}>
                                <Tooltip title="Editar" placement="top">
                                    <IconButton aria-label="editar" size="small">
                                        <EditIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Alterar Situação" placement="top">
                                    <IconButton aria-label="alterar situação" size="small">
                                        <SyncAltIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Auditores" placement="top">
                                    <IconButton aria-label="auditores" size="small">
                                        <PeopleIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Notificar via E-mail" placement="top">
                                    <IconButton aria-label="notificar via e-mail" size="small">
                                        <EmailIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Histórico de Alterações" placement="top">
                                    <IconButton aria-label="histórico de alterações" size="small">
                                        <HistoryIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AssignmentIcon color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {processo.assunto}
                        </Typography>
                    </Box>
                </Box>




                {/* IDs e datas básicas */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>ID:</strong> {processo.identificador}
                    {processo.tipo && <span> &nbsp;|&nbsp; <strong>Tipo:</strong> {processo.tipo}</span>}
                    {processo.numero_sei && <span> &nbsp;|&nbsp; <strong>SEI:</strong> {processo.numero_sei}</span>}
                    {processo.numero_processo_externo && (
                        <span> &nbsp;|&nbsp; <strong>Proc. Externo:</strong> {processo.numero_processo_externo}</span>
                    )}
                    {processo.data_criacao && (
                        <span> &nbsp;|&nbsp; <strong>Criado em:</strong> {formatDate(processo.data_criacao)}</span>
                    )}
                </Typography>

                <Divider sx={{ my: 1.2 }} />

                {/* Grid Único de Informações */}
                <Table size="small" sx={{
                    mb: 1,
                    '& .MuiTableCell-root': {
                        px: 1,
                        py: 0.4, // padding Y reduzido
                        borderBottom: '1px solid #f0f0f0'
                    }
                }}>
                    <TableBody>
                        
                        {infoRows.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ width: 170, fontWeight: 500 }}>{row.label}</TableCell>
                                <span style={{ color: 'text.secondary' }}> {row.value}</span>
                            </TableRow>
                        ))}


                        {/* Auditores e Unidades compactados */}
                        {(processo.auditores_responsaveis?.length > 0 || processo.unidade_auditada?.length > 0) && (
                            <TableRow>
                                <TableCell sx={{ fontWeight: 500 }}>Responsáveis / Unidades</TableCell>
                                <TableCell>
                                    {/* Auditores */}
                                    {processo.auditores_responsaveis?.length > 0 && (
                                        <>
                                            <span style={{ fontWeight: 500 }}>Auditores: </span>
                                            {processo.auditores_responsaveis.map(a => `${a.nome}${a.email ? ` (${a.email})` : ''}`).join('; ')}
                                            <br />
                                        </>
                                    )}
                                    {/* Unidades */}
                                    {processo.unidade_auditada?.length > 0 && (
                                        <>
                                            <span style={{ fontWeight: 500 }}>Unidades: </span>
                                            {processo.unidade_auditada.map(u => u.nome).join('; ')}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Descrição e Observação */}
                {(processo.descricao || processo.observacao || processo.achados || processo.identificacao_achados) && (
                    <Box sx={{ mb: 1 }}>
                        {processo.descricao && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Descrição:</strong> {processo.descricao}
                            </Typography>
                        )}
                        {processo.observacao && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Observações:</strong> {processo.observacao}
                            </Typography>
                        )}
                        {processo.achados && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Achados:</strong> {processo.achados}
                            </Typography>
                        )}
                        {processo.identificacao_achados && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Identificação de Achados:</strong> {processo.identificacao_achados}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Subprocessos */}
                {processo.subprocessos?.length > 0 && (
                    <>
                        <Divider sx={{ mt: 2, mb: 1 }} />
                        <Box sx={{ pl: 1, pt: 1 }}>
                            {processo.subprocessos.map(sp => (
                                <ProcessoTreeNode key={sp.id} processo={sp} nivel={nivel + 1} />
                            ))}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ProcessoTreeNode;
