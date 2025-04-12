# processos/serializers.py
from rest_framework import serializers
from .models import (
    GrupoAuditor, Auditor, Unidade, TipoProcesso, 
    Situacao, Categoria, Processo, TipoReuniao, Reuniao,Atribuicao
)
from .models import Demanda, TipoDemanda

class GrupoSerializer(serializers.ModelSerializer):
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

class TipoReuniaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReuniao
        fields = '__all__'

class ReuniaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reuniao
        fields = '__all__'

class ProcessoSerializer(serializers.ModelSerializer):
    auditores_responsaveis = AuditorSerializer(many=True, read_only=True)
    reunioes = ReuniaoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Processo
        fields = '__all__'

class TipoDemandaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDemanda
        fields = '__all__'

class DemandaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demanda
        fields = '__all__'
