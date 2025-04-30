FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o código-fonte
COPY . .

# Construir para produção
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos de build do React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
