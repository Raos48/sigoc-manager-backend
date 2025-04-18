from rest_framework import serializers
from .models import TipoDemanda, TipoReuniao, Processo, Reuniao, Atribuicao, GrupoAuditor, Auditor, Unidade, TipoProcesso, Situacao, Categoria

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

class ProcessoSerializer(serializers.ModelSerializer):
    tipo_demanda = TipoDemandaSerializer(read_only=True)
    tipo_processo = TipoProcessoSerializer(read_only=True)
    situacao = SituacaoSerializer(read_only=True)
    atribuicao = AtribuicaoSerializer(read_only=True)
    auditores_responsaveis = AuditorSerializer(many=True, read_only=True)
    unidade_auditada = UnidadeSerializer(many=True, read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    area_demandada = UnidadeSerializer(read_only=True)
    pai = serializers.PrimaryKeyRelatedField(queryset=Processo.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Processo
        fields = '__all__'

class ReuniaoSerializer(serializers.ModelSerializer):
    processo = ProcessoSerializer(read_only=True)
    tipo = TipoReuniaoSerializer(read_only=True)

    class Meta:
        model = Reuniao
        fields = '__all__'
