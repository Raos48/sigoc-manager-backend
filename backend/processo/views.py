from rest_framework import viewsets, filters, pagination, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Processo, Tipo, Prioridade, OrgaoDemandante, Situacao, Categoria,
    Atribuicao, Unidade, Auditor, GrupoAuditor, TipoDemanda
)
from .serializers import (
    ProcessoListSerializer, ProcessoCreateUpdateSerializer, ProcessoArvoreSerializer,
    TipoSerializer, PrioridadeSerializer, OrgaoDemandanteSerializer, SituacaoSerializer,
    CategoriaSerializer, AtribuicaoSerializer, UnidadeSerializer, AuditorSerializer,
    GrupoAuditorSerializer, TipoDemandaSerializer 
)



class TipoViewSet(viewsets.ModelViewSet):
    queryset = Tipo.objects.all()
    serializer_class = TipoSerializer

class PrioridadeViewSet(viewsets.ModelViewSet):
    queryset = Prioridade.objects.all()
    serializer_class = PrioridadeSerializer

class OrgaoDemandanteViewSet(viewsets.ModelViewSet):
    queryset = OrgaoDemandante.objects.all()
    serializer_class = OrgaoDemandanteSerializer

class SituacaoViewSet(viewsets.ModelViewSet):
    queryset = Situacao.objects.all()
    serializer_class = SituacaoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class AtribuicaoViewSet(viewsets.ModelViewSet):
    queryset = Atribuicao.objects.all()
    serializer_class = AtribuicaoSerializer
    # --- INÍCIO DA MODIFICAÇÃO ---
    pagination_class = None # Desativa a paginação para este ViewSet
    filter_backends = [filters.SearchFilter] # Habilita a busca
    search_fields = ['nome'] # Define o campo de busca
    # --- FIM DA MODIFICAÇÃO ---

class UnidadeViewSet(viewsets.ModelViewSet):
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer
    # --- INÍCIO DA MODIFICAÇÃO ---
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']


class AuditorViewSet(viewsets.ModelViewSet):    
    queryset = Auditor.objects.all()
    serializer_class = AuditorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class GrupoAuditorViewSet(viewsets.ModelViewSet):
    queryset = GrupoAuditor.objects.all()
    serializer_class = GrupoAuditorSerializer

class TipoDemandaViewSet(viewsets.ModelViewSet):
    queryset = TipoDemanda.objects.all()
    serializer_class = TipoDemandaSerializer


# --- ViewSet principal para Processos ---

class ProcessoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Processos.
    Usa serializers diferentes para leitura e escrita.
    """
    # Usamos 'select_related' para otimizar queries de ForeignKey (1-para-1)
    # e 'prefetch_related' para ManyToMany e OneToMany reversos.
    queryset = Processo.objects.select_related(
        'tipo', 'situacao', 'prioridade', 'categoria', 'orgao_demandante',
        'atribuicao', 'area_demandada', 'pai', 'execucao', 'resposta'
    ).prefetch_related(
        'unidades_auditadas', 'auditores_responsaveis', 'historicos', 'filhos'
    ).all()

    # O campo para buscar um processo específico (ex: /api/processos/12345/)
    lookup_field = 'numero'
    
    # Habilita filtros de busca, como /api/processos/?search=auditoria
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numero', 'assunto', 'numero_processo_externo', 'numero_sei', 'descricao']
    ordering_fields = ['data_cadastro', 'prioridade__nome'] # Permite ordenar por data ou nome da prioridade

    def get_serializer_class(self):
        """
        Retorna o serializer apropriado dependendo da ação (leitura ou escrita).
        """
        if self.action in ['create', 'update', 'partial_update']:
            return ProcessoCreateUpdateSerializer
        # Para 'list', 'retrieve' e ações customizadas, usa o serializer de leitura.
        return ProcessoListSerializer

    @action(detail=True, methods=['get'], url_path='arvore')
    def get_processo_arvore(self, request, numero=None):
        """
        Endpoint customizado para retornar um processo e todos os seus descendentes.
        Acessível em /api/processos/{numero}/arvore/
        """
        processo = self.get_object()
        serializer = ProcessoArvoreSerializer(processo, context={'request': request})
        return Response(serializer.data)


class DashboardStatsView(APIView):
    """
    Endpoint para fornecer estatísticas para o dashboard.
    """
    def get(self, request, *args, **kwargs):
        # A lógica é a mesma, mas agora filtramos pelo nome na tabela relacionada.
        total = Processo.objects.count()
        # Garanta que você tenha Situações com estes nomes no seu banco de dados.
        em_andamento = Processo.objects.filter(situacao__nome__iexact='Em andamento').count()
        pendente = Processo.objects.filter(situacao__nome__iexact='Pendente').count()
        finalizado = Processo.objects.filter(situacao__nome__iexact='Finalizado').count()
        
        data = {
            'totalProcessos': total,
            'processosEmAndamento': em_andamento,
            'processosPendentes': pendente,
            'processosFinalizados': finalizado,
        }
        return Response(data)



# ... outras views ...

class UnidadesByIdsView(APIView):
    """
    Endpoint para buscar múltiplas unidades a partir de uma lista de IDs.
    Exemplo de uso: /api/unidades/by_ids/?ids=1,5,23
    """
    def get(self, request, *args, **kwargs):
        ids_str = request.query_params.get('ids', '')
        if not ids_str:
            return Response([], status=status.HTTP_200_OK)
        try:
            ids = [int(id_str) for id_str in ids_str.split(',')]
        except (ValueError, TypeError):
            return Response(
                {"error": "Os IDs devem ser uma lista de números inteiros separados por vírgula."},
                status=status.HTTP_400_BAD_REQUEST
            )
        queryset = Unidade.objects.filter(id__in=ids)
        serializer = UnidadeSerializer(queryset, many=True)
        return Response(serializer.data)


class AuditoresByIdsView(APIView):
    def get(self, request, *args, **kwargs):
        ids_str = request.query_params.get('ids', '')
        if not ids_str:
            return Response([], status=status.HTTP_200_OK)
        try:
            ids = [int(id_str) for id_str in ids_str.split(',')]
        except (ValueError, TypeError):
            return Response({"error": "IDs inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Auditor.objects.filter(id__in=ids)
        serializer = AuditorSerializer(queryset, many=True)
        return Response(serializer.data)    
