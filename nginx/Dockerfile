FROM nginx

# Add the Nginx configuration file
ADD ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy over static assets from the web app
COPY ./client/build /usr/share/nginx/html
