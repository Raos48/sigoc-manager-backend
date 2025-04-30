# usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UsuarioManager(BaseUserManager):
    """Manager personalizado para o modelo Usuario com email como identificador único"""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O endereço de email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractUser):
    """Extensão do modelo User padrão do Django com email como identificador principal"""
    username = models.CharField(_('Username'), max_length=150, blank=True, null=True)
    email = models.EmailField(_('E-mail'), unique=True)
    nome_completo = models.CharField(_('Nome completo'), max_length=150, blank=True)
    cargo = models.CharField(_('Cargo'), max_length=100, blank=True)
    telefone = models.CharField(_('Telefone'), max_length=20, blank=True)
    unidade = models.CharField(_('Unidade'), max_length=100, blank=True)
    
    USERNAME_FIELD = 'email'  # Define email como campo para login
    REQUIRED_FIELDS = []  # Email já é obrigatório por padrão
    
    objects = UsuarioManager()
    
    class Meta:
        verbose_name = _('usuário')
        verbose_name_plural = _('usuários')
    
    def __str__(self):
        return self.email
