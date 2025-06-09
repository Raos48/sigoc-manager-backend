# seu_app/models.py

import uuid
import hashlib
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
from django.conf import settings
from django.utils import timezone
import json

# --- Validador de Ano (do seu modelo original) ---
def validate_year(value):
    current_year = datetime.now().year
    if value < 1900 or value > current_year + 5: # Aumentei a margem futura
        raise ValidationError(f'Ano deve estar entre 1900 e {current_year + 5}')

# --- Modelos Reintroduzidos (Conforme sua necessidade) ---

class GrupoAuditor(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    class Meta:
        verbose_name = 'Grupo de Auditores'
        verbose_name_plural = 'Grupos de Auditores'
    def __str__(self):
        return self.nome

class Auditor(models.Model):
    nome = models.CharField('Nome', max_length=100)
    grupo = models.ForeignKey(GrupoAuditor, on_delete=models.SET_NULL, null=True, blank=True, related_name='auditores')
    class Meta:
        verbose_name = 'Auditor'
        verbose_name_plural = 'Auditores'
        ordering = ['nome']
    def __str__(self):
        return self.nome

class TipoDemanda(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    class Meta:
        verbose_name = 'Tipo de Demanda'
        verbose_name_plural = 'Tipos de Demanda'
    def __str__(self):
        return self.nome

class Categoria(models.Model):
    nome = models.CharField('Nome', max_length=100, unique=True)
    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['nome']
    def __str__(self):
        return self.nome

class Atribuicao(models.Model):
    nome = models.CharField('Nome da Área de Atribuição', max_length=200, unique=True)
    class Meta:
        verbose_name = 'Área de Atribuição'
        verbose_name_plural = 'Áreas de Atribuição'
    def __str__(self):
        return self.nome

class Unidade(models.Model):
    nome = models.CharField('Nome da Unidade', max_length=250, unique=True)
    class Meta:
        verbose_name = 'Unidade (Auditada/Demandada)'
        verbose_name_plural = 'Unidades (Auditadas/Demandadas)'
    def __str__(self):
        return self.nome

# --- Modelos de Domínio (Estrutura Normalizada) ---
class Tipo(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    class Meta:
        verbose_name = 'Tipo de Processo'
        verbose_name_plural = 'Tipos de Processo'
        ordering = ['nome']
    def __str__(self):
        return self.nome

class Prioridade(models.Model):
    nome = models.CharField(max_length=30, unique=True)
    class Meta:
        verbose_name = 'Prioridade'
        verbose_name_plural = 'Prioridades'
    def __str__(self):
        return self.nome

class OrgaoDemandante(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    class Meta:
        verbose_name = 'Órgão Demandante'
        verbose_name_plural = 'Órgãos Demandantes'
    def __str__(self):
        return self.nome

class Situacao(models.Model):
    nome = models.CharField(max_length=50, unique=True)
    class Meta:
        verbose_name = 'Situação'
        verbose_name_plural = 'Situações'
    def __str__(self):
        return self.nome

class HierarquiaProcesso(models.Model):
    tipo_pai = models.ForeignKey(Tipo, on_delete=models.CASCADE, related_name='filhos_permitidos')
    tipo_filho = models.ForeignKey(Tipo, on_delete=models.CASCADE, related_name='pais_permitidos')
    class Meta:
        verbose_name = 'Hierarquia de Processo'
        verbose_name_plural = 'Hierarquias de Processos'
        unique_together = ('tipo_pai', 'tipo_filho')
    def __str__(self):
        return f"{self.tipo_pai.nome} -> {self.tipo_filho.nome}"


# --- Modelo Principal Unificado e Completo ---

class Processo(models.Model):
    # (O restante do modelo Processo continua o mesmo)
    # --- Campos Comuns a TODOS os Tipos ---
    numero = models.CharField("Identificador", max_length=20, unique=True, editable=False)
    assunto = models.TextField()
    tipo = models.ForeignKey(Tipo, on_delete=models.PROTECT, verbose_name="Tipo")
    situacao = models.ForeignKey(Situacao, on_delete=models.PROTECT, verbose_name="Situação")
    prioridade = models.ForeignKey(Prioridade, on_delete=models.PROTECT, verbose_name="Prioridade")
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, null=True, blank=True)
    pai = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='filhos', verbose_name="Processo Pai")
    descricao = models.TextField(blank=True, null=True, help_text="Usado para Acordão, Relatório, Recomendação, Determinação, Ação.")
    observacao = models.TextField(blank=True, null=True, help_text="Observações gerais para qualquer tipo.")
    data_cadastro = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    # --- Campos para 'Processo' (Tipo Principal) ---
    orgao_demandante = models.ForeignKey(OrgaoDemandante, on_delete=models.PROTECT, verbose_name="Órgão Demandante", null=True, blank=True)
    numero_processo_externo = models.CharField(max_length=50, blank=True, null=True)
    ano_solicitacao = models.IntegerField(validators=[validate_year], null=True, blank=True)
    numero_sei = models.CharField(max_length=50, blank=True, null=True)
    correlacao_lar = models.BooleanField(default=False, verbose_name="Correlação Assunto LAR")
    
    # --- Campos para 'Demanda', 'Recomendação', 'Determinação' ---
    atribuicao = models.ForeignKey(Atribuicao, on_delete=models.PROTECT, verbose_name="Atribuído para", null=True, blank=True)
    tipo_demanda = models.ForeignKey(TipoDemanda, on_delete=models.PROTECT, null=True, blank=True, help_text="Específico para o tipo 'Demanda'.")
    
    # --- Campos para 'Ação', 'Demanda' ---
    area_demandada = models.ForeignKey(Unidade, on_delete=models.PROTECT, related_name='processos_demandados', verbose_name="Área Téc. Demandada", null=True, blank=True)

    # --- Campos para 'Recomendação', 'Determinação' e 'Processo' ---
    unidades_auditadas = models.ManyToManyField(Unidade, blank=True, verbose_name='Unidades Auditadas')
    auditores_responsaveis = models.ManyToManyField(Auditor, blank=True, verbose_name='Auditores Responsáveis')

    # --- Campos para 'Acordão', 'Relatório' ---
    documento_sei = models.CharField("Documento SEI (específico)", max_length=50, blank=True, null=True, help_text="Para Acordãos e Relatórios")
    data_documento_sei = models.DateField(null=True, blank=True)

    
    # --- Campos para 'Recomendação', 'Determinação' ---
    identificacao_achados = models.TextField(blank=True, null=True, help_text="Usado para Recomendação e Determinação.")

    class Meta:
        verbose_name = 'Processo'
        verbose_name_plural = 'Processos'
        ordering = ['-data_cadastro']

    def save(self, *args, **kwargs):
        if not self.numero:
            unique_id = uuid.uuid4().hex
            hash_hex = hashlib.sha256(unique_id.encode()).hexdigest()
            self.numero = str(int(hash_hex, 16) % 10**10).zfill(10)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo.nome}: {self.numero} - {self.assunto}"

# --- Submodelos para Organização ---

class Execucao(models.Model):
    processo = models.OneToOneField(Processo, on_delete=models.CASCADE, related_name='execucao')
    local_acao = models.CharField("Local da Ação", max_length=200, blank=True, null=True)
    forma_execucao = models.TextField('Forma de Execução', blank=True, null=True)
    duracao_execucao = models.DurationField('Duração da Execução', blank=True, null=True)
    resultado_pretendido = models.TextField('Resultado Pretendido', blank=True, null=True)

    def __str__(self):
        return f"Execução de {self.processo.numero}"

class Resposta(models.Model):
    processo = models.OneToOneField(Processo, on_delete=models.CASCADE, related_name='resposta')
    prazo_inicial = models.DateField(null=True, blank=True, help_text="Prazo para Demanda, Recomendação, Determinação, Ação")
    documento_resposta = models.CharField("Número do Documento de Resposta", max_length=50, blank=True, null=True, help_text="Usado para Demanda")
    solicitacao_prorrogacao = models.BooleanField("Solicitação de Prorrogação", default=False, help_text="Para Demanda, Recomendação, Determinação")

    def __str__(self):
        return f"Resposta de {self.processo.numero}"

# --- Modelo de Histórico (VERSÃO MELHORADA) ---
class HistoricoProcesso(models.Model):
    """
    Registra um evento de alteração no Processo, capturando todas as
    mudanças ocorridas em uma única operação de salvamento.
    """
    TIPO_ALTERACAO_CHOICES = [
        ('CRIACAO', 'Criação'),
        ('ATUALIZACAO', 'Atualização'),
    ]

    processo = models.ForeignKey(Processo, on_delete=models.CASCADE, related_name='historicos')    
    data = models.DateTimeField(default=timezone.now, editable=False)
    alterado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False
    )
    tipo_alteracao = models.CharField(
        max_length=20, 
        choices=TIPO_ALTERACAO_CHOICES, 
        editable=False,
        default='ATUALIZACAO'
    )

    alteracoes = models.JSONField(
        verbose_name="Alterações Detalhadas",
        editable=False,
        default=dict
    )
    observacao_geral = models.TextField(blank=True, null=True, help_text="Observação manual sobre a mudança, se necessário.")


    class Meta:
        verbose_name = 'Histórico do Processo'
        verbose_name_plural = 'Históricos dos Processos'
        ordering = ['-data']

    def __str__(self):
        return f"Alteração em {self.processo.numero} em {self.data.strftime('%d/%m/%Y %H:%M')}"

    # Opcional: formatação bonita no admin
    def display_alteracoes(self):
        """Formata o JSON para exibição amigável no admin."""
        from django.utils.html import format_html
        formatted_json = json.dumps(self.alteracoes, indent=4, ensure_ascii=False)
        return format_html("<pre>{}</pre>", formatted_json)
    display_alteracoes.short_description = "Detalhes da Alteração"