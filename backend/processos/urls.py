# processos/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GrupoViewSet, AuditorViewSet, UnidadeViewSet, TipoProcessoViewSet,
    SituacaoViewSet, CategoriaViewSet, ProcessoViewSet, TipoReuniaoViewSet,
    ReuniaoViewSet
)

router = DefaultRouter()
router.register(r'grupos', GrupoViewSet)
router.register(r'auditores', AuditorViewSet)
router.register(r'unidades', UnidadeViewSet)
router.register(r'tipos-processo', TipoProcessoViewSet)
router.register(r'situacoes', SituacaoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'processos', ProcessoViewSet)
router.register(r'tipos-reuniao', TipoReuniaoViewSet)
router.register(r'reunioes', ReuniaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
