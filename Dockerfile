# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# 1. Installer les dépendances racine
COPY package*.json ./
RUN npm i

# 2. Installer les dépendances du front
COPY apps/Web-app/package*.json apps/Web-app/
RUN npm i --prefix apps/Web-app

# 3. Stage "dev" — hot-reload via volume
FROM base AS dev
WORKDIR /app
COPY . .
ENV NODE_ENV=development