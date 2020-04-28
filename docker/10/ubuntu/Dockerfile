FROM ubuntu:18.04

# Default to UTF-8 file.encoding
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    LANGUAGE=C.UTF-8

# Install base dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        software-properties-common \
        wget \
        curl \
        git \
        unzip \
        apt-transport-https \
        jq \
        python3-pip \
        python3-setuptools \
        gpg-agent \
        time \
    && pip3 install --upgrade pip \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install awscli awslogs

# install node/yarn
COPY docker/10/ubuntu/nodesource.gpg.key /tmp/nodesource.gpg.key
COPY docker/10/ubuntu/yarn-pubkey.gpg /tmp/yarn-pubkey.gpg
RUN apt-key add /tmp/nodesource.gpg.key /tmp/yarn-pubkey.gpg \
    && echo 'deb https://deb.nodesource.com/node_10.x bionic main' > /etc/apt/sources.list.d/nodesource.list \
    && echo 'deb-src https://deb.nodesource.com/node_10.x bionic main' >> /etc/apt/sources.list.d/nodesource.list \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs yarn \
    # we're breaking the package manager here because for some reason,
    # nodejs comes with a hard dependency on python 2.7
    && dpkg -r --force-depends libpython2.7-minimal python-minimal python2.7-minimal \
    && rm -rf /usr/lib/python2.7 \
    && rm -rf /var/lib/apt/lists/* \
    && rm /tmp/nodesource.gpg.key \
    && rm /tmp/yarn-pubkey.gpg

# Create dirs and users
RUN mkdir -p /opt/atlassian/bitbucketci/agent/build \
    && sed -i '/[ -z \"PS1\" ] && return/a\\ncase $- in\n*i*) ;;\n*) return;;\nesac' /root/.bashrc \
    && useradd --create-home --shell /bin/bash --uid 1000 pipelines

# deprecated, should be removed at a later stage
RUN wget https://github.com/TylerBrock/saw/releases/download/v0.2.2/saw_0.2.2_linux_amd64.tar.gz \
    && tar -xzvf saw_0.2.2_linux_amd64.tar.gz saw \
    && mv saw /usr/local/bin \
    && rm saw_0.2.2_linux_amd64.tar.gz

# add envars_filter to path
ENV NODE_PATH /usr/lib/node_modules
COPY src/envars_filter/envars_filter.js /usr/local/bin/envars_filter
RUN chmod 555 /usr/local/bin/envars_filter

# add secrets_loader to path
COPY src/secrets_loader/secrets_loader /usr/local/bin/secrets_loader
COPY src/secrets_loader/json_to_exports.js /usr/local/bin/json_to_exports
COPY src/update_env_state /usr/local/bin/update_env_state
RUN chmod 555 /usr/local/bin/json_to_exports
RUN chmod 555 /usr/local/bin/secrets_loader
RUN chmod 555 /usr/local/bin/update_env_state

WORKDIR /opt/atlassian/bitbucketci/agent/build
ENTRYPOINT /bin/bash