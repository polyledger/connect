FROM node:9.11.1-alpine

# Create web directory
RUN mkdir -p /usr/src/web
WORKDIR /usr/src/web

# Add NPM auth token for private package
ARG NPM_TOKEN
COPY .npmrc /usr/src/web/

# Install the web dependencies
COPY package.json /usr/src/web/
RUN npm install
RUN rm -f /usr/src/web/.npmrc

# Bundle the source
COPY . /usr/src/web/

EXPOSE 8080
CMD ["yarn", "start"]
