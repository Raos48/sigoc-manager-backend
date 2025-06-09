# processo/signals.py

# Importe o 'pre_save' junto com os outros sinais
from django.db.models.signals import pre_save, post_save, m2m_changed 
from django.dispatch import receiver
from .models import Processo, HistoricoProcesso
from .middleware import get_current_user

# --- CORREÇÃO PRINCIPAL: Usar 'pre_save' para capturar os valores antigos ---
@receiver(pre_save, sender=Processo, dispatch_uid="capture_old_processo_on_save")
def capture_old_values(sender, instance, **kwargs):
    """
    Executado ANTES de salvar. Armazena uma cópia dos valores antigos diretamente
    no objeto da instância para uso posterior no post_save.
    """
    if instance.pk:
        try:
            # LOG: Mostra que estamos tentando capturar o estado antigo
            print(f"--- [PRE_SAVE] Capturando estado antigo do Processo {instance.numero} ---")
            
            old_instance = sender.objects.get(pk=instance.pk)
            instance._old_values = {
                field.name: getattr(old_instance, field.name)
                for field in instance._meta.fields
            }
        except sender.DoesNotExist:
            instance._old_values = {}
    else:
        # LOG: Indica que é um processo novo
        print(f"--- [PRE_SAVE] Instância de Processo nova, sem estado antigo para capturar ---")
        instance._old_values = {}


@receiver(post_save, sender=Processo)
def registrar_alteracao_processo(sender, instance, created, **kwargs):
    """
    Executado DEPOIS de salvar. Compara o estado novo com o antigo e cria o histórico.
    """
    # LOG: Início do processamento pós-salvamento
    print(f"\n--- [POST_SAVE] Iniciando para Processo {instance.numero}. Criado: {created} ---")
    
    alteracoes = {}
    tipo_alteracao = 'CRIACAO' if created else 'ATUALIZACAO'

    if created:
        alteracoes['status'] = 'Processo criado.'
        # Simplificando o log de criação para ser mais limpo
        alteracoes['dados_iniciais'] = {
            field.name: str(getattr(instance, field.name))
            for field in instance._meta.fields 
            if field.name not in ['id', 'data_cadastro', 'data_atualizacao'] and getattr(instance, field.name)
        }
    else:
        if hasattr(instance, '_old_values') and instance._old_values:
            # LOG: Mostra os valores antigos e novos que serão comparados
            print(f"[POST_SAVE] Valores antigos encontrados: {instance._old_values}")
            
            for field_name, old_value in instance._old_values.items():
                new_value = getattr(instance, field_name)
                if old_value != new_value:
                    # LOG: Mostra cada alteração detectada
                    print(f"[POST_SAVE] Mudança detectada no campo '{field_name}': '{old_value}' -> '{new_value}'")
                    alteracoes[field_name] = {
                        'anterior': str(old_value) if old_value is not None else 'N/A',
                        'novo': str(new_value) if new_value is not None else 'N/A'
                    }
        else:
             print("[POST_SAVE] ATENÇÃO: Nenhum valor antigo (_old_values) foi encontrado na instância.")

    if alteracoes:
        # LOG: Mostra que um registro de histórico será criado
        print(f"[POST_SAVE] Criando registro de Histórico com as seguintes alterações: {alteracoes}")
        HistoricoProcesso.objects.create(
            processo=instance,
            alterado_por=get_current_user(),
            tipo_alteracao=tipo_alteracao,
            alteracoes=alteracoes
        )
    else:
        print("[POST_SAVE] Nenhuma alteração detectada para registrar no histórico.")


@receiver(m2m_changed, sender=Processo.unidades_auditadas.through)
@receiver(m2m_changed, sender=Processo.auditores_responsaveis.through)
def registrar_alteracao_m2m(sender, instance, action, pk_set, **kwargs):
    """
    Escuta o sinal m2m_changed para os campos ManyToMany de Processo.
    """
    if action not in ['post_add', 'post_remove', 'post_clear']:
        return
    
    # LOG: Mostra a ação M2M
    print(f"\n--- [M2M_CHANGED] Ação '{action}' detectada para o Processo {instance.numero} ---")
    
    field_name = sender._meta.db_table.split('_', 1)[1]
    
    related_model = None
    if 'unidades_auditadas' in field_name:
        field_name = 'unidades_auditadas'
        related_model = instance.unidades_auditadas.model
    elif 'auditores_responsaveis' in field_name:
        field_name = 'auditores_responsaveis'
        related_model = instance.auditores_responsaveis.model
    else:
        return

    alteracoes = {}
    if action == 'post_add':
        items = related_model.objects.filter(pk__in=pk_set)
        alteracoes[field_name] = {'adicionado': [str(item) for item in items]}
    elif action == 'post_remove':
        items = related_model.objects.filter(pk__in=pk_set)
        alteracoes[field_name] = {'removido': [str(item) for item in items]}
    elif action == 'post_clear':
        alteracoes[field_name] = {'status': 'Todos os itens foram removidos.'}

    if alteracoes:
        print(f"[M2M_CHANGED] Criando registro de Histórico com as seguintes alterações: {alteracoes}")
        HistoricoProcesso.objects.create(
            processo=instance,
            alterado_por=get_current_user(),
            tipo_alteracao='ATUALIZACAO',
            alteracoes=alteracoes
        )