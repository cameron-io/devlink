FROM node:alpine
WORKDIR /var/lib/linkdev
RUN apk update && \
    apk upgrade
ADD packages.json .
ADD package-lock.json .
RUN npm install
ADD . .
RUN source .env
CMD npm run server
