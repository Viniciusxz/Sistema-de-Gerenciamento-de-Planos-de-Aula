FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm rebuild sqlite3

COPY . .

RUN npm run build

EXPOSE 3000 5173

CMD ["node", "scripts/dev.js"]