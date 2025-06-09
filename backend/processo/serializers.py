from rest_framework import serializers
from .models import (
    Processo, Execucao, Resposta, HistoricoProcesso,
    Tipo, Prioridade, OrgaoDemandante, Situacao, Categoria, Atribuicao,
    Unidade, Auditor, GrupoAuditor, TipoDemanda
)




# ==========================================================
# 1. DEFINA O SERIALIZER DE RESUMO PRIMEIRO
#    Ele não depende de nenhum outro serializer de processo.
# ==========================================================
class ProcessoSummarySerializer(serializers.ModelSerializer):
    """Serializer resumido para representar processos em listas (pai/filho)."""
    tipo = serializers.StringRelatedField(read_only=True)
    situacao = serializers.StringRelatedField(read_only=True)
    prioridade = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Processo
        fields = [
            'id', 'numero', 'assunto', 'tipo',
            'situacao', 'prioridade', 'data_cadastro', 'data_atualizacao'
        ]
        read_only_fields = fields


# --- Serializers para Modelos de Suporte e Domínio ---
# Estes estão corretos e não precisam de alteração.
class TipoSerializer(serializers.ModelSerializer):
    class Meta: model = Tipo; fields = '__all__'

class PrioridadeSerializer(serializers.ModelSerializer):
    class Meta: model = Prioridade; fields = '__all__'

class OrgaoDemandanteSerializer(serializers.ModelSerializer):
    class Meta: model = OrgaoDemandante; fields = '__all__'

class SituacaoSerializer(serializers.ModelSerializer):
    class Meta: model = Situacao; fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta: model = Categoria; fields = '__all__'

class AtribuicaoSerializer(serializers.ModelSerializer):
    class Meta: model = Atribuicao; fields = '__all__'

class UnidadeSerializer(serializers.ModelSerializer):
    class Meta: model = Unidade; fields = '__all__'

class AuditorSerializer(serializers.ModelSerializer):
    class Meta: model = Auditor; fields = '__all__'

class GrupoAuditorSerializer(serializers.ModelSerializer):
    class Meta: model = GrupoAuditor; fields = '__all__'

class TipoDemandaSerializer(serializers.ModelSerializer):
    class Meta: model = TipoDemanda; fields = '__all__'

# --- Serializers para Submodelos (Dados Aninhados) ---

class ExecucaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execucao
        # [CORRETO] Excluir 'processo' é a abordagem certa para criação aninhada.
        exclude = ['processo']

class RespostaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        # [CORRIGIDO] O problema principal estava aqui. Ao invés de 'fields = __all__',
        # excluímos explicitamente o campo 'processo'. Isso impede o serializer
        # de exigi-lo, pois ele será fornecido manualmente no método '.create()' do pai.
        exclude = ['processo']

class HistoricoProcessoSerializer(serializers.ModelSerializer):
    alterado_por = serializers.StringRelatedField()
    class Meta:
        model = HistoricoProcesso
        fields = ['data', 'alterado_por', 'tipo_alteracao', 'alteracoes', 'observacao_geral']

class ProcessoPaiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Processo
        fields = ['id', 'numero', 'assunto', 'tipo']

# --- Serializers para o Modelo Principal: Processo ---

class ProcessoListSerializer(serializers.ModelSerializer):
    """
    Serializer para LEITURA (GET). Mostra os dados de forma aninhada e legível.
    """
    tipo = serializers.StringRelatedField()
    situacao = serializers.StringRelatedField()
    prioridade = serializers.StringRelatedField()
    categoria = serializers.StringRelatedField()
    orgao_demandante = serializers.StringRelatedField()
    atribuicao = serializers.StringRelatedField()
    area_demandada = serializers.StringRelatedField()
    
    # --- INÍCIO DA ALTERAÇÃO ---
    # DE: pai = serializers.StringRelatedField()
    # PARA: Usar nosso novo serializer de resumo para o processo pai.
    pai = ProcessoSummarySerializer(read_only=True)
    # --- FIM DA ALTERAÇÃO ---

    unidades_auditadas = UnidadeSerializer(many=True, read_only=True)
    auditores_responsaveis = AuditorSerializer(many=True, read_only=True)
    filhos = serializers.SerializerMethodField()
    execucao = ExecucaoSerializer(read_only=True)
    resposta = RespostaSerializer(read_only=True)
    historicos = HistoricoProcessoSerializer(many=True, read_only=True)
    situacoes_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Processo
        fields = '__all__'

    def get_filhos(self, obj):
        # Otimização: Apenas mostra filhos na visualização de detalhe (retrieve)
        # e usa o serializer de resumo para evitar carga excessiva.
        if self.context.get('view') and self.context['view'].action == 'retrieve':
            # --- INÍCIO DA ALTERAÇÃO ---
            # DE: return ProcessoListSerializer(obj.filhos.all(), many=True, context=self.context).data
            # PARA: Usar o serializer de resumo para os filhos. É mais leve e eficiente.
            return ProcessoSummarySerializer(obj.filhos.all(), many=True).data
            # --- FIM DA ALTERAÇÃO ---
        return []

    def get_situacoes_disponiveis(self, obj):
        # ... (sem alteração aqui)
        situacao_atual = obj.situacao.nome.lower()
        if 'finalizado' not in situacao_atual and 'concluído' not in situacao_atual:
            queryset = Situacao.objects.filter(nome__in=['Finalizado', 'Suspenso'])
            return SituacaoSerializer(queryset, many=True).data
        return []


class ProcessoCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para ESCRITA (POST, PATCH). Lida com a criação/atualização de submodelos.
    """
    execucao = ExecucaoSerializer(required=False, allow_null=True)
    resposta = RespostaSerializer(required=False, allow_null=True)

    class Meta:
        model = Processo
        # [CORRIGIDO] Removi o campo 'id' da lista, pois ele não deve ser escrito diretamente.
        fields = [
            'assunto', 'tipo', 'situacao', 'prioridade', 'categoria', 'pai',
            'descricao', 'observacao', 'orgao_demandante', 'numero_processo_externo',
            'ano_solicitacao', 'numero_sei', 'correlacao_lar', 'atribuicao',
            'tipo_demanda', 'area_demandada', 'unidades_auditadas', 'auditores_responsaveis', 'documento_sei',
            'data_documento_sei', 'identificacao_achados', 'execucao', 'resposta'
        ]

    def create(self, validated_data):
        # 1. Separar dados aninhados e ManyToMany.
        execucao_data = validated_data.pop('execucao', None)
        resposta_data = validated_data.pop('resposta', None)
        unidades_data = validated_data.pop('unidades_auditadas', [])
        auditores_data = validated_data.pop('auditores_responsaveis', [])

        # 2. Criar o objeto Processo principal.
        processo = Processo.objects.create(**validated_data)

        # 3. Lidar com relacionamentos ManyToMany.
        processo.unidades_auditadas.set(unidades_data)
        processo.auditores_responsaveis.set(auditores_data)

        # 4. Criar submodelos, ligando-os ao processo recém-criado.
        if execucao_data:
            Execucao.objects.create(processo=processo, **execucao_data)
        if resposta_data:
            Resposta.objects.create(processo=processo, **resposta_data)

        return processo

    def update(self, instance, validated_data):
        # Lógica de atualização para submodelos.
        execucao_data = validated_data.pop('execucao', None)
        resposta_data = validated_data.pop('resposta', None)

        if resposta_data:
            resposta_instance, _ = Resposta.objects.get_or_create(processo=instance)
            for attr, value in resposta_data.items():
                setattr(resposta_instance, attr, value)
            resposta_instance.save()

        if execucao_data:
            execucao_instance, _ = Execucao.objects.get_or_create(processo=instance)
            for attr, value in execucao_data.items():
                setattr(execucao_instance, attr, value)
            execucao_instance.save()
        
        # Chama o método 'update' pai para salvar os campos do Processo.
        return super().update(instance, validated_data)


class ProcessoArvoreSerializer(serializers.ModelSerializer):
    filhos = serializers.SerializerMethodField()
    tipo = serializers.StringRelatedField()

    class Meta:
        model = Processo
        fields = ['id', 'numero', 'assunto', 'tipo', 'pai', 'filhos']

    def get_filhos(self, obj):
        return ProcessoArvoreSerializer(obj.filhos.all(), many=True, context=self.context).data
    


