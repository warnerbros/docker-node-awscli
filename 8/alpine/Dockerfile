FROM node:8-alpine

RUN apk add --no-cache \
        curl \
        git \
        zip \
        jq \
        python-dev \
    &&  curl -O https://bootstrap.pypa.io/get-pip.py \
    &&  python get-pip.py \
    &&  rm get-pip.py \
    &&  pip install  --no-cache-dir awscli

