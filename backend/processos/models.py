import re
import uuid
import hashlib
from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import datetime
from django.core.exceptions import ValidationError


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


def validate_year(value):
    current_year = datetime.now().year
    if value < 1900 or value > current_year + 1:
        raise ValidationError(f'Ano deve estar entre 1900 e {current_year + 1}')


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
    ano_solicitacao = models.IntegerField(validators=[validate_year])
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
            # Usar mais caracteres para evitar colisões
            unique_id = uuid.uuid4().hex
            hash_hex = hashlib.sha256(unique_id.encode()).hexdigest()
            self.identificador = str(int(hash_hex, 16) % 10**12)  # 12 dígitos
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


class TipoDemanda(BaseModel):
    class Meta:
        verbose_name = _('Tipo de Demanda')
        verbose_name_plural = _('Tipos de Demandas')



class PedidoProrrogacao(models.Model):
    STATUS_CHOICES = [
        ('solicitado', _('Solicitado')),
        ('aprovado', _('Aprovado')),
        ('reprovado', _('Reprovado')),
        ('parcial', _('Aprovado Parcialmente')),
    ]

    demanda = models.ForeignKey(
        'Demanda', 
        on_delete=models.CASCADE, 
        related_name='prorrogacoes',
        verbose_name=_('Demanda')
    )
    data_solicitacao = models.DateField(_('Data da Solicitação'))
    data_decisao = models.DateField(_('Data da Decisão'), blank=True, null=True)
    prazo_solicitado = models.DateField(_('Prazo Solicitado'))    
    status = models.CharField(
        _('Status'), 
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='solicitado'
    )
    prazo_autorizado = models.DateField(_('Prazo Autorizado'), blank=True, null=True)    
    

    class Meta:
        verbose_name = _('Pedido de Prorrogação')
        verbose_name_plural = _('Pedidos de Prorrogação')
        ordering = ['-data_solicitacao']
    
    def __str__(self):
        return f"Prorrogação de {self.demanda} - {self.get_status_display()}"
    
    def clean(self):
        super().clean()  # Chama o método clean da classe pai para garantir todas as validações padrão
        
        # Validação do prazo solicitado
        if self.prazo_solicitado and self.prazo_solicitado <= self.data_solicitacao:
            raise ValidationError({
                'prazo_solicitado': _('O prazo solicitado deve ser posterior à data de solicitação.')
            })
        
        # Validação do status e prazo autorizado
        if self.status in ['aprovado', 'parcial'] and not self.prazo_autorizado:
            raise ValidationError({
                'prazo_autorizado': _('O prazo autorizado é obrigatório quando o status é Aprovado ou Parcial.')
            })
        
        # Validação do status e data de decisão
        if self.status in ['aprovado', 'reprovado', 'parcial'] and not self.data_decisao:
            raise ValidationError({
                'data_decisao': _('A data de decisão é obrigatória quando há uma decisão sobre a prorrogação.')
            })
        
        # Validações adicionais recomendadas:
        # Verifica se a data de decisão não é anterior à data de solicitação
        if self.data_decisao and self.data_solicitacao and self.data_decisao < self.data_solicitacao:
            raise ValidationError({
                'data_decisao': _('A data de decisão não pode ser anterior à data de solicitação.')
            })
        
        # Verifica se o prazo autorizado é posterior à data de decisão
        if self.prazo_autorizado and self.data_decisao and self.prazo_autorizado <= self.data_decisao:
            raise ValidationError({
                'prazo_autorizado': _('O prazo autorizado deve ser posterior à data de decisão.')
            })


class Demanda(models.Model):
    PRIORIDADE_CHOICES = [
        ('normal', _('Normal')),
        ('alta', _('Alta')),
        ('urgente', _('Urgente')),
    ]
    
    SITUACAO_CHOICES = [
        ('pendente', _('Pendente de resposta')),
        ('respondida', _('Respondida')),
        ('em_analise', _('Em análise')),
        ('concluida', _('Concluída')),
    ]
    
    REITERADO_CHOICES = [
        ('sim', _('Sim')),
        ('nao', _('Não')),
    ]
    
    processo = models.ForeignKey(Processo, on_delete=models.CASCADE, related_name='demandas')
    tipo_demanda = models.ForeignKey(TipoDemanda, on_delete=models.PROTECT, related_name='demandas', verbose_name=_('Tipo de Demanda'))
    assunto = models.CharField(_('Assunto'), max_length=200)
    situacao = models.CharField(_('Situação'), max_length=20, choices=SITUACAO_CHOICES, default='pendente')
    prioridade = models.CharField(_('Prioridade'), max_length=10, choices=PRIORIDADE_CHOICES, default='normal')
    atribuicao = models.ForeignKey(
        Atribuicao,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='demandas_atribuidas',
        verbose_name=_('Área de Atribuição')
    )
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='demandas')
    numero_processo_externo = models.CharField(_('Número do Processo Externo'), max_length=50, blank=True, null=True)
    area_demandada = models.ManyToManyField(
        Unidade,
        related_name='demandas',
        blank=True,
        verbose_name=_('Áreas Demandadas')
    )
    
    # Campos de prazo
    prazo_inicial = models.DateField(_('Prazo Inicial'), blank=True, null=True)


    # Campos de resposta
    documento_resposta = models.CharField(_('Documento de Resposta'), max_length=20, blank=True, null=True)
    data_resposta = models.DateField(_('Data da Resposta'), blank=True, null=True)
    numero_sei_resposta = models.CharField(_('Número SEI da Resposta'), max_length=50, blank=True, null=True)
    data_envio_resposta = models.DateField(_('Data do Envio da Resposta'), blank=True, null=True)
    
    # Campos de reiteração
    reiterado = models.CharField(
        _('Reiterado'),
        max_length=3,
        choices=REITERADO_CHOICES,
        default='nao'
    )
    data_reiteracao = models.DateField(_('Data da Reiteração'), blank=True, null=True)
    
    # Campo de observação
    observacao = models.TextField(_('Observação'), max_length=5000, blank=True, null=True)
    
    # Campos de controle
    data_criacao = models.DateTimeField(_('Data de Criação'), auto_now_add=True)
    data_atualizacao = models.DateTimeField(_('Data de Atualização'), auto_now=True)
    
    class Meta:
        verbose_name = _('Demanda')
        verbose_name_plural = _('Demandas')
        ordering = ['-data_criacao']
    
    def __str__(self):
        return f"{self.processo.identificador} - {self.assunto}"
    
    def clean(self):        
        # Validar datas de reiteração
        if self.reiterado == 'sim' and not self.data_reiteracao:
            raise ValidationError({'data_reiteracao': 
                                 _('Data de reiteração é obrigatória quando demanda foi reiterada.')})

    @property
    def prazo_atual(self):
        """Retorna o prazo atual considerando prorrogações aprovadas"""
        prorrogacao_aprovada = self.prorrogacoes.filter(status__in=['aprovado', 'parcial']).order_by('-data_decisao').first()
        if prorrogacao_aprovada:
            return prorrogacao_aprovada.prazo_autorizado
        return self.prazo_inicial
    

    @property
    def tem_prorrogacao(self):
        """Verifica se existe algum pedido de prorrogação"""
        return self.prorrogacoes.exists()


    @property 
    def status_prorrogacao(self):
        """Retorna o status do pedido de prorrogação mais recente"""
        ultimo_pedido = self.prorrogacoes.order_by('-data_solicitacao').first()
        if ultimo_pedido:
            return ultimo_pedido.get_status_display()
        return None