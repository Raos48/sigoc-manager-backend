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
logger = logging.getLogger(__name__)

class TipoDemandaViewSet(viewsets.ModelViewSet):
    queryset = TipoDemanda.objects.all()
    serializer_class = TipoDemandaSerializer

class TipoReuniaoViewSet(viewsets.ModelViewSet):
    queryset = TipoReuniao.objects.all()
    serializer_class = TipoReuniaoSerializer

class ProcessoViewSet(viewsets.ModelViewSet):
    queryset = Processo.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProcessoCreateUpdateSerializer
        return ProcessoListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        logger.info(f"Parâmetro de busca recebido: {search}")

        if search:
            queryset = queryset.filter(
                Q(assunto__icontains=search) |
                Q(identificador__icontains=search) |
                Q(numero_sei__icontains=search) |
                Q(numero_processo_externo__icontains=search)
            )
            logger.info(f"Queryset após filtragem: {queryset.query}")

        return queryset

    @action(detail=True, methods=['get'], url_path='arvore')
    def arvore(self, request, pk=None):
        """
        Retorna o processo e toda sua árvore de subprocessos (recursivamente).
        """
        processo = self.get_object()
        serializer = ProcessoArvoreSerializer(processo, context={'request': request})
        return Response(serializer.data)




class ReuniaoViewSet(viewsets.ModelViewSet):
    queryset = Reuniao.objects.all()
    serializer_class = ReuniaoSerializer

class AtribuicaoViewSet(viewsets.ModelViewSet):
    queryset = Atribuicao.objects.all()
    serializer_class = AtribuicaoSerializer

class GrupoAuditorViewSet(viewsets.ModelViewSet):
    queryset = GrupoAuditor.objects.all()
    serializer_class = GrupoAuditorSerializer

class AuditorViewSet(viewsets.ModelViewSet):
    queryset = Auditor.objects.all()
    serializer_class = AuditorSerializer

class UnidadeViewSet(viewsets.ModelViewSet):
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer

class TipoProcessoViewSet(viewsets.ModelViewSet):
    queryset = TipoProcesso.objects.all()
    serializer_class = TipoProcessoSerializer

class SituacaoViewSet(viewsets.ModelViewSet):
    queryset = Situacao.objects.all()
    serializer_class = SituacaoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

@api_view(['GET'])
def get_subprocessos(request, pai_id):
    subprocessos = Processo.objects.filter(pai_id=pai_id)
    serializer = ProcessoListSerializer(subprocessos, many=True)  # Substituir ProcessoSerializer por ProcessoListSerializer
    return Response(serializer.data)


