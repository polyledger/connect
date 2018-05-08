FROM node:9.11.1-alpine

# Create client directory
RUN mkdir -p /usr/src/client
WORKDIR /usr/src/client

# Add NPM auth token for private package
ARG NPM_TOKEN
COPY .npmrc /usr/src/client/

# Install the client dependencies
COPY package.json /usr/src/client/
RUN npm install
RUN rm -f /usr/src/client/.npmrc

# Bundle the source
COPY . /usr/src/client/

EXPOSE 8080
CMD ["yarn", "start"]
