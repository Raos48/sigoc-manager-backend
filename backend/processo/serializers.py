# seu_app/serializers.py

from rest_framework import serializers
from .models import (
    TipoDemanda, TipoReuniao, Processo, Reuniao, Atribuicao, 
    GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria
)
import re
from django.core.exceptions import ValidationError


# ... (Nenhuma alteração nos serializers: TipoDemanda, TipoReuniao, Atribuicao, etc.)
class TipoDemandaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDemanda
        fields = '__all__'


class TipoReuniaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReuniao
        fields = '__all__'


class AtribuicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atribuicao
        fields = '__all__'


class GrupoAuditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoAuditor
        fields = '__all__'


class AuditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditor
        fields = '__all__'


class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade
        fields = '__all__'


class TipoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProcesso
        fields = '__all__'


class SituacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Situacao
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# --- ALTERAÇÃO PRINCIPAL AQUI ---
class ProcessoListSerializer(serializers.ModelSerializer):
    """Serializer para listagem e detalhe de processos"""
    tipo_processo = TipoProcessoSerializer(read_only=True)
    situacao = SituacaoSerializer(read_only=True)
    atribuicao = AtribuicaoSerializer(read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    area_demandada = UnidadeSerializer(read_only=True)
    
    # 👇 ADICIONE ESTAS DUAS LINHAS PARA INCLUIR OS DETALHES COMPLETOS
    unidade_auditada = UnidadeSerializer(many=True, read_only=True)
    auditores_responsaveis = AuditorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Processo
        fields = '__all__'


# --- NENHUMA ALTERAÇÃO NECESSÁRIA ABAIXO ---
class ProcessoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de processos (VERSÃO FINAL CORRIGIDA)"""
    unidade_auditada = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Unidade.objects.all(),
        required=False
    )
    auditores_responsaveis = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Auditor.objects.all(),
        required=False
    )
    atribuicao = serializers.PrimaryKeyRelatedField(
        queryset=Atribuicao.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Processo
        fields = [
            'id', 'unidade_auditada', 'atribuicao', 'tipo', 'identificador', 
            'assunto', 'prioridade', 'numero_sei', 'orgao_demandante', 
            'numero_processo_externo', 'ano_solicitacao', 'data_criacao', 
            'data_atualizacao', 'correlacao_lar', 'observacao', 'prazo', 
            'tipo_processo', 'categoria', 'situacao', 'auditores_responsaveis'
        ]
        read_only_fields = ('identificador', 'data_criacao', 'data_atualizacao')

    def validate(self, data):
        """
        Executa as validações do modelo (.clean()) de forma segura,
        separando os campos ManyToMany antes de instanciar o modelo para validação.
        """
        # 1. Separa os dados de campos ManyToMany dos dados de campos normais.
        m2m_fields = ['unidade_auditada', 'auditores_responsaveis']
        model_data = {k: v for k, v in data.items() if k not in m2m_fields}

        # 2. Cria uma instância temporária do modelo APENAS com os campos normais.
        #    Isso evita o erro de atribuição direta a campos ManyToMany.
        if self.instance:
            # Se for uma atualização, usamos a instância existente como base
            instance_for_validation = self.instance
            for key, value in model_data.items():
                setattr(instance_for_validation, key, value)
        else:
            # Se for uma criação, criamos uma nova instância em memória
            instance_for_validation = Processo(**model_data)

        # 3. Agora podemos chamar .clean() com segurança na instância temporária.
        try:
            # Usamos full_clean() que também chama validate_unique()
            instance_for_validation.full_clean(exclude=m2m_fields)
        except ValidationError as e:
            # Capturamos o erro do modelo e o levantamos como um erro do DRF.
            raise serializers.ValidationError(e.message_dict)

        # 4. Retornamos os dados originais completos para os métodos create/update.
        return data

    def create(self, validated_data):
        unidades = validated_data.pop('unidade_auditada', [])
        auditores = validated_data.pop('auditores_responsaveis', [])
        
        instance = Processo.objects.create(**validated_data)
        
        if unidades:
            instance.unidade_auditada.set(unidades)
        if auditores:
            instance.auditores_responsaveis.set(auditores)
            
        return instance

    def update(self, instance, validated_data):
        unidades = validated_data.pop('unidade_auditada', None)
        auditores = validated_data.pop('auditores_responsaveis', None)
        
        instance = super().update(instance, validated_data)
        
        if unidades is not None:
            instance.unidade_auditada.set(unidades)
        if auditores is not None:
            instance.auditores_responsaveis.set(auditores)
            
        return instance


class ReuniaoSerializer(serializers.ModelSerializer):
    processo = ProcessoListSerializer(read_only=True)
    tipo = TipoReuniaoSerializer(read_only=True)


    class Meta:
        model = Reuniao
        fields = '__all__'


class ProcessoArvoreSerializer(serializers.ModelSerializer):
    tipo_demanda = TipoDemandaSerializer(read_only=True)
    tipo_processo = TipoProcessoSerializer(read_only=True)
    situacao = SituacaoSerializer(read_only=True)
    atribuicao = AtribuicaoSerializer(read_only=True)
    auditores_responsaveis = AuditorSerializer(many=True, read_only=True)
    unidade_auditada = UnidadeSerializer(many=True, read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    area_demandada = UnidadeSerializer(read_only=True)
    pai = serializers.PrimaryKeyRelatedField(queryset=Processo.objects.all(), allow_null=True, required=False)
    subprocessos = serializers.SerializerMethodField()


    class Meta:
        model = Processo
        fields = (
            'id', 'tipo', 'tipo_demanda', 'tipo_processo', 'identificador', 'assunto',
            'situacao', 'prioridade', 'atribuicao', 'numero_sei', 'orgao_demandante',
            'numero_processo_externo', 'ano_solicitacao', 'data_criacao', 'data_atualizacao',
            'auditores_responsaveis', 'unidade_auditada', 'categoria', 'correlacao_lar', 'tag',
            'descricao', 'observacao', 'prazo', 'data_resposta', 'numero_sei_resposta', 'data_envio_resposta',
            'reiterado', 'data_reiteracao', 'identificacao_achados', 'documento_resposta', 'prazo_inicial', 'local_execucao', 'duracao_execucao',
            'forma_execucao', 'resultado_pretendido', 'area_demandada', 'achados', 'pai', 'subprocessos'
        )


    def get_subprocessos(self, obj):
        return ProcessoArvoreSerializer(obj.subprocessos.all(), many=True, context=self.context).data