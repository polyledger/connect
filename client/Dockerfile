FROM node

# Create client directory
RUN mkdir -p /usr/src/client
WORKDIR /usr/src/client

# Install the client dependencies
COPY package.json /usr/src/client/
RUN npm install

# Bundle the source
COPY . /usr/src/client/

EXPOSE 8080
CMD ["npm", "run", "dev"]
