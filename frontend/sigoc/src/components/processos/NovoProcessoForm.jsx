import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    MenuItem,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Alert,
    CircularProgress,
    InputLabel,
    Select,
    FormControl,
    Autocomplete,
    Chip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "/src/services/api"; // seu serviço de API

const camposObrigatorios = {
    recomendacao: [
        "assunto",
        "situacao",
        "prioridade",
        "unidade_auditada",
        "prazo_inicial",
        "solicitacao_prorrogacao",
    ],
    determinacao: [
        "assunto",
        "situacao",
        "prioridade",
        "unidade_auditada",
        "prazo_inicial",
        "solicitacao_prorrogacao",
    ],
    acao: [
        "assunto",
        "situacao",
        "prioridade",
        "area_demandada",
        "prazo_inicial",
        "duracao_execucao",
        "forma_execucao",
        "resultado_pretendido",
    ],
    processo: [
        "assunto",
        "situacao",
        "prioridade",
        "tipo_processo",
        "numero_sei",
        "orgao_demandante",
        "numero_processo_externo",
        "ano_solicitacao",
    ],
};

const tiposProcesso = [
    { value: "processo", label: "Processo (Raiz)" },
    { value: "acordao", label: "Acórdão" },
    { value: "recomendacao", label: "Recomendação" },
    { value: "determinacao", label: "Determinação" },
    { value: "acao", label: "Ação" },
];


function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

const NovoProcessoForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [situacoes, setSituacoes] = useState([]);
    const [tiposProcessos, setTiposProcessos] = useState([]);
    const [orgaos, setOrgaos] = useState([]);
    const [anos, setAnos] = useState([]);
    const areasDemandadas = [];
    const [podeSelecionarPai, setPodeSelecionarPai] = useState(false);
    const [processosPai, setProcessosPai] = useState([]);

    // ----- BUSCA ASSÍNCRONA CAMPOS UNIDADE AUDITADA E ATRIBUIÇÃO -----
    // Unidade auditada - múltipla
    const [uaOptions, setUaOptions] = useState([]);
    const [uaLoading, setUaLoading] = useState(false);
    const [uaInput, setUaInput] = useState("");

    // Unidade de atribuição - única
    const [atrOptions, setAtrOptions] = useState([]);
    const [atrLoading, setAtrLoading] = useState(false);
    const [atrInput, setAtrInput] = useState("");


    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const tipoSelecionado = watch("tipo");

    // useEffect(() => {
    //     api.get('/areas-demandadas/').then(res => setAreasDemandadas(res.data.results || []));
    // }, []);

    // ------------ CAMPOS FIXOS (veja seu original) ------------
    useEffect(() => {
        api.get("/situacoes/").then((r) => setSituacoes(r.data.results || []));
        api.get("/tipos-processo/").then((r) => setTiposProcessos(r.data.results || []));
        setOrgaos([
            { value: "TCU", label: "TCU" },
            { value: "CGU", label: "CGU" },
            { value: "AUDGER", label: "AUDGER" },
            { value: "MD", label: "Ministério da Defesa" },
            { value: "OUTROS", label: "Outros" }
        ]);
        const now = new Date().getFullYear();
        setAnos(Array.from({ length: 10 }, (_, i) => now - i));
    }, []);

    const debouncedFetchUa = useMemo(() =>
        debounce(async (input) => {
            if (!input || input.length < 2) {
                setUaOptions([]);
                setUaLoading(false);
                return;
            }
            setUaLoading(true);
            try {
                const resp = await api.get(`/unidades/?search=${encodeURIComponent(input)}`);
                setUaOptions(resp.data.results || []);
            } catch (error) {
                console.error("Falha na busca de unidades:", error);
                setUaOptions([]);
            }
            setUaLoading(false);
        }, 400),
        []
    );

    const fetchUa = useCallback(
        (input) => debouncedFetchUa(input),
        [debouncedFetchUa]
    );


    // Busca única (atribuição)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchAtr = useCallback(
        debounce(async (input) => {
            if (!input || input.length < 2) { setAtrOptions([]); setAtrLoading(false); return; }
            setAtrLoading(true);
            try {
                const resp = await api.get(`/unidades/?search=${encodeURIComponent(input)}`);
                setAtrOptions(resp.data.results || []);
            } catch { setAtrOptions([]); }
            setAtrLoading(false);
        }, 400),
        [api] // inclua api porque você está usando dentro do hook
    );

    useEffect(() => { fetchUa(uaInput); }, [uaInput, fetchUa]);
    useEffect(() => { fetchAtr(atrInput); }, [atrInput, fetchAtr]);


    // --- Carregar opções de processos pai compatíveis de acordo com o tipo ---
    useEffect(() => {
        if (["recomendacao", "determinacao"].includes(tipoSelecionado)) {
            api.get("/processos/?tipo=acordao").then((r) => setProcessosPai(r.data.results || []));
            setPodeSelecionarPai(true);
        } else if (tipoSelecionado === "acao") {
            api.get("/processos/?tipo=determinacao").then((r) => setProcessosPai(r.data.results || []));
            setPodeSelecionarPai(true);
        } else if (tipoSelecionado === "acordao") {
            api.get("/processos/?tipo=processo").then((r) => setProcessosPai(r.data.results || []));
            setPodeSelecionarPai(true);
        } else {
            setProcessosPai([]);
            setPodeSelecionarPai(false);
            setValue("pai", "");
        }
    }, [tipoSelecionado, setValue]);

    // --- REGRAS DE OBRIGATORIEDADE ---

    const isCampoObrigatorio = (field) => {
        if (!tipoSelecionado) return false;
        const requiredFields = camposObrigatorios[tipoSelecionado] || [];
        return requiredFields.some(f => f === field || f.startsWith(`${field}.`));
    };

    // --- FORM SUBMIT ---
    const onSubmit = async (data) => {
        setLoading(true);
        setApiError(null);
        try {
            const dadosFormatados = { ...data };
            if (dadosFormatados.unidade_auditada && Array.isArray(dadosFormatados.unidade_auditada)) {
                dadosFormatados.unidade_auditada = dadosFormatados.unidade_auditada.map(u => u.id);
            }
            if (dadosFormatados.atribuicao && typeof dadosFormatados.atribuicao === "object") {
                dadosFormatados.atribuicao = dadosFormatados.atribuicao.id;
            }
            if (dadosFormatados.area_demandada && typeof dadosFormatados.area_demandada === 'object') {
                dadosFormatados.area_demandada = dadosFormatados.area_demandada.id;
            }
            await api.post("/processos/", dadosFormatados);
            navigate("/processos");
        } catch (err) {
            let errorMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde.";

            if (err.response) {
                switch (err.response.status) {
                    case 400: {
                        const errorMessages = Object.entries(err.response.data).map(([field, errors]) =>
                            `${field}: ${errors.join(", ")}`
                        ).join("; ");
                        errorMessage = `Erro de validação: ${errorMessages}`;
                        break;
                    }
                    case 401:
                        errorMessage = "Não autorizado. Faça login novamente.";
                        break;
                    case 403:
                        errorMessage = "Acesso proibido. Você não tem permissão para realizar esta ação.";
                        break;
                    case 404:
                        errorMessage = "Recurso não encontrado. Verifique os dados enviados.";
                        break;
                    case 500:
                        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
                        break;
                    default:
                        errorMessage = err.response.data.detail || "Ocorreu um erro inesperado. Tente novamente mais tarde.";
                }
            }

            setApiError(errorMessage);
        } finally {
            setLoading(false);
        }
    };



    // --- RENDERIZAÇÃO ---
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Novo Processo
                </Typography>

                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {/* Tipo */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="tipo"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Tipo de Processo"
                                        fullWidth
                                        required
                                        error={!!errors.tipo}
                                        helperText={errors.tipo && "Obrigatório"}
                                        sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                    >
                                        {tiposProcesso.map((op) => (
                                            <MenuItem key={op.value} value={op.value}>
                                                {op.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Pai (apenas para filhos permitidos) */}
                        {podeSelecionarPai && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="pai"
                                    control={control}
                                    defaultValue={null}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Processo Pai"
                                            required
                                            fullWidth
                                            error={!!errors.pai}
                                            helperText={errors.pai && "Obrigatório"}
                                            sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                        >
                                            {processosPai.map((p) => (
                                                <MenuItem key={p.id} value={p.id}>
                                                    #{p.identificador} - {p.assunto}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        )}

                        {/* Assunto */}
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <Controller
                                name="assunto"
                                control={control}
                                defaultValue={null}
                                rules={{ required: isCampoObrigatorio("assunto") }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Assunto"
                                        required={isCampoObrigatorio("assunto")}
                                        fullWidth
                                        error={!!errors.assunto}
                                        helperText={
                                            errors.assunto && "Campo obrigatório"
                                        }
                                        sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                    />
                                )}
                            />
                        </Grid>

                        {/* Situação */}
                        <Grid item xs={6} sm={6} md={4}>
                            <Controller
                                name="situacao"
                                control={control}
                                defaultValue=""
                                rules={{ required: isCampoObrigatorio("situacao") }}
                                render={({ field }) => (
                                    <FormControl fullWidth required={isCampoObrigatorio("situacao")}>
                                        <InputLabel>Situação</InputLabel>
                                        <Select
                                            {...field}
                                            label="Situação"
                                            error={!!errors.situacao}
                                            sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                        >
                                            {situacoes.map((s) => (
                                                <MenuItem key={s.id} value={s.id}>
                                                    {s.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Prioridade */}
                        <Grid item xs={6} sm={6} md={4}>
                            <Controller
                                name="prioridade"
                                control={control}
                                defaultValue=""
                                rules={{ required: isCampoObrigatorio("prioridade") }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Prioridade"
                                        required={isCampoObrigatorio("prioridade")}
                                        fullWidth
                                        error={!!errors.prioridade}
                                        helperText={
                                            errors.prioridade && "Campo obrigatório"
                                        }
                                        sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                    >
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="alta">Alta</MenuItem>
                                        <MenuItem value="urgente">Urgente</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Unidade Auditada - SELEÇÃO MÚLTIPLA */}
                        {/* <Grid item xs={12} style={{ width: "100%" }}>
                            <Controller
                                name="unidade_auditada"
                                control={control}
                                defaultValue={[]}
                                rules={{ required: isCampoObrigatorio("unidade_auditada") }}
                                render={({ field: { onChange, value, ...field } }) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={unidades}
                                        getOptionLabel={(option) => option.nome || ""}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={value || []}
                                        onChange={(_, newValue) => {
                                            onChange(newValue);
                                        }}
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => (
                                                <Chip
                                                    label={option.nome}
                                                    {...getTagProps({ index })}
                                                    key={option.id}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Unidade Auditada"
                                                required={isCampoObrigatorio("unidade_auditada")}
                                                error={!!errors.unidade_auditada}
                                                helperText={errors.unidade_auditada && "Campo obrigatório"}
                                                placeholder="Selecione as unidades"
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid> */}

                        {/* Unidade Auditada - SELEÇÃO MÚLTIPLA */}
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <Controller
                                name="unidade_auditada"
                                control={control}
                                defaultValue={[]} // Garantir que sempre é um array
                                rules={{ required: isCampoObrigatorio("unidade_auditada") }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        filterSelectedOptions
                                        options={uaOptions}
                                        loading={uaLoading}
                                        value={field.value || []} // Garantir que nunca seja undefined
                                        getOptionLabel={(option) => option?.nome || ""}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        onInputChange={(_event, newInput) => setUaInput(newInput)}
                                        onChange={(_, newValue) => field.onChange(newValue || [])}
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => (
                                                <Chip label={option?.nome} {...getTagProps({ index })} key={option?.id} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Unidade Auditada"
                                                required={isCampoObrigatorio("unidade_auditada")}
                                                error={!!errors.unidade_auditada}
                                                helperText={errors.unidade_auditada && "Campo obrigatório"}
                                                placeholder="Digite para buscar (mín. 2 letras)"
                                                fullWidth
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {uaLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>


                        {/* Unidade de Atribuição - SELEÇÃO ÚNICA COM AUTOCOMPLETE */}
                        {/* <Grid item xs={12} style={{ width: "100%" }}>
                            <Controller
                                name="atribuicao"
                                control={control}
                                defaultValue={null}
                                rules={{ required: isCampoObrigatorio("atribuicao") }}
                                render={({ field: { onChange, value, ...field } }) => (
                                    <Autocomplete
                                        {...field}
                                        options={unidades}
                                        getOptionLabel={(option) => option.nome || ""}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={value}
                                        onChange={(_, newValue) => {
                                            onChange(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Unidade de Atribuição"
                                                required={isCampoObrigatorio("atribuicao")}
                                                error={!!errors.atribuicao}
                                                helperText={errors.atribuicao && "Campo obrigatório"}
                                                placeholder="Selecione uma unidade"
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid> */}


                        {/* ATRIBUIÇÃO (autocomplete assíncrono e único) */}
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <Controller
                                name="atribuicao"
                                control={control}
                                defaultValue={null} // Use null em vez de string vazia ""
                                rules={{ required: isCampoObrigatorio("atribuicao") }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={atrOptions}
                                        loading={atrLoading}
                                        getOptionLabel={(option) => option?.nome || ""}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        inputValue={atrInput}
                                        onInputChange={(_event, newInput) => setAtrInput(newInput)}
                                        value={field.value} // Usar field.value diretamente
                                        onChange={(_, newValue) => field.onChange(newValue)} // Não precisamos verificar null aqui
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Unidade de Atribuição"
                                                required={isCampoObrigatorio("atribuicao")}
                                                error={!!errors.atribuicao}
                                                helperText={errors.atribuicao && "Campo obrigatório"}
                                                placeholder="Digite para buscar (mín. 2 letras)"
                                                fullWidth
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {atrLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>





                        {/* Área Demandada */}
                        {tipoSelecionado === "acao" && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="area_demandada"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Área Demandada"
                                            fullWidth
                                            required
                                            error={!!errors.area_demandada}
                                            helperText={
                                                errors.area_demandada && "Campo obrigatório"
                                            }
                                            sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                        >
                                            {areasDemandadas.map((a) => (
                                                <MenuItem key={a.id} value={a.id}>
                                                    {a.nome}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        )}

                        {/* Prazo Inicial */}
                        {(tipoSelecionado === "recomendacao" ||
                            tipoSelecionado === "determinacao" ||
                            tipoSelecionado === "acao") && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="prazo_inicial"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Prazo Inicial"
                                                required
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                error={!!errors.prazo_inicial}
                                                helperText={
                                                    errors.prazo_inicial && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                            )}

                        {/* Solicitação de Prorrogação */}
                        {(tipoSelecionado === "recomendacao" ||
                            tipoSelecionado === "determinacao") && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="solicitacao_prorrogacao"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: isCampoObrigatorio("solicitacao_prorrogacao") }}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={!!field.value}
                                                    />
                                                }
                                                label="Solicitação de Prorrogação"
                                            />
                                        )}
                                    />
                                </Grid>
                            )}

                        {/* Duração Execução, Forma Execução, Resultado Pretendido */}
                        {tipoSelecionado === "acao" && (
                            <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="duracao_execucao"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: isCampoObrigatorio("duracao_execucao") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Duração da Execução (dias)"
                                                type="number"
                                                required
                                                fullWidth
                                                error={!!errors.duracao_execucao}
                                                helperText={
                                                    errors.duracao_execucao && "Campo obrigatório (em dias)"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="forma_execucao"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: isCampoObrigatorio("forma_execucao") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Forma de Execução"
                                                required
                                                fullWidth
                                                error={!!errors.forma_execucao}
                                                helperText={
                                                    errors.forma_execucao && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="resultado_pretendido"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: isCampoObrigatorio("resultado_pretendido") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Resultado Pretendido"
                                                required
                                                fullWidth
                                                error={!!errors.resultado_pretendido}
                                                helperText={
                                                    errors.resultado_pretendido && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Campos obrigatórios para Processo raiz ("processo") */}
                        {tipoSelecionado === "processo" && (
                            <>
                                {/* Tipo Processo */}
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="tipo_processo"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: isCampoObrigatorio("tipo_processo") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Tipo do Processo"
                                                required
                                                fullWidth
                                                error={!!errors.tipo_processo}
                                                helperText={
                                                    errors.tipo_processo && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            >
                                                {tiposProcessos.map((tp) => (
                                                    <MenuItem key={tp.id} value={tp.id}>
                                                        {tp.nome}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                {/* Número Sei, Número Processo Externo, Orgão Demandante, Ano Solicitação */}
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="numero_sei"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: isCampoObrigatorio("numero_sei") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Número SEI"
                                                required
                                                fullWidth
                                                error={!!errors.numero_sei}
                                                helperText={
                                                    errors.numero_sei && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="numero_processo_externo"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: isCampoObrigatorio("numero_processo_externo") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Número Processo Externo"
                                                required
                                                fullWidth
                                                error={!!errors.numero_processo_externo}
                                                helperText={
                                                    errors.numero_processo_externo &&
                                                    "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="orgao_demandante"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: isCampoObrigatorio("orgao_demandante") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Órgão Demandante"
                                                required
                                                fullWidth
                                                error={!!errors.orgao_demandante}
                                                helperText={
                                                    errors.orgao_demandante && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            >
                                                {orgaos.map((o) => (
                                                    <MenuItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="ano_solicitacao"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: isCampoObrigatorio("ano_solicitacao") }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Ano da Solicitação"
                                                required
                                                fullWidth
                                                error={!!errors.ano_solicitacao}
                                                helperText={
                                                    errors.ano_solicitacao && "Campo obrigatório"
                                                }
                                                sx={{ minWidth: 300 }} // Aumenta a largura mínima
                                            >
                                                {anos.map((ano) => (
                                                    <MenuItem key={ano} value={ano}>
                                                        {ano}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            size="large"
                            disabled={loading}
                            startIcon={
                                loading ? <CircularProgress size={18} color="inherit" /> : null
                            }
                        >
                            Salvar
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ ml: 2 }}
                            onClick={() => navigate("/processos")}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default NovoProcessoForm;
