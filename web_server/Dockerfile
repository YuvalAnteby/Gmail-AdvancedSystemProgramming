# Author: Yuval Anteby
FROM node:18

# Copy package files and install dependencies
WORKDIR /usr/src/web_server
COPY package*.json ./
RUN npm install
# Copy the rest of the server
COPY . .
# Expose the port
EXPOSE 3000
# Start the server
CMD ["node", "app.js"]