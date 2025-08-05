# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/Ricaxdo/spacex_launch_dashboard.git .

# Entrar a la carpeta del proyecto
WORKDIR /app/spacex_dashbroard
RUN git checkout develop
# Instalar dependencias
RUN npm install

# Compilar el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app/spacex_dashbroard

COPY --from=builder /app/spacex_dashbroard/.next ./.next
COPY --from=builder /app/spacex_dashbroard/node_modules ./node_modules
COPY --from=builder /app/spacex_dashbroard/package.json ./package.json
COPY --from=builder /app/spacex_dashbroard/next.config.ts ./next.config.ts
COPY --from=builder /app/spacex_dashbroard/public ./public
COPY --from=builder /app/spacex_dashbroard/src ./src


EXPOSE 3000
CMD ["npm", "start"]
