FROM node:18.19.0-alpine
WORKDIR /app
COPY . .
RUN yarn install &&   \
    yarn run build
EXPOSE 8080
CMD yarn start
