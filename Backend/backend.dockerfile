
FROM node:20

WORKDIR /app

RUN npm config set registry http://registry.npmjs.org/


RUN apt-get update && apt-get install -y openssl


RUN npm cache clean --force


RUN npm install -g npm@10.9.1


COPY package*.json ./
RUN npm install


COPY prisma ./prisma


RUN npx prisma generate


COPY . .


EXPOSE 4000

CMD ["npm", "run", "dev"]