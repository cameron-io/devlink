FROM node:alpine
WORKDIR /var/lib/webinator
ADD packages.json .
ADD package-lock.json .
RUN apk update && \
    apk upgrade
RUN npm install
ADD . .
RUN source .env
CMD npm run server
