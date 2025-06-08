#urls.py do app processo
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardStatsView, TipoDemandaViewSet, TipoReuniaoViewSet, ProcessoViewSet, ReuniaoViewSet,
    AtribuicaoViewSet, GrupoAuditorViewSet, AuditorViewSet, UnidadeViewSet,
    TipoProcessoViewSet, SituacaoViewSet, CategoriaViewSet
)
from .views import get_subprocessos

router = DefaultRouter()
router.register(r'tipos-demanda', TipoDemandaViewSet)
router.register(r'tipos-reuniao', TipoReuniaoViewSet)
router.register(r'processos', ProcessoViewSet)
router.register(r'reunioes', ReuniaoViewSet)
router.register(r'atribuicoes', AtribuicaoViewSet)
router.register(r'grupos-auditores', GrupoAuditorViewSet)
router.register(r'auditores', AuditorViewSet)
router.register(r'unidades', UnidadeViewSet)
router.register(r'tipos-processos', TipoProcessoViewSet)
router.register(r'situacoes', SituacaoViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('processos/<int:pai_id>/subprocessos/', get_subprocessos, name='get_subprocessos'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
