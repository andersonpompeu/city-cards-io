# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY package*.json ./

# Instalar dependências ignorando conflitos
RUN npm install --legacy-peer-deps

# Copiar o restante do código
COPY . .

# Fazer o build
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copiar build gerado
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove conf padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar conf customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
