# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência primeiro (melhor cache)
COPY package*.json ./

# Usa npm ci se tiver package-lock.json, senão npm install
RUN npm ci

# Copia o resto do projeto
COPY . .

# Build de produção
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html
# Se usar Vite, troque /app/build por /app/dist

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]