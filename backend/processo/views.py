# seu_app/views.py (VERSÃO CORRIGIDA)

from rest_framework import viewsets
from django.db.models import Q
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import (
    TipoDemanda, TipoReuniao, Processo, Reuniao, Atribuicao,
    GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria
)
from .serializers import (
    TipoDemandaSerializer, TipoReuniaoSerializer, ProcessoListSerializer, ProcessoCreateUpdateSerializer,
    ReuniaoSerializer, AtribuicaoSerializer, GrupoAuditorSerializer,
    AuditorSerializer, UnidadeSerializer, TipoProcessoSerializer,
    SituacaoSerializer, CategoriaSerializer
)
from .serializers import ProcessoArvoreSerializer
import logging
from rest_framework.views import APIView
from rest_framework import viewsets, pagination 
from rest_framework import filters

class StandardPagination(pagination.PageNumberPagination):
    """
    Classe de paginação padrão com um page_size configurável via query param.
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


logger = logging.getLogger(__name__)

class TipoDemandaViewSet(viewsets.ModelViewSet):
    # 👇 CORREÇÃO: Adicionada ordenação
    queryset = TipoDemanda.objects.all().order_by('nome')
    serializer_class = TipoDemandaSerializer

class TipoReuniaoViewSet(viewsets.ModelViewSet):
    # 👇 CORREÇÃO: Adicionada ordenação
    queryset = TipoReuniao.objects.all().order_by('nome')
    serializer_class = TipoReuniaoSerializer

class ProcessoViewSet(viewsets.ModelViewSet):
    # O modelo 'Processo' já tem uma ordenação padrão, então está OK.
    queryset = Processo.objects.all().prefetch_related('unidade_auditada', 'auditores_responsaveis') 
    lookup_field = 'identificador'
    filter_backends = [filters.SearchFilter]
    search_fields = ['identificador', 'assunto', 'numero_sei', 'numero_processo_externo']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProcessoCreateUpdateSerializer
        return ProcessoListSerializer

    @action(detail=True, methods=['get'], url_path='arvore')
    def arvore(self, request, pk=None):
        processo = self.get_object()
        serializer = ProcessoArvoreSerializer(processo, context={'request': request})
        return Response(serializer.data)

class DashboardStatsView(APIView):
    def get(self, request, *args, **kwargs):
        total = Processo.objects.count()
        ativos = Processo.objects.filter(situacao__nome='Em andamento').count()
        pendentes = Processo.objects.filter(situacao__nome='Pendente').count()
        finalizados = Processo.objects.filter(situacao__nome='Finalizado').count()
        
        data = {
            'totalProcessos': total,
            'processosAtivos': ativos,
            'processosPendentes': pendentes,
            'processosFinalizados': finalizados,
        }
        return Response(data)

class ReuniaoViewSet(viewsets.ModelViewSet):
    # O modelo 'Reuniao' já tem ordenação, está OK.
    queryset = Reuniao.objects.all()
    serializer_class = ReuniaoSerializer

class AtribuicaoViewSet(viewsets.ModelViewSet):
    # O modelo 'Atribuicao' já tem ordenação, está OK.
    queryset = Atribuicao.objects.all()
    serializer_class = AtribuicaoSerializer
    pagination_class = StandardPagination 

class GrupoAuditorViewSet(viewsets.ModelViewSet):
    # 👇 CORREÇÃO: Adicionada ordenação
    queryset = GrupoAuditor.objects.all().order_by('nome')
    serializer_class = GrupoAuditorSerializer

class AuditorViewSet(viewsets.ModelViewSet):
    # O modelo 'Auditor' já tem ordenação, está OK.
    queryset = Auditor.objects.all()
    serializer_class = AuditorSerializer
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class UnidadeViewSet(viewsets.ModelViewSet):
    # O modelo 'Unidade' já tem ordenação, está OK.
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class TipoProcessoViewSet(viewsets.ModelViewSet):
    # 👇 CORREÇÃO: Adicionada ordenação (conforme o log de erro)
    queryset = TipoProcesso.objects.all().order_by('nome')
    serializer_class = TipoProcessoSerializer

class SituacaoViewSet(viewsets.ModelViewSet):
    # 👇 CORREÇÃO: Adicionada ordenação (conforme o log de erro)
    queryset = Situacao.objects.all().order_by('nome')
    serializer_class = SituacaoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    # O modelo 'Categoria' já tem ordenação, está OK.
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

@api_view(['GET'])
def get_subprocessos(request, pai_id):
    # 👇 CORREÇÃO: Adicionada ordenação também aqui
    subprocessos = Processo.objects.filter(pai_id=pai_id).order_by('data_criacao')
    serializer = ProcessoListSerializer(subprocessos, many=True) 
    return Response(serializer.data)