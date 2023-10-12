FROM node:20.7.0

WORKDIR /app

COPY package*.json /app

RUN npm install 

COPY . .

ENV API_KEY = "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"
ENV MONGO_URI = "mongodb://localhost:27017/FGPT_official_DB"
ENV JWT_SECRET = chinmay

ENV accountSid = "ACd21fdc5b803d2e2494869a05f28a4aac"
ENV authToken = "6f40993aa0bb29efdf5dbac45a3b133a"
ENV phoneNumber = "+917822061479"
ENV verifySid = "VA7687f794ba597450e29f5209b7b83d34"

EXPOSE 5500

CMD ["npm", "start"]

