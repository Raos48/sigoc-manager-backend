from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Usuario

class UsuarioChangeForm(UserChangeForm):
    """
    Formulário para alterar instâncias de Usuario.
    """
    class Meta(UserChangeForm.Meta):
        model = Usuario

class UsuarioAdmin(BaseUserAdmin):
    """
    Configuração da interface de administração para o modelo Usuario.
    """
    # O formulário a ser usado para criar e alterar usuários
    form = UsuarioChangeForm

    # Campos a serem exibidos na lista de usuários
    list_display = ('email', 'nome_completo', 'cargo', 'unidade', 'is_staff', 'is_active')
    
    # Filtros disponíveis na barra lateral direita
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'cargo', 'unidade')
    
    # Campos pesquisáveis
    search_fields = ('email', 'nome_completo', 'cargo')
    
    # Ordem padrão
    ordering = ('email',)

    # Campos exibidos no formulário de alteração (edição de um usuário existente)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Informações Pessoais'), {'fields': ('nome_completo', 'cargo', 'telefone', 'unidade')}),
        (_('Permissões'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Datas Importantes'), {'fields': ('last_login', 'date_joined')}),
    )

    # Campos exibidos no formulário de criação (adição de um novo usuário)
    # Note que usamos 'password' e 'password2' para confirmação de senha
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2', 'nome_completo', 'cargo', 'unidade', 'telefone'),
        }),
        (_('Permissões'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups'),
        }),
    )

    # Correção do erro AttributeError
    def get_form(self, request, obj=None, **kwargs):
        """
        Sobrescreve o método para adicionar o link de mudança de senha
        apenas quando o objeto (usuário) já existe.
        """
        form = super().get_form(request, obj, **kwargs)
        
        # Adiciona o link de mudança de senha apenas se o objeto já foi salvo (não é None)
        if obj:
            # Precisamos usar o nome da view do admin do Django padrão
            # que é 'admin:auth_user_password_change' para o modelo User padrão,
            # ou o nome correto para o seu app se você tiver customizado as URLs.
            # Como você usa 'usuarios_usuario', a URL correta é 'admin:usuarios_usuario_password_change'.
            # Mas, uma forma mais segura é usar o próprio objeto _meta.
            app_label = self.model._meta.app_label
            model_name = self.model._meta.model_name
            password_change_url_name = f'admin:{app_label}_{model_name}_password_change'
            
            try:
                # O campo 'password' no formulário do admin tem um help_text que pode ser modificado.
                # Aqui adicionamos um link para a página de alteração de senha.
                password_field = form.base_fields.get('password')
                if password_field:
                    password_change_url = reverse(password_change_url_name, args=[obj.pk])
                    password_field.help_text = format_html(
                        _('As senhas brutas não são armazenadas, então não há como ver a senha deste usuário, mas você pode alterar a senha usando <a href="{}">este formulário</a>.'),
                        password_change_url
                    )
            except:
                # Ignora o erro se a URL não puder ser resolvida por algum motivo.
                pass
        
        return form

# Registra o modelo Usuario com a classe de admin customizada
admin.site.register(Usuario, UsuarioAdmin)