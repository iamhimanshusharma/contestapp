FROM node

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-24.0.5.tgz -o docker.tgz && \
    tar xzvf docker.tgz --strip 1 -C /usr/local/bin docker/docker && \
    rm docker.tgz

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY . .


CMD ["npm", "run", "dev"]
