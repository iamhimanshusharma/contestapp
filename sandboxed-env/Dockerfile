FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
    g++ python3 openjdk-11-jdk time \
    && apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
CMD ["/bin/bash"]
