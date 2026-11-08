# ==============================================================================
# DOCKERFILE MULTI-STAGE PARA DESPLIEGUE EN LA NUBE (RENDER, RAILWAY, FLY.IO)
# Autores: Juan David Arboleda Vallecilla & Diego Diaz
# ==============================================================================

# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json tsconfig.json ./

# Instalar todas las dependencias
RUN npm ci

# Copiar el código fuente y compilar TypeScript
COPY src/ ./src/
RUN npm run build

# Etapa 2: Producción
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar dependencias de producción únicamente
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar build compilado y archivos estáticos
COPY --from=builder /app/dist ./dist
COPY public/ ./public/
COPY postman/ ./postman/
COPY database/ ./database/

# Crear carpeta de datos para SQLite si se usa
RUN mkdir -p data

EXPOSE 3000

CMD ["node", "dist/server.js"]
