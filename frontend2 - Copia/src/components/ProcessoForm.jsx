import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Divider,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Autocomplete,
} from '@mui/material';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br'; // Importe o locale desejado

//import ptBR from 'date-fns/locale/pt-BR';

import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import api from "../services/api";

const ProcessoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Estados para formulário
  const [formData, setFormData] = useState({
    pai: null,
    tipo: null,
    assunto: '',
    prioridade: '',
    numero_sei: '',
    orgao_demandante: null,
    numero_processo_externo: '',
    ano_solicitacao: new Date().getFullYear(),
    correlacao_lar: false,
    tag: '',
    descricao: '',
    observacao: '',
    prazo: null,
    data_resposta: null,
    numero_sei_resposta: '',
    data_envio_resposta: null,
    reiterado: false,
    data_reiteracao: null,
    identificacao_achados: '',
    documento_resposta: '',
    prazo_inicial: null,
    local_execucao: '',
    duracao_execucao: null,
    forma_execucao: '',
    resultado_pretendido: '',
    achados: ''
  });

  // Estados para opções de select
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [orgaosDemandantes, setOrgaosDemandantes] = useState([]);
  const prioridades = ['Alta', 'Média', 'Baixa'];
  const [processosPai, setProcessosPai] = useState([]);

  // Estados para controle de UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Carregar dados para edição
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar tipos de processo
        const tiposResponse = await api.get('/tipos-processo/');
        setTiposProcesso(tiposResponse.data.results || []);

        // Buscar órgãos demandantes (unidades)
        const unidadesResponse = await api.get('/unidades/');
        setOrgaosDemandantes(unidadesResponse.data.results || []);

        // Buscar processos pai
        const processosResponse = await api.get('/processos/');
        setProcessosPai(processosResponse.data.results || []);

        // Se estiver editando, carregar dados do processo
        if (isEditing) {
          const processoResponse = await api.get(`/processos/${id}/`);
          setFormData(prev => ({
            ...prev,
            ...processoResponse.data
          }));
        }

        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar dados necessários para o formulário.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  // Manipular mudanças nos campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro do campo se existir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manipular mudanças em campos de data
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));

    // Limpar erro do campo se existir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manipular mudanças em campos de seleção
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo se existir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const errors = {};

    if (!formData.assunto.trim()) {
      errors.assunto = 'O assunto é obrigatório';
    }

    if (!formData.tipo) {
      errors.tipo = 'O tipo de processo é obrigatório';
    }

    return errors;
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulário
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/processos/${id}/`, formData);
      } else {
        await api.post('/processos/', formData);
      }

      // Redirecionar para a lista de processos com mensagem de sucesso
      navigate('/processos', {
        state: {
          success: true,
          message: `Processo ${isEditing ? 'atualizado' : 'criado'} com sucesso!`
        }
      });
    } catch (err) {
      console.error('Erro ao salvar processo:', err);
      setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} o processo. Verifique os dados e tente novamente.`);

      // Se o erro contiver erros de validação da API
      if (err.response && err.response.data) {
        setFormErrors(prev => ({
          ...prev,
          ...err.response.data
        }));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          color="inherit"
          component="button"
          underline="hover"
          onClick={() => navigate('/')}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          component="button"
          underline="hover"
          onClick={() => navigate('/processos')}
        >
          Processos
        </Link>
        <Typography color="text.primary">
          {isEditing ? 'Editar Processo' : 'Novo Processo'}
        </Typography>
      </Breadcrumbs>

      {/* Cabeçalho com título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          color="primary"
          aria-label="voltar"
          onClick={() => navigate('/processos')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {isEditing ? 'Editar Processo' : 'Novo Processo'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            {/* Informações Básicas */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações Básicas
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  error={!!formErrors.assunto}
                  helperText={formErrors.assunto}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.tipo}>
                  <InputLabel id="tipo-label">Tipo de Processo</InputLabel>
                  <Select
                    labelId="tipo-label"
                    name="tipo"
                    value={formData.tipo || ''}
                    onChange={(e) => handleSelectChange('tipo', e.target.value)}
                    label="Tipo de Processo"
                    required
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
                    {tiposProcesso.map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.tipo && (
                    <FormHelperText>{formErrors.tipo}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número SEI"
                  name="numero_sei"
                  value={formData.numero_sei}
                  onChange={handleChange}
                  error={!!formErrors.numero_sei}
                  helperText={formErrors.numero_sei}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.orgao_demandante}>
                  <InputLabel id="orgao-label">Órgão Demandante</InputLabel>
                  <Select
                    labelId="orgao-label"
                    name="orgao_demandante"
                    value={formData.orgao_demandante || ''}
                    onChange={(e) => handleSelectChange('orgao_demandante', e.target.value)}
                    label="Órgão Demandante"
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
                    {orgaosDemandantes.map((orgao) => (
                      <MenuItem key={orgao.id} value={orgao.id}>
                        {orgao.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.orgao_demandante && (
                    <FormHelperText>{formErrors.orgao_demandante}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.prioridade}>
                  <InputLabel id="prioridade-label">Prioridade</InputLabel>
                  <Select
                    labelId="prioridade-label"
                    name="prioridade"
                    value={formData.prioridade || ''}
                    onChange={handleChange}
                    label="Prioridade"
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
                    {prioridades.map((prioridade) => (
                      <MenuItem key={prioridade} value={prioridade}>
                        {prioridade}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.prioridade && (
                    <FormHelperText>{formErrors.prioridade}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ano de Solicitação"
                  name="ano_solicitacao"
                  type="number"
                  value={formData.ano_solicitacao || ''}
                  onChange={handleChange}
                  error={!!formErrors.ano_solicitacao}
                  helperText={formErrors.ano_solicitacao}
                  InputProps={{ inputProps: { min: 2000, max: 2100 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.pai}>
                  <Autocomplete
                    id="processo-pai"
                    options={processosPai}
                    getOptionLabel={(option) => option.assunto || ''}
                    value={processosPai.find(p => p.id === formData.pai) || null}
                    onChange={(e, newValue) => handleSelectChange('pai', newValue?.id || null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Processo Pai"
                        error={!!formErrors.pai}
                        helperText={formErrors.pai}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Prazo"
                  value={formData.prazo}
                  onChange={(date) => handleDateChange('prazo', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.prazo}
                      helperText={formErrors.prazo}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número Processo Externo"
                  name="numero_processo_externo"
                  value={formData.numero_processo_externo}
                  onChange={handleChange}
                  error={!!formErrors.numero_processo_externo}
                  helperText={formErrors.numero_processo_externo}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.correlacao_lar}
                      onChange={handleChange}
                      name="correlacao_lar"
                    />
                  }
                  label="Correlação LAR"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Descrição e Observações */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Descrição e Observações
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  multiline
                  rows={4}
                  value={formData.descricao}
                  onChange={handleChange}
                  error={!!formErrors.descricao}
                  helperText={formErrors.descricao}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observação"
                  name="observacao"
                  multiline
                  rows={3}
                  value={formData.observacao}
                  onChange={handleChange}
                  error={!!formErrors.observacao}
                  helperText={formErrors.observacao}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  error={!!formErrors.tag}
                  helperText={formErrors.tag || "Separe as tags por vírgula"}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Informações de Resposta */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações de Resposta
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data de Resposta"
                  value={formData.data_resposta}
                  onChange={(date) => handleDateChange('data_resposta', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.data_resposta}
                      helperText={formErrors.data_resposta}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número SEI da Resposta"
                  name="numero_sei_resposta"
                  value={formData.numero_sei_resposta}
                  onChange={handleChange}
                  error={!!formErrors.numero_sei_resposta}
                  helperText={formErrors.numero_sei_resposta}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data de Envio da Resposta"
                  value={formData.data_envio_resposta}
                  onChange={(date) => handleDateChange('data_envio_resposta', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.data_envio_resposta}
                      helperText={formErrors.data_envio_resposta}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.reiterado}
                      onChange={handleChange}
                      name="reiterado"
                    />
                  }
                  label="Reiterado"
                />
              </Grid>

              {formData.reiterado && (
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data de Reiteração"
                    value={formData.data_reiteracao}
                    onChange={(date) => handleDateChange('data_reiteracao', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.data_reiteracao}
                        helperText={formErrors.data_reiteracao}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Documento de Resposta"
                  name="documento_resposta"
                  multiline
                  rows={2}
                  value={formData.documento_resposta}
                  onChange={handleChange}
                  error={!!formErrors.documento_resposta}
                  helperText={formErrors.documento_resposta}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Informações de Execução */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações de Execução
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Local de Execução"
                  name="local_execucao"
                  value={formData.local_execucao}
                  onChange={handleChange}
                  error={!!formErrors.local_execucao}
                  helperText={formErrors.local_execucao}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duração da Execução (dias)"
                  name="duracao_execucao"
                  type="number"
                  value={formData.duracao_execucao || ''}
                  onChange={handleChange}
                  error={!!formErrors.duracao_execucao}
                  helperText={formErrors.duracao_execucao}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Forma de Execução"
                  name="forma_execucao"
                  multiline
                  rows={2}
                  value={formData.forma_execucao}
                  onChange={handleChange}
                  error={!!formErrors.forma_execucao}
                  helperText={formErrors.forma_execucao}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resultado Pretendido"
                  name="resultado_pretendido"
                  multiline
                  rows={2}
                  value={formData.resultado_pretendido}
                  onChange={handleChange}
                  error={!!formErrors.resultado_pretendido}
                  helperText={formErrors.resultado_pretendido}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Achados */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Achados
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Identificação de Achados"
                  name="identificacao_achados"
                  multiline
                  rows={3}
                  value={formData.identificacao_achados}
                  onChange={handleChange}
                  error={!!formErrors.identificacao_achados}
                  helperText={formErrors.identificacao_achados}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Achados"
                  name="achados"
                  multiline
                  rows={3}
                  value={formData.achados}
                  onChange={handleChange}
                  error={!!formErrors.achados}
                  helperText={formErrors.achados}
                />
              </Grid>
            </Grid>

            {/* Botões de ação */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/processos')}
                startIcon={<CloseIcon />}
                sx={{ mr: 2 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
              </Button>
            </Box>
          </LocalizationProvider>
        </form>
      </Paper>
    </>
  );
};

export default ProcessoForm;
