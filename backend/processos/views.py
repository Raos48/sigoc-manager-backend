# processos/views.py
from rest_framework import viewsets
from .models import (
    GrupoAuditor, Auditor, Unidade, TipoProcesso, 
    Situacao, Categoria, Processo, TipoReuniao, Reuniao,Atribuicao
)
from .serializers import (
    GrupoSerializer, AuditorSerializer, UnidadeSerializer, TipoProcessoSerializer,
    SituacaoSerializer, CategoriaSerializer, ProcessoSerializer, TipoReuniaoSerializer,
    ReuniaoSerializer
)
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Processo
from .serializers import ProcessoSerializer

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = GrupoAuditor.objects.all()
    serializer_class = GrupoSerializer
    filterset_fields = ['nome']
    search_fields = ['nome', 'descricao']

class AuditorViewSet(viewsets.ModelViewSet):
    queryset = Auditor.objects.all()
    serializer_class = AuditorSerializer
    filterset_fields = ['grupo']
    search_fields = ['nome', 'email']

class UnidadeViewSet(viewsets.ModelViewSet):
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer   
    search_fields = ['nome']

class TipoProcessoViewSet(viewsets.ModelViewSet):
    queryset = TipoProcesso.objects.all()
    serializer_class = TipoProcessoSerializer
    

class SituacaoViewSet(viewsets.ModelViewSet):
    queryset = Situacao.objects.all()
    serializer_class = SituacaoSerializer
    search_fields = ['nome']

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filterset_fields = ['valor']
    search_fields = ['nome']

class ProcessoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar processos
    
    list:
    Retorna a lista de todos os processos
    
    create:
    Cria um novo processo
    
    retrieve:
    Retorna um processo específico pelo ID
    
    update:
    Atualiza um processo existente
    
    partial_update:
    Atualiza parcialmente um processo existente
    
    destroy:
    Remove um processo existente
    """
    queryset = Processo.objects.all().order_by('-data_criacao')
    serializer_class = ProcessoSerializer
    filterset_fields = [
        'tipo', 'situacao', 'prioridade', 'atribuicao', 
        'orgao_demandante', 'unidade_auditada', 'ano_solicitacao', 
        'correlacao_lar'
    ]
    search_fields = ['identificador', 'assunto', 'numero_sei', 'numero_processo_externo', 'tag']
    
    @action(detail=False, methods=['get'])
    def em_andamento(self, request):
        """Retorna apenas processos em andamento"""
        queryset = self.get_queryset().filter(situacao__nome='Em andamento')
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def arquivar(self, request, pk=None):
        """Arquiva um processo alterando sua situação para Concluído"""
        processo = self.get_object()
        situacao_concluido = Situacao.objects.get(nome='Concluído')
        processo.situacao = situacao_concluido
        processo.save()
        
        serializer = self.get_serializer(processo)
        return Response(serializer.data)

class TipoReuniaoViewSet(viewsets.ModelViewSet):
    queryset = TipoReuniao.objects.all()
    serializer_class = TipoReuniaoSerializer
    filterset_fields = ['tipo']

class ReuniaoViewSet(viewsets.ModelViewSet):
    queryset = Reuniao.objects.all()
    serializer_class = ReuniaoSerializer
    filterset_fields = ['processo', 'tipo']
    search_fields = ['pauta', 'resultado']
