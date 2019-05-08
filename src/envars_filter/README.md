# Envars Filter
It's common to store secrets in environment variables (e.g. if creating a [Twelve-Factor app](https://12factor.net/config)) and 
have those environment variables be set during a CI pipeline run. To prevent those secrets from leaking into logs, bash 
scripts should be piped into `envars_filter` which will scan for secrets in each line and redact them.
  
This is a js implementation of [Concourse Filter](https://github.com/pivotal-cf-experimental/concourse-filter/tree/039cdfb306c8fd2b99eb1f1eeeca6579804c29ec)
but it supports multiple spaces in environment variables.