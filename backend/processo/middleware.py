# processo/middleware.py

# threading.local() cria um espaço de armazenamento que é seguro e isolado
# para cada requisição, evitando que dados de um usuário vazem para outro.
import threading

_thread_locals = threading.local()

def get_current_user():
    """Retorna o usuário que está fazendo a requisição atual."""
    return getattr(_thread_locals, 'user', None)

class CurrentUserMiddleware:
    """
    Middleware que armazena o objeto 'user' da requisição em um
    armazenamento local da thread. Isso o torna disponível para outras
    partes do código (como os signals) que não têm acesso direto ao objeto request.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Armazena o usuário antes da view ser processada
        _thread_locals.user = request.user if request.user.is_authenticated else None
        
        response = self.get_response(request)

        # Limpa o usuário depois que a resposta foi gerada
        if hasattr(_thread_locals, 'user'):
            del _thread_locals.user
            
        return response