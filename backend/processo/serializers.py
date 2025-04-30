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


class ProcessoListSerializer(serializers.ModelSerializer):
    """Serializer para listagem e detalhe de processos"""
    tipo_processo = TipoProcessoSerializer(read_only=True)
    situacao = SituacaoSerializer(read_only=True)
    atribuicao = AtribuicaoSerializer(read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    area_demandada = UnidadeSerializer(read_only=True)
    
    class Meta:
        model = Processo
        fields = '__all__'


class ProcessoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de processos"""
    class Meta:
        model = Processo
        fields = '__all__'
        
    def validate(self, data):
        # Verificação específica para o POST do TCU
        if data.get('orgao_demandante') == 'TCU' and data.get('numero_processo_externo'):
            # Se for TCU e o processo não estiver no formato correto,
            # vamos formatar automaticamente
            numero = data['numero_processo_externo']
            # Remover qualquer caractere não numérico
            numero_limpo = ''.join(c for c in numero if c.isdigit())
            
            # Verificar se tem dígitos suficientes
            if len(numero_limpo) >= 9:  # XXX.XXX/XXXX-X (pelo menos 9 dígitos)
                # Formatar no padrão TCU
                formatted = f"{numero_limpo[:3]}.{numero_limpo[3:6]}/{numero_limpo[6:10]}-{numero_limpo[10:11] if len(numero_limpo) > 10 else '0'}"
                data['numero_processo_externo'] = formatted
        
        return data


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
