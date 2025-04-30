FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código-fonte
COPY . .

# Criar diretório para o banco de dados SQLite
RUN mkdir -p /app/db && chmod 777 /app/db

# Expor a porta usada pelo Django
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
