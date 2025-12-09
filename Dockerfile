FROM node:18-alpine

WORKDIR /usr/src/gagbot

RUN git clone https://github.com/Enraa/Gagbot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]