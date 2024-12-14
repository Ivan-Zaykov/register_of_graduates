FROM node:20-alpine as dev
WORKDIR /root/
RUN apk add --no-cache python3 make g++
CMD echo "getting latest npm modules" \
    && npm install \
    && echo "installation complete, starting" \
    && npm start
