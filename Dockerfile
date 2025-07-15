FROM node:20-alpine
COPY package.json package.json
WORKDIR /src
COPY package-lock.json package-lock.json
RUN npm install
COPY . . 
CMD ["node","app/index.js"]
