# processo/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import (
    # Modelos principais e de suporte
    Processo, Auditor, GrupoAuditor, Categoria, Atribuicao, Unidade, TipoDemanda,
    # Modelos de domínio (tabelas de opções)
    Tipo, Prioridade, OrgaoDemandante, Situacao,
    # Modelos de relação e submodelos
    HierarquiaProcesso, Execucao, Resposta, HistoricoProcesso
)

# --- Inlines (sem alterações) ---

class ExecucaoInline(admin.StackedInline):
    model = Execucao
    can_delete = False
    verbose_name_plural = 'Detalhes da Execução (para Ações)'
    classes = ['collapse']

class RespostaInline(admin.StackedInline):
    model = Resposta
    can_delete = False
    verbose_name_plural = 'Detalhes da Resposta (Prazos e Prorrogação)'
    classes = ['collapse']

class SubprocessoInline(admin.TabularInline):
    model = Processo
    fk_name = 'pai'
    extra = 0
    fields = ('numero', 'assunto', 'tipo', 'situacao')
    readonly_fields = ('numero', 'assunto', 'tipo', 'situacao')
    show_change_link = True
    verbose_name = "Subprocesso"
    verbose_name_plural = "Subprocessos"
    def has_add_permission(self, request, obj=None):
        return False

class HistoricoProcessoInline(admin.TabularInline):
    model = HistoricoProcesso
    extra = 0
    fields = ('data', 'alterado_por', 'tipo_alteracao', 'display_alteracoes')
    readonly_fields = fields
    can_delete = False
    verbose_name = "Registro de Histórico"
    verbose_name_plural = "Histórico de Alterações"
    def has_add_permission(self, request, obj=None):
        return False
    def has_change_permission(self, request, obj=None):
        return False

# --- Customização Principal do Admin para o Modelo Processo (sem alterações) ---

@admin.register(Processo)
class ProcessoAdmin(admin.ModelAdmin):
    list_display = (
        'numero', 'assunto', 'tipo', 'situacao', 'prioridade', 'get_pai_link'
    )
    list_filter = ('tipo', 'situacao', 'prioridade', 'orgao_demandante')
    search_fields = ('numero', 'assunto', 'numero_processo_externo','documento_sei', 'numero_sei')
    filter_horizontal = ('unidades_auditadas', 'auditores_responsaveis')
    readonly_fields = ('numero', 'data_cadastro', 'data_atualizacao')
    fieldsets = (
        ("1. Informações Centrais (Comum a Todos)", {
            'fields': (
                'numero', 'assunto', 'tipo', 'pai',
                ('situacao', 'prioridade'),
                'categoria', 'observacao'
            )
        }),
        ("2. Detalhes Específicos por Tipo (Recolhido)", {
            'classes': ('collapse',),
            'description': "Preencha os campos abaixo de acordo com o 'Tipo' de processo selecionado.",
            'fields': (
                ('orgao_demandante', 'numero_processo_externo'),
                ('numero_sei','documento_sei', 'data_documento_sei'),
                'ano_solicitacao', 'correlacao_lar', 'atribuicao',
                'tipo_demanda', 'area_demandada', 'identificacao_achados', 'descricao'
            )
        }),
        ("3. Envolvidos (Recolhido)", {
            'classes': ('collapse',),
            'fields': ('auditores_responsaveis', 'unidades_auditadas')
        }),
        ("4. Datas de Controle", {
            'fields': ('data_cadastro', 'data_atualizacao')
        })
    )
    inlines = [ExecucaoInline, RespostaInline, SubprocessoInline, HistoricoProcessoInline]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('tipo', 'situacao', 'prioridade', 'pai')

    @admin.display(description='Processo Pai')
    def get_pai_link(self, obj):
        if obj.pai:
            link = f"/admin/{obj._meta.app_label}/{obj._meta.model_name}/{obj.pai.id}/change/"
            return format_html('<a href="{}">{}</a>', link, obj.pai)
        return "-"

# --- Registro dos outros modelos no Admin (sem alterações) ---
admin.site.register(Tipo)
admin.site.register(Prioridade)
admin.site.register(OrgaoDemandante)
admin.site.register(Situacao)
admin.site.register(Unidade)
admin.site.register(Atribuicao)
admin.site.register(Categoria)
admin.site.register(TipoDemanda)
admin.site.register(Auditor)
admin.site.register(GrupoAuditor)
admin.site.register(HierarquiaProcesso)


# --- [CORRIGIDO] Registro do HistóricoAdmin ---
@admin.register(HistoricoProcesso)
class HistoricoProcessoAdmin(admin.ModelAdmin):
    list_display = ('processo', 'data', 'tipo_alteracao', 'alterado_por')
    list_filter = ('tipo_alteracao', 'data', 'alterado_por')
    search_fields = ('processo__numero', 'processo__assunto')
    readonly_fields = (
        'processo', 'data', 'alterado_por', 'tipo_alteracao',
        'display_alteracoes', 'observacao_geral',
    )
    fieldsets = (
        (None, {'fields': ('processo', 'data', 'alterado_por', 'tipo_alteracao')}),
        ('Detalhes da Alteração', {'fields': ('display_alteracoes', 'observacao_geral')}),
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


