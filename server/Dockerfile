FROM python:3.6

# To enable logging
ENV PYTHONUNBUFFERED 1

# Create server directory
RUN mkdir -p /srv/polyledger
WORKDIR /srv/polyledger

# Install the server dependencies
COPY requirements.txt /srv/polyledger
ADD ./vendor/lattice-0.5.zip /srv/polyledger/vendor/
RUN pip3 install -r requirements.txt

# Bundle the source
COPY . /srv/polyledger

# Expose port 8000 in the container
EXPOSE 8000
