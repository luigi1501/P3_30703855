# Usar imagen ligera de Node.js Alpine
FROM node:20-alpine AS base

# Instalar pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
