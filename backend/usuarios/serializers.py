# usuarios/serializers.py
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nome_completo', 'cargo', 'telefone', 'unidade', 
                 'is_active', 'is_staff', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['email', 'nome_completo', 'cargo', 'telefone', 'unidade', 
                 'password', 'password_confirm', 'is_active', 'is_staff']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(password=password, **validated_data)
        return user