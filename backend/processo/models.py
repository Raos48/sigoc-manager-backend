import re
import uuid
import hashlib
from datetime import datetime
from django.db import models
from django.core.exceptions import ValidationError

def validate_year(value):
    current_year = datetime.now().year
    if value < 1900 or value > current_year + 1:
        raise ValidationError(f'Ano deve estar entre 1900 e {current_year + 1}')

class TipoDemanda(models.Model):
    nome = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Tipo de Demanda'
        verbose_name_plural = 'Tipos de Demanda'

    def __str__(self):
        return self.nome

class TipoReuniao(models.Model):
    nome = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Tipo de Reunião'
        verbose_name_plural = 'Tipos de Reunião'

    def __str__(self):
        return self.nome

class Processo(models.Model):
    PRIORIDADE_CHOICES = [
        ('normal', 'Normal'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    ORGAO_CHOICES = [
        ('TCU', 'TCU'),
        ('CGU', 'CGU'),
        ('AUDGER', 'AUDGER'),
        ('MD', 'Ministério da Defesa'),
        ('OUTROS', 'Outros'),
    ]

    TIPO_CHOICES = [
        ('processo', 'Processo'),
        ('demanda', 'Demanda'),
        ('acordao', 'Acordão'),
        ('relatorio_auditoria', 'Relatório de Auditoria'),
        ('recomendacao', 'Recomendação'),
        ('acao', 'Ação'),
        ('determinacao', 'Determinação'),
    ]

    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    tipo_processo = models.ForeignKey('TipoProcesso', on_delete=models.PROTECT, related_name='processos', null=True, blank=True)    
    identificador = models.CharField(max_length=10, unique=True, editable=False)
    assunto = models.CharField(max_length=200)
    situacao = models.ForeignKey('Situacao', on_delete=models.PROTECT, related_name='processos')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='normal')
    atribuicao = models.ForeignKey('Atribuicao', on_delete=models.PROTECT, null=True, blank=True, related_name='processos_atribuidos', verbose_name='Área de Atribuição')
    numero_sei = models.CharField(max_length=50, blank=True, null=True)
    orgao_demandante = models.CharField(max_length=10, choices=ORGAO_CHOICES, null=True, blank=True)
    numero_processo_externo = models.CharField(max_length=50, blank=True, null=True)
    ano_solicitacao = models.IntegerField(validators=[validate_year], null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    auditores_responsaveis = models.ManyToManyField('Auditor', related_name='processos_responsavel', blank=True)
    unidade_auditada = models.ManyToManyField('Unidade', related_name='processos', blank=True, verbose_name='Unidades Auditadas')
    categoria = models.ForeignKey('Categoria', on_delete=models.PROTECT, related_name='processos', null=True, blank=True)
    correlacao_lar = models.BooleanField(default=False)
    tag = models.CharField(max_length=100, blank=True, null=True)
    descricao = models.TextField(max_length=200000, blank=True, null=True)
    observacao = models.TextField(max_length=5000, blank=True, null=True)
    prazo = models.DateField('Prazo', blank=True, null=True)
    tipo_demanda = models.ForeignKey('TipoDemanda', on_delete=models.PROTECT, related_name='demandas', verbose_name='Tipo de Demanda', null=True, blank=True)
    data_resposta = models.DateField('Data da Resposta', blank=True, null=True)
    numero_sei_resposta = models.CharField('Número SEI da Resposta', max_length=50, blank=True, null=True)
    data_envio_resposta = models.DateField('Data do Envio da Resposta', blank=True, null=True)
    reiterado = models.CharField('Reiterado', max_length=3, choices=[('sim', 'Sim'), ('nao', 'Não')], default='nao')
    data_reiteracao = models.DateField('Data da Reiteração', blank=True, null=True)
    identificacao_achados = models.TextField('Identificação dos Achados', blank=True, null=True)
    documento_resposta = models.CharField('Documento de Resposta', max_length=20, blank=True, null=True)
    prazo_inicial = models.DateField('Prazo Inicial', blank=True, null=True)
    local_execucao = models.CharField('Local da Execução', max_length=200, blank=True, null=True)
    duracao_execucao = models.DurationField('Duração da Execução', blank=True, null=True)
    forma_execucao = models.TextField('Forma de Execução', blank=True, null=True)
    resultado_pretendido = models.TextField('Resultado Pretendido', blank=True, null=True)
    area_demandada = models.ForeignKey('Unidade', on_delete=models.PROTECT, related_name='acoes', verbose_name='Área Demandada', null=True, blank=True)
    achados = models.TextField('Achados', blank=True, null=True)
    solicitacao_prorrogacao = models.BooleanField('Solicitação de Prorrogação', default=False)
    pai = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subprocessos')

    class Meta:
        verbose_name = 'Processo'
        verbose_name_plural = 'Processos'
        ordering = ['-data_criacao']

    def clean(self):

        if self.tipo == 'processo' and self.pai is not None:
            raise ValidationError({'pai': "Processos do tipo 'processo' não podem ter pai."})
        
        # --- [Processos filhos: regras especiais por tipo de pai] ---
        if self.pai:
            # Pai do tipo 'processo'
            if self.pai.tipo == 'processo':
                tipos_permitidos = ['demanda', 'acordao', 'relatorio_auditoria', 'recomendacao', 'determinacao', 'acao']
                if self.tipo not in tipos_permitidos:
                    raise ValidationError({'tipo': "Somente tipos permitidos podem ser filhos de 'processo'."})
            # Pai do tipo 'acordao'
            elif self.pai.tipo == 'acordao':
                if self.tipo not in ['recomendacao', 'determinacao']:
                    raise ValidationError({'tipo': "Filhos de acórdão só podem ser do tipo recomendação ou determinação."})
            # Pai do tipo 'determinacao'
            elif self.pai.tipo == 'determinacao':
                if self.tipo != 'acao':
                    raise ValidationError({'tipo': "Filhos de determinação só podem ser do tipo ação."})
            # Outras combinações não são permitidas
            else:
                raise ValidationError({'pai': "Estrutura de pai/filho inválida para o tipo de processo pai informado."})
            

        if self.tipo == 'processo':
            campos_obrigatorios = [
                'tipo_processo', 'assunto', 'situacao', 'prioridade', 
                'numero_sei', 'orgao_demandante', 'numero_processo_externo',
                'ano_solicitacao'
            ]
            for campo in campos_obrigatorios:
                valor = getattr(self, campo)
                if valor in [None, '']:
                    raise ValidationError({campo: "Campo obrigatório para processos do tipo 'processo'."})
                


        # Campos obrigatórios para Recomendação
        if self.tipo == 'recomendacao':
            campos = [
                'assunto', 'situacao', 'prioridade', 'prazo_inicial',
            ]
            for campo in campos:
                if not getattr(self, campo):
                    raise ValidationError({campo: "Campo obrigatório para processos do tipo 'recomendação'."})
            if not self.unidade_auditada.exists():
                raise ValidationError({'unidade_auditada': "Ao menos uma unidade auditada é obrigatória."})
            # Checagem do campo booleano de solicitação
            if self.solicitacao_prorrogacao is None:
                raise ValidationError({'solicitacao_prorrogacao': "Campo obrigatório para processos do tipo 'recomendação'."})
            

        # Campos obrigatórios para Determinação
        if self.tipo == 'determinacao':
            campos = [
                'assunto', 'situacao', 'prioridade', 'prazo_inicial',
            ]
            for campo in campos:
                if not getattr(self, campo):
                    raise ValidationError({campo: "Campo obrigatório para processos do tipo 'determinação'."})
            if not self.unidade_auditada.exists():
                raise ValidationError({'unidade_auditada': "Ao menos uma unidade auditada é obrigatória."})
            if self.solicitacao_prorrogacao is None:
                raise ValidationError({'solicitacao_prorrogacao': "Campo obrigatório para processos do tipo 'determinação'."})
            

        # Campos obrigatórios para Ação
        if self.tipo == 'acao':
            campos = [
                'assunto', 'situacao', 'prioridade', 'area_demandada',
                'prazo_inicial', 'duracao_execucao', 'forma_execucao', 'resultado_pretendido',
            ]
            for campo in campos:
                if not getattr(self, campo):
                    raise ValidationError({campo: "Campo obrigatório para processos do tipo 'ação'."})

        
        if self.orgao_demandante and self.numero_processo_externo:
            if self.orgao_demandante == 'TCU':
                tcu_pattern = r'^\d{3}\.\d{3}\/\d{4}-\d{1}$'
                if not re.match(tcu_pattern, self.numero_processo_externo):
                    raise ValidationError({'numero_processo_externo': 'O formato para TCU deve ser: XXX.XXX/XXXX-X'})
            elif self.orgao_demandante == 'CGU':
                if not self.numero_processo_externo.isdigit() or len(self.numero_processo_externo) != 8:
                    raise ValidationError({'numero_processo_externo': 'O formato para CGU deve ser: 8 dígitos (ex: XXXXXXXX)'})
            elif self.orgao_demandante == 'AUDGER':
                if not self.numero_processo_externo.isdigit() or len(self.numero_processo_externo) != 7:
                    raise ValidationError({'numero_processo_externo': 'O formato para AUDGER deve ser: 7 dígitos (ex: XXXXXXX)'})
        
        if self.reiterado == 'sim' and not self.data_reiteracao:
            raise ValidationError({'data_reiteracao': 'Data de reiteração é obrigatória quando demanda foi reiterada.'})
        
        # Validações específicas para tipo_demanda
        if self.tipo_demanda:
            tipo_demanda_valor = getattr(self.tipo_demanda, 'nome', '') if hasattr(self.tipo_demanda, 'nome') else ''
            
            if tipo_demanda_valor in ['demanda', 'recomendacao', 'determinacao'] and not self.prazo:
                raise ValidationError({'prazo': 'Prazo é obrigatório para demandas, recomendações e determinações.'})
            if tipo_demanda_valor == 'acao':
                if not self.local_execucao:
                    raise ValidationError({'local_execucao': 'Local de execução é obrigatório para ações.'})
                if not self.duracao_execucao:
                    raise ValidationError({'duracao_execucao': 'Duração da execução é obrigatória para ações.'})
                if not self.forma_execucao:
                    raise ValidationError({'forma_execucao': 'Forma de execução é obrigatória para ações.'})
                if not self.resultado_pretendido:
                    raise ValidationError({'resultado_pretendido': 'Resultado pretendido é obrigatório para ações.'})
        
        # Validações de hierarquia de processos
        # if self.pai:
        #     if self.pai.pai:
        #         raise ValidationError("Um subprocesso deve ter apenas um pai (processo OU outro subprocesso, nunca ambos)")
    
    def save(self, *args, **kwargs):
        if not self.identificador:
            unique_id = uuid.uuid4().hex
            hash_hex = hashlib.sha256(unique_id.encode()).hexdigest()
            self.identificador = str(int(hash_hex, 16) % 10**12)
        self.clean()  # Todas as validações estão agora aqui
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.identificador} - {self.assunto}"

class Reuniao(models.Model):
    processo = models.ForeignKey('Processo', on_delete=models.CASCADE, related_name='reunioes', verbose_name='Processo')
    data = models.DateTimeField('Data')
    tipo = models.ForeignKey('TipoReuniao', on_delete=models.PROTECT, verbose_name='Tipo')
    participantes = models.TextField('Participantes', blank=True, help_text='Liste os nomes dos participantes, um por linha ou separados por vírgula.')
    pauta = models.TextField('Pauta')
    resultado = models.TextField('Resultado', blank=True, null=True)

    class Meta:
        verbose_name = 'Reunião'
        verbose_name_plural = 'Reuniões'
        ordering = ['tipo']

    def __str__(self):
        return "Reunião %(tipo)s - %(data)s" % {'tipo': self.tipo, 'data': self.data.strftime('%d/%m/%Y')}

class Atribuicao(models.Model):
    nome = models.CharField('Nome da Área de Atribuição', max_length=200, unique=True)

    class Meta:
        verbose_name = 'Área de Atribuição'
        verbose_name_plural = 'Áreas de Atribuição'
        ordering = ['nome']

    def __str__(self):
        return self.nome

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
    grupo = models.ForeignKey(
        GrupoAuditor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='auditores',
        verbose_name='Grupo de Auditores'
    )
    telefone = models.CharField('Telefone', max_length=20, blank=True, null=True)
    email = models.EmailField('Email', blank=True, null=True)

    class Meta:
        verbose_name = 'Auditor'
        verbose_name_plural = 'Auditores'
        ordering = ['nome']

    def __str__(self):
        return self.nome

class Unidade(models.Model):
    nome = models.CharField('Nome', max_length=250)

    class Meta:
        verbose_name = 'Unidade'
        verbose_name_plural = 'Unidades'
        ordering = ['nome']

    def __str__(self):
        return self.nome

class TipoProcesso(models.Model):
    nome = models.CharField('Nome', max_length=250)

    class Meta:
        verbose_name = 'Tipo de processo'
        verbose_name_plural = 'Tipos de processos'

    def __str__(self):
        return self.nome

class Situacao(models.Model):
    nome = models.CharField('Nome', max_length=250)

    class Meta:
        verbose_name = 'Situação'
        verbose_name_plural = 'Situações'

    def __str__(self):
        return self.nome

class Categoria(models.Model):
    nome = models.CharField('Nome', max_length=100)
    valor = models.IntegerField('Valor', unique=True)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['valor']

    def __str__(self):
        return self.nome
