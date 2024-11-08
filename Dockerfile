FROM node:18-alpine

COPY . /app
WORKDIR /app

LABEL authors="Flaxelaxen"
LABEL version="1.0"

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build


CMD ["node", "dist/index.js"]