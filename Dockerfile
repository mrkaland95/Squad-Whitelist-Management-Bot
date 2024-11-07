# Stage 1: Build
FROM node:18-alpine AS build
LABEL AUTHORS="Flaxelaxen"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
LABEL AUTHORS="Flaxelaxen"
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm install --only=production

CMD ["node", "dist/index.js"]
