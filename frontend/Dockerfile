FROM node:20

RUN npm install -g expo-cli

WORKDIR /app

COPY . . 

EXPOSE 19000 19001 19002


CMD ["npx", "expo", "start", "--tunnel"]