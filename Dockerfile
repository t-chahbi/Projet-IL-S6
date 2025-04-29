# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# 1. Installer les dépendances racine
COPY package*.json yarn.lock ./
RUN npm ci

# 2. Installer les dépendances du front
COPY apps/web-app/package*.json apps/web-app/
RUN npm ci --prefix apps/web-app

# 3. Stage "dev" — hot-reload via volume
FROM base AS dev
WORKDIR /app
COPY . .
ENV NODE_ENV=development