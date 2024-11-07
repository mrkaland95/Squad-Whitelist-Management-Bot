FROM node:18-alpine

COPY . /app
WORKDIR /app

LABEL AUTHORS="Flaxelaxen"

RUN npm install
RUN npm run build

#WORKDIR /app
#COPY package*.json ./
#RUN #npm install
#COPY . .
#RUN #npm run build
