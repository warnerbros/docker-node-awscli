FROM node:8-alpine

RUN apk add --no-cache \
        curl \
        python-dev \
    &&  curl -O https://bootstrap.pypa.io/get-pip.py \
    &&  python get-pip.py \
    &&  pip install awscli
