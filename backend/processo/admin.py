from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Processo, TipoDemanda, TipoReuniao, Atribuicao,
    GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria
)

class SubprocessoInline(admin.StackedInline):
    model = Processo
    fk_name = 'pai'
    extra = 0
    verbose_name = "Subprocesso"
    verbose_name_plural = "Subprocessos"
    show_change_link = True
    readonly_fields = ('identificador',)
    # Para evitar problemas de recursão em subprocessos não permitidos (ex: ação só pode ter pai do tipo determinação)
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Aqui, poderíamos filtrar por tipo, se desejado
        return qs

class ProcessoAdmin(admin.ModelAdmin):
    list_display = (
        'identificador', 'assunto', 'tipo', 'tipo_processo',
        'situacao', 'prioridade', 'get_pai', 'possui_subprocessos'
    )
    list_filter = (
        'tipo', 'situacao', 'prioridade', 'orgao_demandante',
        'ano_solicitacao', 'categoria'
    )
    search_fields = ('identificador', 'assunto', 'numero_sei', 'numero_processo_externo')
    inlines = [SubprocessoInline]
    readonly_fields = ('identificador',)

    # Inclui o novo campo "solicitacao_prorrogacao"
    fieldsets = (
        ('Informações Básicas', {
            'fields': (
                ('identificador',), ('assunto',), ('tipo', 'tipo_processo'),
                ('situacao', 'prioridade'), 'pai'
            )
        }),
        ('Detalhes do Processo', {
            'fields': (
                'orgao_demandante', 'numero_processo_externo',
                'ano_solicitacao', 'categoria', 'atribuicao',
                'numero_sei', 'descricao', 'tag'
            )
        }),
        ('Responsáveis e Unidades', {
            'fields': ('auditores_responsaveis', 'unidade_auditada')
        }),
        ('Datas e Prazos', {
            'fields': (
                'prazo', 'prazo_inicial', 'data_resposta',
                'data_envio_resposta', 'data_reiteracao'
            )
        }),
        ('Prazos e Solicitação de Prorrogação', {
            'fields': ('solicitacao_prorrogacao',),  # <-- NOVO
        }),
        ('Informações Adicionais', {
            'classes': ('collapse',),
            'fields': (
                'correlacao_lar', 'reiterado', 'observacao',
                'achados', 'identificacao_achados'
            )
        }),
    )

    def get_pai(self, obj):
        if obj.pai:
            return format_html(
                '<a href="{}">{} - {}</a>',
                f"/admin/{obj._meta.app_label}/{obj._meta.model_name}/{obj.pai.id}/change/",
                obj.pai.identificador,
                obj.pai.assunto[:50] + ('...' if len(obj.pai.assunto) > 50 else '')
            )
        return "-"
    get_pai.short_description = "Processo Pai"

    def possui_subprocessos(self, obj):
        count = obj.subprocessos.count()
        if count > 0:
            return format_html(
                '<span style="color: green;">✓</span> ({} subprocesso{})'.format(
                    count, 's' if count > 1 else ''
                )
            )
        return format_html('<span style="color: red;">✗</span>')
    possui_subprocessos.short_description = "Subprocessos"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related(
            'tipo_processo', 'situacao', 'categoria', 'pai'
        )

    # Sugestão: Torna os campos obrigatórios mais fáceis de ver (apenas para o admin forms)
    # Campos obrigatórios por tipo de processo, para ajudar o usuário/admin:

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Exemplo: campos obrigatórios geridos apenas visual/dinamicamente
        from django import forms

        tipo = (obj.tipo if obj else request.GET.get('tipo'))
        if tipo in ['recomendacao', 'determinacao']:
            form.base_fields['solicitacao_prorrogacao'].required = True
            form.base_fields['prazo_inicial'].required = True
            form.base_fields['unidade_auditada'].required = True
        if tipo == 'acao':
            form.base_fields['area_demandada'].required = True
            form.base_fields['prazo_inicial'].required = True
            form.base_fields['duracao_execucao'].required = True
            form.base_fields['forma_execucao'].required = True
            form.base_fields['resultado_pretendido'].required = True
        return form

# Registra os modelos no admin
admin.site.register(Processo, ProcessoAdmin)
admin.site.register(TipoDemanda)
admin.site.register(TipoReuniao)
admin.site.register(Atribuicao)
admin.site.register(GrupoAuditor)
admin.site.register(Auditor)
admin.site.register(Unidade)
admin.site.register(TipoProcesso)
admin.site.register(Situacao)
admin.site.register(Categoria)
