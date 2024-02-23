FROM ubuntu:22.04
RUN echo 'APT::Install-Suggests "0";' >> /etc/apt/apt.conf.d/00-docker
RUN echo 'APT::Install-Recommends "0";' >> /etc/apt/apt.conf.d/00-docker
RUN DEBIAN_FRONTEND=noninteractive \
  apt-get update \
  && apt-get install -y python3 \
  && rm -rf /var/lib/apt/lists/*
RUN useradd -ms /bin/bash pysandbox
USER pysandbox
RUN mkdir /home/pysandbox/TestEnvironment
COPY ./makeReport.sh /home/pysandbox/TestEnvironment
USER root
RUN chmod +x /home/pysandbox/TestEnvironment/makeReport.sh
USER pysandbox