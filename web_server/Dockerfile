# Author: Yuval Anteby
FROM node:18

# Copy package files and install dependencies
WORKDIR /usr/src/web_server
COPY package*.json ./
RUN npm install
# Copy the rest of the server
COPY . .
# Start the server
CMD ["node", "app.js"]