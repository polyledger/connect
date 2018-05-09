FROM node:9.11.1-alpine

# Create web client directory
RUN mkdir -p /usr/src/web_client
WORKDIR /usr/src/web_client

# Add NPM auth token for private package
ARG NPM_TOKEN
COPY .npmrc /usr/src/web_client/

# Install the web dependencies
COPY package.json /usr/src/web_client/
RUN npm install
RUN rm -f /usr/src/web_client/.npmrc

# Bundle the source
COPY . /usr/src/web_client/

EXPOSE 8080
CMD ["yarn", "start"]
