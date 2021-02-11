FROM node:14.1-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html