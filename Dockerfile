FROM node:22-alpine AS build

WORKDIR /app
ARG VITE_SERVER_API
ENV VITE_SERVER_API=$VITE_SERVER_API

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
