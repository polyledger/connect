FROM nginx

# Add the Nginx configuration file and TLS certificate
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/dhparam.pem /etc/ssl/certs
COPY ./nginx/*.polyledger.com.crt /etc/ssl/certs
COPY ./nginx/*.polyledger.com.key /etc/ssl/private

# Copy over static assets from the web client
COPY ./web_client/build /usr/share/nginx/html
