FROM node:16

VOLUME ["/src"]

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD node src/app.js