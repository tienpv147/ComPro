FROM node:18.19.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env.prod .env

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8085

CMD ["npm", "start"]
