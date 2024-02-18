FROM node:18.19.0-alpine
WORKDIR /usr/src/app
COPY . ./

RUN npm install --legacy-peer-deps && \
	npm run build

EXPOSE 10000
CMD "npm" "start"
