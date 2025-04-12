from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    GrupoAuditor, Auditor, Unidade, TipoProcesso,
    Situacao, Categoria, Atribuicao, Processo,
    TipoReuniao, Reuniao, TipoDemanda, Demanda, PedidoProrrogacao
)
from django.db import models


class BaseAdmin(admin.ModelAdmin):
    list_per_page = 25
    search_fields = ('nome',)


@admin.register(GrupoAuditor)
class GrupoAuditorAdmin(BaseAdmin):
    list_display = ('nome', 'descricao')


@admin.register(Auditor)
class AuditorAdmin(BaseAdmin):
    list_display = ('nome', 'grupo', 'email', 'telefone')
    list_filter = ('grupo',)
    autocomplete_fields = ['grupo']


@admin.register(Unidade)
class UnidadeAdmin(BaseAdmin):
    list_display = ('nome',)


@admin.register(TipoProcesso)
class TipoProcessoAdmin(BaseAdmin):
    list_display = ('nome',)
    ordering = ('nome',)


@admin.register(Situacao)
class SituacaoAdmin(BaseAdmin):
    list_display = ('nome',)
    ordering = ('nome',)


@admin.register(Categoria)
class CategoriaAdmin(BaseAdmin):
    list_display = ('valor', 'nome')
    ordering = ('valor',)


@admin.register(Atribuicao)
class AtribuicaoAdmin(BaseAdmin):
    list_display = ('nome',)


@admin.register(TipoReuniao)
class TipoReuniaoAdmin(BaseAdmin):
    list_display = ('get_tipo_display',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('tipo')


@admin.register(TipoDemanda)
class TipoDemandaAdmin(BaseAdmin):
    list_display = ('nome',)
    ordering = ('nome',)


class PedidoProrrogacaoInline(admin.TabularInline):
    model = PedidoProrrogacao
    extra = 0
    fields = ('data_solicitacao', 'prazo_solicitado', 'status', 'prazo_autorizado', 'data_decisao')
    ordering = ('-data_solicitacao',)


class ReuniaoInline(admin.TabularInline):
    model = Reuniao
    extra = 0
    fields = ('data', 'tipo', 'participantes', 'pauta', 'resultado')
    verbose_name = _("Reunião")
    verbose_name_plural = _("Reuniões Agendadas")
    autocomplete_fields = ['tipo']
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 3})},
    }
    ordering = ('-data',)


class DemandaInline(admin.StackedInline):
    model = Demanda
    extra = 0
    fieldsets = (
        (_('Informações Básicas'), {
            'fields': (('tipo_demanda', 'situacao', 'prioridade'), 'assunto', 'categoria')
        }),
        (_('Atribuição e Responsabilidade'), {
            'fields': ('atribuicao', 'area_demandada')
        }),
        (_('Prazos'), {
            'fields': ('prazo_inicial',)
        }),
        (_('Resposta'), {
            'fields': (('documento_resposta', 'data_resposta'),
                      ('numero_sei_resposta', 'data_envio_resposta'))
        }),
        (_('Reiteração'), {
            'fields': ('reiterado', 'data_reiteracao')
        }),
        (_('Observações'), {
            'fields': ('observacao',)
        }),
    )
    autocomplete_fields = ['tipo_demanda', 'atribuicao', 'categoria']
    filter_horizontal = ('area_demandada',)
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 4})},
    }


@admin.register(Processo)
class ProcessoAdmin(admin.ModelAdmin):
    list_display = ('identificador', 'assunto', 'tipo', 'situacao', 'atribuicao', 'prioridade', 'orgao_demandante', 'data_criacao')
    list_display_links = ('identificador', 'assunto')
    list_filter = ('tipo', 'situacao', 'prioridade', 'orgao_demandante', 'ano_solicitacao', 'correlacao_lar', 'atribuicao', 'unidade_auditada')
    search_fields = ('identificador', 'assunto', 'numero_sei', 'numero_processo_externo', 'auditores_responsaveis__nome', 'atribuicao__nome', 'unidade_auditada__nome')
    filter_horizontal = ('auditores_responsaveis','unidade_auditada')
    date_hierarchy = 'data_criacao'
    list_per_page = 20
    inlines = [DemandaInline, ReuniaoInline]
    readonly_fields = ('identificador', 'data_criacao', 'data_atualizacao')
    autocomplete_fields = ['tipo', 'situacao', 'atribuicao', 'categoria']

    fieldsets = (
        (_('Informações Essenciais'), {
            'fields': (('tipo', 'situacao'), ('prioridade', 'categoria'), 'assunto')
        }),
        (_('Atribuição e Responsabilidade'), {
            'fields': ('atribuicao', 'auditores_responsaveis', 'unidade_auditada')
        }),
        (_('Referências Externas'), {
            'fields': (('numero_sei', 'ano_solicitacao'), ('orgao_demandante', 'numero_processo_externo'))
        }),
        (_('Detalhes Adicionais'), {
            'classes': ('collapse',),
            'fields': ('descricao', 'observacao', ('correlacao_lar', 'tag'))
        }),
        (_('Informações do Sistema'), {
            'classes': ('collapse',),
            'fields': ('identificador', ('data_criacao', 'data_atualizacao'))
        }),
    )

    def save_model(self, request, obj, form, change):
        obj.full_clean()
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('tipo', 'situacao', 'atribuicao', 'categoria')\
                 .prefetch_related('auditores_responsaveis', 'unidade_auditada')


@admin.register(Reuniao)
class ReuniaoAdmin(admin.ModelAdmin):
    list_display = ('processo', 'data', 'tipo', 'participantes_resumo')
    list_filter = ('tipo', 'data', 'processo__tipo', 'processo__atribuicao')
    search_fields = ('processo__identificador', 'processo__assunto', 'pauta', 'participantes', 'resultado')
    date_hierarchy = 'data'
    list_per_page = 25
    autocomplete_fields = ['processo', 'tipo']
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 4})},
    }
    list_select_related = ('processo', 'tipo')

    fieldsets = (
        (None, {
            'fields': ('processo', 'data', 'tipo', 'participantes', 'pauta', 'resultado')
        }),
    )

    def participantes_resumo(self, obj):
        if obj.participantes:
            primeira_linha = obj.participantes.split('\n')[0]
            return (primeira_linha[:75] + '...') if len(primeira_linha) > 75 else primeira_linha
        return "-"
    participantes_resumo.short_description = _('Participantes (Resumo)')


@admin.register(PedidoProrrogacao)
class PedidoProrrogacaoAdmin(admin.ModelAdmin):
    list_display = ('demanda', 'data_solicitacao', 'prazo_solicitado', 'status', 'prazo_autorizado')
    list_filter = ('status', 'data_solicitacao')
    search_fields = ('demanda__assunto', 'demanda__processo__identificador')
    date_hierarchy = 'data_solicitacao'
    autocomplete_fields = ['demanda']
    
    fieldsets = (
        (_('Informações da Demanda'), {
            'fields': ('demanda',)
        }),
        (_('Solicitação'), {
            'fields': ('data_solicitacao', 'prazo_solicitado')
        }),
        (_('Decisão'), {
            'fields': ('status', 'prazo_autorizado')
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('demanda', 'demanda__processo')


@admin.register(Demanda)
class DemandaAdmin(admin.ModelAdmin):
    list_display = ('processo', 'tipo_demanda', 'assunto', 'situacao', 'prioridade', 'prazo_inicial', 'prazo_atual', 'tem_prorrogacao', 'data_criacao')
    list_display_links = ('assunto',)
    list_filter = ('tipo_demanda', 'situacao', 'prioridade', 'reiterado', 'atribuicao')
    search_fields = ('assunto', 'processo__identificador', 'processo__assunto', 'numero_processo_externo', 'numero_sei_resposta', 'documento_resposta')
    date_hierarchy = 'data_criacao'
    list_per_page = 20
    autocomplete_fields = ['processo', 'tipo_demanda', 'atribuicao', 'categoria']
    filter_horizontal = ('area_demandada',)
    readonly_fields = ('data_criacao', 'data_atualizacao')
    inlines = [PedidoProrrogacaoInline]

    fieldsets = (
        (_('Vínculo ao Processo'), {
            'fields': ('processo',)
        }),
        (_('Informações Básicas'), {
            'fields': (('tipo_demanda', 'situacao', 'prioridade'), 'assunto', 'categoria', 'numero_processo_externo')
        }),
        (_('Atribuição e Responsabilidade'), {
            'fields': ('atribuicao', 'area_demandada')
        }),
        (_('Prazos'), {
            'fields': ('prazo_inicial',)
        }),
        (_('Resposta'), {
            'fields': (('documento_resposta', 'data_resposta'),
                      ('numero_sei_resposta', 'data_envio_resposta'))
        }),
        (_('Reiteração'), {
            'fields': ('reiterado', 'data_reiteracao')
        }),
        (_('Observações'), {
            'fields': ('observacao',)
        }),
        (_('Informações do Sistema'), {
            'classes': ('collapse',),
            'fields': (('data_criacao', 'data_atualizacao'),)
        }),
    )
    
    def prazo_atual(self, obj):
        prazo = obj.prazo_atual
        return prazo if prazo else "-"
    prazo_atual.short_description = _('Prazo Atual')
    
    def tem_prorrogacao(self, obj):
        return "✓" if obj.tem_prorrogacao else "-"
    tem_prorrogacao.short_description = _('Prorrogado')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('processo', 'tipo_demanda', 'atribuicao', 'categoria')\
                 .prefetch_related('area_demandada', 'prorrogacoes')
