# usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, UserDetailView


router = DefaultRouter()
router.register(r'list', UsuarioViewSet, basename='usuario-list')

urlpatterns = [
    path('me/', UserDetailView.as_view(), name='user-detail'),
    path('', include(router.urls)),
]