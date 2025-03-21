FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3001
EXPOSE 2991

CMD ["npm", "run", "dev"]
