from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.contrib.auth.views import LogoutView
from rest_framework.routers import DefaultRouter
from processos.views import (
    GrupoViewSet, AuditorViewSet, UnidadeViewSet, TipoProcessoViewSet,
    SituacaoViewSet, CategoriaViewSet, ProcessoViewSet, TipoReuniaoViewSet,
    ReuniaoViewSet, TipoDemandaViewSet, DemandaViewSet
)

# Crie uma instância do DefaultRouter
router = DefaultRouter()

# Registre os viewsets no router
router.register(r'grupos', GrupoViewSet)
router.register(r'auditores', AuditorViewSet)
router.register(r'unidades', UnidadeViewSet)
router.register(r'tipos-processo', TipoProcessoViewSet)
router.register(r'situacoes', SituacaoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'processos', ProcessoViewSet)
router.register(r'tipos-reuniao', TipoReuniaoViewSet)
router.register(r'reunioes', ReuniaoViewSet)
router.register(r'tipos-demanda', TipoDemandaViewSet)
router.register(r'demandas', DemandaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth endpoints
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # DRF login and logout views
    path('api/v1/auth/login/', obtain_auth_token, name='login'),
    path('api/v1/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/v1/auth/', include('rest_framework.urls')),

    # API v1 endpoints
    path('api/v1/', include(router.urls)),  # Inclui as URLs geradas pelo router
    path('api/v1/', include('usuarios.urls')),  # Mantenha outras inclusões conforme necessário
]
