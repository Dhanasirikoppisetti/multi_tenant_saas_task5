FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY db ./db
RUN cd db && npx prisma generate --schema=schema.prisma

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
