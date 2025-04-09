from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    GrupoAuditor, Auditor, Unidade, TipoProcesso,
    Situacao, Categoria, Atribuicao, Processo,
    TipoReuniao, Reuniao
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
    ordering = ('nome',)  # Adicionar ordenação padrão

@admin.register(Situacao)
class SituacaoAdmin(BaseAdmin):
    list_display = ('nome',)
    ordering = ('nome',)  # Adicionar ordenação padrão

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

@admin.register(Processo)
class ProcessoAdmin(admin.ModelAdmin):
    list_display = ('identificador', 'assunto', 'tipo', 'situacao', 'atribuicao', 'prioridade', 'orgao_demandante', 'data_criacao')
    list_display_links = ('identificador', 'assunto')
    list_filter = ('tipo', 'situacao', 'prioridade', 'orgao_demandante', 'ano_solicitacao', 'correlacao_lar', 'atribuicao', 'unidade_auditada')
    search_fields = ('identificador', 'assunto', 'numero_sei', 'numero_processo_externo', 'auditores_responsaveis__nome', 'atribuicao__nome', 'unidade_auditada__sigla', 'unidade_auditada__nome')
    filter_horizontal = ('auditores_responsaveis','unidade_auditada')
    date_hierarchy = 'data_criacao'
    list_per_page = 20
    inlines = [ReuniaoInline]
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
