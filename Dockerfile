FROM node:20
ARG CACHEBUST=1
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
