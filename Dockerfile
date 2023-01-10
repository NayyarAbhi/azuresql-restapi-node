FROM node:12.18.2
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install
COPY . .
EXPOSE 8001
CMD ["node", "/usr/src/app/src/main/index.js"]