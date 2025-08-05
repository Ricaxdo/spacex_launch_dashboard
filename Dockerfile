# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/Ricaxdo/spacex_launch_dashboard.git .

# Entrar a la carpeta del proyecto
WORKDIR /app/spacex_dashbroard
RUN git checkout main

# --- AQUI: Recibe el ARG en build
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Instalar dependencias
RUN npm install

# --- AQUI: ENV también para que esté en build
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Compilar el proyecto (ya tendrá la variable)
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app/spacex_dashbroard

# --- AQUI: ENV para runtime también (no está de más)
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

COPY --from=builder /app/spacex_dashbroard/.next ./.next
COPY --from=builder /app/spacex_dashbroard/node_modules ./node_modules
COPY --from=builder /app/spacex_dashbroard/package.json ./package.json
COPY --from=builder /app/spacex_dashbroard/next.config.ts ./next.config.ts
COPY --from=builder /app/spacex_dashbroard/public ./public
COPY --from=builder /app/spacex_dashbroard/src ./src

EXPOSE 3000
CMD ["npm", "start"]
# --- AQUI: No es necesario el comando de build aquí, ya que se hace en la etapa de builder
