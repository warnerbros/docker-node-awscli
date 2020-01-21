FROM node:12-alpine

RUN apk add --no-cache \
        curl \
        git \
        zip \
        jq \
        groff \
        python3 \
    &&  apk --update add --virtual build-dependencies python3-dev \
    &&  curl -s -O https://bootstrap.pypa.io/get-pip.py \
    &&  python3 get-pip.py \
    &&  rm get-pip.py \
    &&  pip install --no-cache-dir awscli \
    &&  apk del build-dependencies \
    && find /usr/bin/ -name '*.pyc' -delete \
    && find /usr/lib/ -name '*.pyc' -delete

ENV NODE_PATH /usr/local/lib/node_modules
ENV PYTHONWARNINGS ignore::SyntaxWarning

# add scripts to path
COPY src/envars_filter/envars_filter.js /usr/local/bin/envars_filter
COPY src/secrets_loader/secrets_loader /usr/local/bin/secrets_loader
COPY src/secrets_loader/json_to_exports.js /usr/local/bin/json_to_exports
COPY src/update_env_state /usr/local/bin/update_env_state
RUN chmod 555 /usr/local/bin/envars_filter && \
    chmod 555 /usr/local/bin/json_to_exports && \
    chmod 555 /usr/local/bin/secrets_loader && \
    chmod 555 /usr/local/bin/update_env_state
