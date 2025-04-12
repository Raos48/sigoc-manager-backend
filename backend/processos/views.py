from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from .models import (
    GrupoAuditor, Auditor, Unidade, TipoProcesso,
    Situacao, Categoria, Processo, TipoReuniao, Reuniao, Atribuicao,
    Demanda, TipoDemanda
)
from .serializers import (
    GrupoSerializer, AuditorSerializer, UnidadeSerializer, TipoProcessoSerializer,
    SituacaoSerializer, CategoriaSerializer, ProcessoSerializer, TipoReuniaoSerializer,
    ReuniaoSerializer, DemandaSerializer, TipoDemandaSerializer
)

# Função auxiliar para paginação
def paginate_queryset(request, queryset, serializer_class):
    paginator = PageNumberPagination()
    page = paginator.paginate_queryset(queryset, request)
    if page is not None:
        serializer = serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    serializer = serializer_class(queryset, many=True)
    return Response(serializer.data)

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = GrupoAuditor.objects.all()
    serializer_class = GrupoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['nome', 'descricao']
    search_fields = ['nome', 'descricao']

class AuditorViewSet(viewsets.ModelViewSet):
    queryset = Auditor.objects.all()
    serializer_class = AuditorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['grupo']
    search_fields = ['nome', 'email']

class UnidadeViewSet(viewsets.ModelViewSet):
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['nome']

class TipoProcessoViewSet(viewsets.ModelViewSet):
    queryset = TipoProcesso.objects.all()
    serializer_class = TipoProcessoSerializer

class SituacaoViewSet(viewsets.ModelViewSet):
    queryset = Situacao.objects.all()
    serializer_class = SituacaoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['nome']

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['valor']
    search_fields = ['nome']

class ProcessoViewSet(viewsets.ModelViewSet):
    queryset = Processo.objects.all().order_by('-data_criacao')
    serializer_class = ProcessoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['tipo', 'situacao', 'prioridade', 'atribuicao', 'orgao_demandante', 'unidade_auditada', 'ano_solicitacao', 'correlacao_lar']
    search_fields = ['identificador', 'assunto', 'numero_sei', 'numero_processo_externo', 'tag']

    @action(detail=True, methods=['post'])
    def arquivar(self, request, pk=None):
        processo = self.get_object()
        situacao_concluido = Situacao.objects.get(nome='Concluído')
        processo.situacao = situacao_concluido
        processo.save()
        serializer = self.get_serializer(processo)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def em_andamento(self, request):
        queryset = self.get_queryset().filter(situacao__nome='Em andamento')
        return paginate_queryset(request, queryset, self.serializer_class)

class TipoReuniaoViewSet(viewsets.ModelViewSet):
    queryset = TipoReuniao.objects.all()
    serializer_class = TipoReuniaoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['tipo']

class ReuniaoViewSet(viewsets.ModelViewSet):
    queryset = Reuniao.objects.all()
    serializer_class = ReuniaoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['processo', 'tipo']
    search_fields = ['pauta', 'resultado']

class TipoDemandaViewSet(viewsets.ModelViewSet):
    queryset = TipoDemanda.objects.all()
    serializer_class = TipoDemandaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['nome']

class DemandaViewSet(viewsets.ModelViewSet):
    queryset = Demanda.objects.all()
    serializer_class = DemandaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['processo', 'tipo_demanda', 'situacao']
    search_fields = ['assunto']
