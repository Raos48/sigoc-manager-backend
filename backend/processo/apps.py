# seu_app/apps.py

from django.apps import AppConfig

class ProcessosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'processo' # Verifique se este é o nome correto da sua app

    def ready(self):
        # Importa os sinais para que sejam registrados quando a aplicação iniciar
        import processo.signals