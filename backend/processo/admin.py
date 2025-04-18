from django.contrib import admin
from django.utils.html import format_html
from .models import Processo, TipoDemanda, TipoReuniao, Atribuicao, GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria

class SubprocessoInline(admin.StackedInline):
    model = Processo
    fk_name = 'pai'
    extra = 0
    verbose_name = "Subprocesso"
    verbose_name_plural = "Subprocessos"
    show_change_link = True
    # Remova a linha 'fields' para mostrar todos os campos
    # fields = ('assunto', 'tipo', 'situacao', 'prioridade')
    readonly_fields = ('identificador',)


class ProcessoAdmin(admin.ModelAdmin):
    list_display = ('identificador', 'assunto', 'tipo_processo', 'situacao', 
                    'prioridade', 'get_pai', 'possui_subprocessos')
    list_filter = ('tipo', 'situacao', 'prioridade', 'orgao_demandante', 
                  'ano_solicitacao', 'categoria')
    search_fields = ('identificador', 'assunto', 'numero_sei', 'numero_processo_externo')
    inlines = [SubprocessoInline]
    readonly_fields = ('identificador',)  # Define identificador como somente leitura
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': (('identificador',), ('assunto',), ('tipo', 'tipo_processo'), 
                      ('situacao', 'prioridade'), 'pai')
        }),
        ('Detalhes do Processo', {
            'fields': ('orgao_demandante', 'numero_processo_externo', 
                      'ano_solicitacao', 'categoria', 'atribuicao',
                      'numero_sei', 'descricao', 'tag')
        }),
        ('Responsáveis e Unidades', {
            'fields': ('auditores_responsaveis', 'unidade_auditada')
        }),
        ('Datas e Prazos', {
            'fields': ('prazo', 'prazo_inicial', 'data_resposta', 
                      'data_envio_resposta', 'data_reiteracao')
        }),
        ('Informações Adicionais', {
            'classes': ('collapse',),
            'fields': ('correlacao_lar', 'reiterado', 'observacao', 
                      'achados', 'identificacao_achados')
        }),
    )
    
    def get_pai(self, obj):
        if obj.pai:
            return format_html(
                '<a href="{}">{} - {}</a>',
                f"/admin/processo/processo/{obj.pai.id}/change/",
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
        """Otimiza as consultas para carregar relacionamentos relacionados"""
        queryset = super().get_queryset(request)
        return queryset.select_related('tipo_processo', 'situacao', 'categoria', 'pai')

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
