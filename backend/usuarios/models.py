# usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Usuario(AbstractUser):
    """Extensão do modelo User padrão do Django"""
    nome_completo = models.CharField(_('Nome completo'), max_length=150, blank=True)
    cargo = models.CharField(_('Cargo'), max_length=100, blank=True)
    telefone = models.CharField(_('Telefone'), max_length=20, blank=True)
    unidade = models.CharField(_('Unidade'), max_length=100, blank=True)
    email = models.EmailField(_('E-mail'), blank=True)

    class Meta:
        verbose_name = _('usuário')
        verbose_name_plural = _('usuários')

    def __str__(self):
        return self.username
