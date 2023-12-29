FROM node:18.19.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp .env.prod .env

EXPOSE 8085

CMD ["npm", "start"]
