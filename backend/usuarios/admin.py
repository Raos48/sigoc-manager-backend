# usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """Define a configuração de administração para o modelo Usuario customizado."""
    list_display = ('username', 'email', 'nome_completo', 'cargo', 'is_staff')
    search_fields = ('username', 'nome_completo', 'email', 'cargo')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'cargo')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('nome_completo', 'email', 'cargo', 'telefone', 'unidade')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        (_('Personal info'), {
            'fields': ('nome_completo', 'email', 'cargo', 'telefone', 'unidade'),
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups'),
        }),
    )
