FROM node:8-alpine

RUN apk add --no-cache \
        curl \
        git \
        zip \
        jq \
        python \
    &&  apk --update add --virtual build-dependencies python-dev \
    &&  curl -O https://bootstrap.pypa.io/get-pip.py \
    &&  python get-pip.py \
    &&  rm get-pip.py \
    &&  pip install  --no-cache-dir awscli \
    &&  apk del build-dependencies

# add envars_filter to path
ENV NODE_PATH /usr/local/lib/node_modules
COPY src/envars_filter/envars_filter.js /usr/local/bin/envars_filter
RUN chmod 555 /usr/local/bin/envars_filter

# add secrets_loader to path
COPY src/secrets_loader/secrets_loader /usr/local/bin/secrets_loader
COPY src/secrets_loader/json_to_exports.js /usr/local/bin/json_to_exports
RUN chmod 555 /usr/local/bin/json_to_exports
RUN chmod 555 /usr/local/bin/secrets_loader
