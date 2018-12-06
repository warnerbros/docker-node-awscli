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

RUN pip3 install awscli

# install node/yarn
COPY nodesource.gpg.key /tmp/nodesource.gpg.key
COPY yarn-pubkey.gpg /tmp/yarn-pubkey.gpg
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

# install saw
RUN wget https://github.com/TylerBrock/saw/releases/download/v1.2.1/saw_1.2.1_linux_amd64.tar.gz \
    && tar -xzvf saw_1.2.1_linux_amd64.tar.gz saw \
    && mv saw /usr/local/bin \
    && rm saw_1.2.1_linux_amd64.tar.gz

WORKDIR /opt/atlassian/bitbucketci/agent/build
ENTRYPOINT /bin/bash