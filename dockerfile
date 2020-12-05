FROM node:10.22.0

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

ADD server /app/server
ADD temp /app/temp

CMD ["node", "server/server.js"]
