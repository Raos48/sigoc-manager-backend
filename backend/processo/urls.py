from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # ViewSets para cada modelo
    ProcessoViewSet,
    TipoViewSet,
    PrioridadeViewSet,
    OrgaoDemandanteViewSet,
    SituacaoViewSet,
    CategoriaViewSet,
    AtribuicaoViewSet,
    UnidadeViewSet,
    AuditorViewSet,
    GrupoAuditorViewSet,
    TipoDemandaViewSet,
    DashboardStatsView,
    UnidadesByIdsView,
    AuditoresByIdsView,
)

# O DefaultRouter cria automaticamente as rotas para as ações padrão
# (list, create, retrieve, update, partial_update, destroy).
router = DefaultRouter()

# Registrando cada ViewSet com um prefixo de URL
router.register(r'processos', ProcessoViewSet, basename='processo')
router.register(r'tipos', TipoViewSet, basename='tipo')
router.register(r'prioridades', PrioridadeViewSet, basename='prioridade')
router.register(r'orgaos-demandantes', OrgaoDemandanteViewSet, basename='orgao-demandante')
router.register(r'situacoes', SituacaoViewSet, basename='situacao')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'atribuicoes', AtribuicaoViewSet, basename='atribuicao')
router.register(r'unidades', UnidadeViewSet, basename='unidade')
router.register(r'auditores', AuditorViewSet, basename='auditor')
router.register(r'grupos-auditores', GrupoAuditorViewSet, basename='grupo-auditor')
router.register(r'tipos-demanda', TipoDemandaViewSet, basename='tipo-demanda')



urlpatterns = [
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('unidades/by_ids/', UnidadesByIdsView.as_view(), name='unidades-by-ids'),
    path('auditores/by_ids/', AuditoresByIdsView.as_view(), name='auditores-by-ids'),
    path('', include(router.urls)),
]
