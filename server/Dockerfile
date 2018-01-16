FROM python:3.6

ENV PYTHONUNBUFFERED 1

# Create server directory
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

# Install the server dependencies
COPY requirements.txt /usr/src/server/
ADD ./vendor/lattice-0.5.zip /usr/src/server/vendor/
RUN pip3 install -r requirements.txt

# Bundle the source
COPY . /usr/src/server/

EXPOSE 8000
COPY ./docker-entrypoint.sh /usr/src/server/
