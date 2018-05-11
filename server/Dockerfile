# Refer to Docker documentation
# https://docs.docker.com/get-started/

# Use an official Python runtime as parent image
FROM python:3.6

ENV INSTALL_PATH /srv/polyledger
RUN mkdir -p $INSTALL_PATH

# Set working directory to /srv/polyledger
WORKDIR $INSTALL_PATH

# Install supervisor
RUN apt-get update && apt-get install -y supervisor

# Copy requirements and install to enable caching on rebuilds
COPY requirements.txt /srv/polyledger

# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Define environment variables
ENV PYTHONUNBUFFERED 1

# Create a non-root user
RUN useradd polyledger

# Give write access to folders containing Celery PID/scheduler and static files
RUN mkdir /tmp/celery /var/celery /srv/polyledger/static
RUN chown -R polyledger /tmp/celery /var/celery /srv/polyledger/static

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/srv/polyledger/supervisord.conf"]
