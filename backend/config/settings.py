
from pathlib import Path
from datetime import timedelta
import os



BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = "django-insecure-c_lb86idpic!1xbj-@!5q@0-flaxu(qbr#2g2+x+f0!e=sojco"
DEBUG = False
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "38.242.207.139", "*", "sigoc.online","sigoc-sigoc.bpbeee.easypanel.host"]



INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Bibliotecas de terceiros
    'rest_framework',
    'rest_framework_simplejwt',
    'django_filters',
    'corsheaders',
    
    # Apps do projeto
    "processo",
    "usuarios",
]

# ===== MIDDLEWARE ATUALIZADO =====
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # Adicione esta linha para servir arquivos estáticos
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "processo.middleware.CurrentUserMiddleware", 
]


ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

AUTH_USER_MODEL = 'usuarios.Usuario'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }


# E mantenha a configuração SQLite padrão
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db" / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Modelo de usuário personalizado
AUTH_USER_MODEL = 'usuarios.Usuario'

# Internationalization - Configuração para PT-BR
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
] if os.path.exists(os.path.join(BASE_DIR, 'static')) else []


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')





# ===== CONFIGURAÇÕES DE SEGURANÇA CORRIGIDAS =====
# Para produção (quando DEBUG=False)
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
else:
    # Para desenvolvimento local
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Configuração para REST Frameworkf
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        #'rest_framework.permissions.AllowAny',
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}


# Configurações CORS
# CORS_ALLOW_ALL_ORIGINS = False  # Desativado para maior segurança
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://localhost:5173",  # Origem do seu frontend
# ]



# =================== CONFIGURAÇÕES CORS CORRIGIDAS ===================
CORS_ALLOW_CREDENTIALS = True  # Permite envio de cookies

# Substitua a sua configuração antiga por esta lista simples e correta.
CORS_ALLOWED_ORIGINS = [
    "https://sigoc-sigoc-frontend.bpbeee.easypanel.host", # URL do Frontend
    "https://sigoc-sigoc.bpbeee.easypanel.host",        # URL do Backend (útil para o admin)
    "https://sigoc.online",
    "http://localhost:5173",  # Para desenvolvimento local do frontend
    "http://localhost:3000",
    "http://localhost:8080",
]
# =====================================================================


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Define o tempo de expiração do token de acesso
    'REFRESH_TOKEN_LIFETIME': timedelta(days=0), # Define o tempo de expiração do token de refresh para zero
    'ROTATE_REFRESH_TOKENS': False,             # Não rotaciona tokens de refresh
    'BLACKLIST_AFTER_ROTATION': False,          # Não usa blacklist para tokens de refresh
    'AUTH_HEADER_TYPES': ('Bearer',),
}


CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = not DEBUG


CSRF_TRUSTED_ORIGINS = [
    "https://sigoc.online",
    "https://sigoc-sigoc.bpbeee.easypanel.host"
]



LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# Independentemente do DEBUG
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SECURE_SSL_REDIRECT = False
