FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages

RUN npm ci

COPY . .

EXPOSE 3000
EXPOSE 4000

CMD ["npm", "run", "dev:all"]