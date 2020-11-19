FROM ubuntu:18.04

# Default to UTF-8 file.encoding
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    LANGUAGE=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive

# Install base dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        software-properties-common \
        wget \
        curl \
        git \
        unzip \
        zip \
        apt-transport-https \
        jq \
        gpg-agent \
        time \
        ncdu \
        groff \
        python3-distutils \
    && curl -s -O https://bootstrap.pypa.io/get-pip.py \
    && python3 get-pip.py \
    && rm get-pip.py \
    && pip install --no-cache-dir awscli awslogs \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* \
    && find /usr/ -name '*.pyc' -delete

COPY --from=hashicorp/terraform:0.11.14 /bin/terraform /bin/terraform
COPY --from=hashicorp/terraform:0.12.24 /bin/terraform /bin/terraform12

# install node/yarn
COPY docker/12/ubuntu/nodesource.gpg.key /tmp/nodesource.gpg.key
COPY docker/12/ubuntu/yarn-pubkey.gpg /tmp/yarn-pubkey.gpg
RUN apt-key add /tmp/nodesource.gpg.key /tmp/yarn-pubkey.gpg \
    && echo 'deb https://deb.nodesource.com/node_12.x bionic main' > /etc/apt/sources.list.d/nodesource.list \
    && echo 'deb-src https://deb.nodesource.com/node_12.x bionic main' >> /etc/apt/sources.list.d/nodesource.list \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs yarn \
    # we're breaking the package manager here because,
    # nodejs comes with a hard dependency on python 2.7
    # https://github.com/nodejs/node/issues/25789
    && dpkg -r --force-depends libpython2.7-minimal python-minimal python2.7-minimal \
    && rm -rf /usr/lib/python2.7 \
    && rm -rf /var/lib/apt/lists/* \
    && rm /tmp/nodesource.gpg.key \
    && rm /tmp/yarn-pubkey.gpg

RUN yarn global add typescript ts-node snyk && yarn cache clean

# Create dirs and users
RUN mkdir -p /opt/atlassian/bitbucketci/agent/build \
    && sed -i '/[ -z \"PS1\" ] && return/a\\ncase $- in\n*i*) ;;\n*) return;;\nesac' /root/.bashrc \
    && useradd --create-home --shell /bin/bash --uid 1000 pipelines

# deprecated, should be removed at a later stage
RUN wget https://github.com/TylerBrock/saw/releases/download/v0.2.2/saw_0.2.2_linux_amd64.tar.gz \
    && tar -xzvf saw_0.2.2_linux_amd64.tar.gz saw \
    && mv saw /usr/local/bin \
    && rm saw_0.2.2_linux_amd64.tar.gz

ENV NODE_PATH /usr/lib/node_modules

# add scripts to path
COPY src/envars_filter/envars_filter.js /usr/local/bin/envars_filter
COPY src/secrets_loader/secrets_loader /usr/local/bin/secrets_loader
COPY src/secrets_loader/json_to_exports.js /usr/local/bin/json_to_exports
COPY src/update_env_state /usr/local/bin/update_env_state
RUN chmod 555 /usr/local/bin/envars_filter && \
    chmod 555 /usr/local/bin/json_to_exports && \
    chmod 555 /usr/local/bin/secrets_loader && \
    chmod 555 /usr/local/bin/update_env_state

WORKDIR /opt/atlassian/bitbucketci/agent/build
ENTRYPOINT /bin/bash