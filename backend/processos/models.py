import re
import uuid
import hashlib
from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class BaseModel(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.nome

class GrupoAuditor(BaseModel):
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _('Grupo de Auditores')
        verbose_name_plural = _('Grupos de Auditores')

class Auditor(models.Model):
    nome = models.CharField(_('Nome'), max_length=100)
    grupo = models.ForeignKey(
        GrupoAuditor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='auditores',
        verbose_name=_('Grupo de Auditores')
    )
    telefone = models.CharField(_('Telefone'), max_length=20, blank=True, null=True)
    email = models.EmailField(_('Email'), blank=True, null=True)

    class Meta:
        verbose_name = _('Auditor')
        verbose_name_plural = _('Auditores')
        ordering = ['nome']

    def __str__(self):
        return self.nome

class Unidade(models.Model):
    nome = models.CharField(_('Nome'), max_length=250)

    class Meta:
        verbose_name = _('Unidade')
        verbose_name_plural = _('Unidades')
        ordering = ['nome']

    def __str__(self):
        return self.nome

class TipoProcesso(BaseModel):
    class Meta:
        verbose_name = _('Tipo de processo')
        verbose_name_plural = _('Tipos de processos')

class Situacao(BaseModel):
    class Meta:
        verbose_name = _('Situação')
        verbose_name_plural = _('Situações')

class Categoria(models.Model):
    nome = models.CharField(_('Nome'), max_length=100)
    valor = models.IntegerField(_('Valor'), unique=True)

    class Meta:
        verbose_name = _('Categoria')
        verbose_name_plural = _('Categorias')
        ordering = ['valor']

    def __str__(self):
        return self.nome

class Atribuicao(models.Model):
    nome = models.CharField(_('Nome da Área de Atribuição'), max_length=200, unique=True)

    class Meta:
        verbose_name = _('Área de Atribuição')
        verbose_name_plural = _('Áreas de Atribuição')
        ordering = ['nome']

    def __str__(self):
        return self.nome

class Processo(models.Model):
    PRIORIDADE_CHOICES = [
        ('normal', _('Normal')),
        ('alta', _('Alta')),
        ('urgente', _('Urgente')),
    ]

    ORGAO_CHOICES = [
        ('TCU', 'TCU'),
        ('CGU', 'CGU'),
        ('AUDGER', 'AUDGER'),
        ('MD', _('Ministério da Defesa')),
        ('OUTROS', _('Outros')),
    ]

    identificador = models.CharField(max_length=10, unique=True, editable=False)
    tipo = models.ForeignKey(TipoProcesso, on_delete=models.PROTECT, related_name='processos')
    assunto = models.CharField(max_length=200)
    situacao = models.ForeignKey(Situacao, on_delete=models.PROTECT, related_name='processos')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='normal')
    atribuicao = models.ForeignKey(
        Atribuicao,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='processos_atribuidos',
        verbose_name=_('Área de Atribuição')
    )
    numero_sei = models.CharField(max_length=50, blank=True, null=True)
    orgao_demandante = models.CharField(max_length=10, choices=ORGAO_CHOICES)
    numero_processo_externo = models.CharField(max_length=50, blank=True, null=True)
    ano_solicitacao = models.IntegerField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    auditores_responsaveis = models.ManyToManyField(Auditor, related_name='processos_responsavel', blank=True)
    unidade_auditada = models.ManyToManyField(
        Unidade,
        related_name='processos',
        blank=True,
        verbose_name=_('Unidades Auditadas')
    )
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='processos')
    correlacao_lar = models.BooleanField(default=False)
    tag = models.CharField(max_length=100, blank=True, null=True)
    descricao = models.TextField(max_length=200000, blank=True, null=True)
    observacao = models.TextField(max_length=5000, blank=True, null=True)

    def clean(self):
        if self.orgao_demandante == 'TCU' and self.numero_processo_externo:
            tcu_pattern = r'^\d{3}\.\d{3}\/\d{4}-\d{1}$'
            if not re.match(tcu_pattern, self.numero_processo_externo):
                raise ValidationError({'numero_processo_externo': _('O formato para TCU deve ser: 044.967/2021-7')})
        elif self.orgao_demandante == 'CGU' and self.numero_processo_externo:
            if not self.numero_processo_externo.isdigit() or len(self.numero_processo_externo) != 8:
                raise ValidationError({'numero_processo_externo': _('O formato para CGU deve ser: 8 dígitos (ex: 01229074)')})
        elif self.orgao_demandante == 'AUDGER' and self.numero_processo_externo:
            if not self.numero_processo_externo.isdigit() or len(self.numero_processo_externo) != 7:
                raise ValidationError({'numero_processo_externo': _('O formato para AUDGER deve ser: 7 dígitos (ex: 1577597)')})

    def save(self, *args, **kwargs):
        if not self.identificador:
            unique_id = uuid.uuid4().hex
            self.identificador = hashlib.sha256(unique_id.encode()).hexdigest()[:10]
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.identificador} - {self.assunto}"

class TipoReuniao(models.Model):
    TIPO_CHOICES = [
        ('apresentacao', _('Apresentação')),
        ('alinhamento_interno', _('Alinhamento Interno')),
        ('alinhamento_externo', _('Alinhamento Externo')),
        ('busca_solucoes', _('Busca Conjunta de Soluções')),
        ('encerramento', _('Encerramento')),
    ]

    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)

    class Meta:
        verbose_name = _('Tipo de Reunião')
        verbose_name_plural = _('Tipos de Reuniões')

    def __str__(self):
        return self.get_tipo_display()

class Reuniao(models.Model):
    processo = models.ForeignKey(Processo, on_delete=models.CASCADE, related_name='reunioes', verbose_name=_('Processo'))
    data = models.DateTimeField(_('Data'))
    tipo = models.ForeignKey(TipoReuniao, on_delete=models.PROTECT, verbose_name=_('Tipo'))
    participantes = models.TextField(
        _('Participantes'),
        blank=True,
        help_text=_('Liste os nomes dos participantes, um por linha ou separados por vírgula.')
    )
    pauta = models.TextField(_('Pauta'))
    resultado = models.TextField(_('Resultado'), blank=True, null=True)

    class Meta:
        verbose_name = _('Reunião')
        verbose_name_plural = _('Reuniões')
        ordering = ['tipo']

    def __str__(self):
        return _("Reunião %(tipo)s - %(data)s") % {'tipo': self.tipo, 'data': self.data.strftime('%d/%m/%Y')}
