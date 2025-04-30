# usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm
from django.utils.translation import gettext_lazy as _
from .models import Usuario
from django.urls import reverse

class UsuarioChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Usuario
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Certifique-se de que o campo de senha está configurado corretamente
        if 'password' in self.fields:
            self.fields['password'].help_text = self.fields['password'].help_text

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """Define a configuração de administração para o modelo Usuario com email como login."""
    form = UsuarioChangeForm
    list_display = ('email', 'nome_completo', 'cargo', 'is_staff')
    search_fields = ('email', 'nome_completo', 'cargo')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'cargo')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'nome_completo', 'cargo', 'telefone', 'unidade')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
        (_('Personal info'), {
            'fields': ('username', 'nome_completo', 'cargo', 'telefone', 'unidade'),
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups'),
        }),
    )
    
    ordering = ('email',)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.password_url = reverse('admin:auth_user_password_change', args=[obj.id])
        return form
    
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        return readonly_fields
    
    def formfield_for_manytomany(self, db_field, request=None, **kwargs):
        return super().formfield_for_manytomany(db_field, request, **kwargs)
    

    def render_change_form(self, request, context, *args, **kwargs):
        if 'password_url' not in context:
            context['password_url'] = reverse('admin:auth_user_password_change', args=[context['object_id']])
        return super().render_change_form(request, context, *args, **kwargs)