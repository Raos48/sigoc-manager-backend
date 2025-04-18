from rest_framework import viewsets
from .models import TipoDemanda, TipoReuniao, Processo, Reuniao, Atribuicao, GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria
from .serializers import TipoDemandaSerializer, TipoReuniaoSerializer, ProcessoSerializer, ReuniaoSerializer, AtribuicaoSerializer, GrupoAuditorSerializer, AuditorSerializer, UnidadeSerializer, TipoProcessoSerializer, SituacaoSerializer, CategoriaSerializer

class TipoDemandaViewSet(viewsets.ModelViewSet):
    queryset = TipoDemanda.objects.all()
    serializer_class = TipoDemandaSerializer

class TipoReuniaoViewSet(viewsets.ModelViewSet):
    queryset = TipoReuniao.objects.all()
    serializer_class = TipoReuniaoSerializer

class ProcessoViewSet(viewsets.ModelViewSet):
    queryset = Processo.objects.all()
    serializer_class = ProcessoSerializer

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
