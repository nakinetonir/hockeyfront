FROM node:20-bookworm-slim AS build
WORKDIR /app

ENV NODE_ENV=development \
    npm_config_update_notifier=false \
    npm_config_fund=false \
    npm_config_audit=false

COPY package*.json ./
RUN npm install

COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/hockeylinea-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
