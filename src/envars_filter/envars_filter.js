#!/usr/bin/env node

const { spawn } = require('child_process');

// taken from: https://github.com/sindresorhus/escape-string-regexp/blob/21c557c7f14a112eebe196abd98d085f5fcfcf5e/index.js#L3
const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

const shortIntegerRegex = /^\d{1,4}$/;
function filterEnvironmentVariables(whitelist, log, name, value) {
  if (name === 'CREDENTIAL_FILTER_WHITELIST') {
    return false;
  }

  if (whitelist.has(name)) {
    log(`Not redacting '${name}' as it appears in CREDENTIAL_FILTER_WHITELIST`);
    return false;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    log(`Not redacting '${name}' as its value is empty`);
    return false;
  }

  if (shortIntegerRegex.test(trimmedValue)) {
    log(`Not redacting '${name}' as it is less than 5 characters and just digits`);
    return false;
  }

  return true;
}

class EnvarsFilter {
  constructor(env = process.env, log = console.error) {
    const whitelist = new Set((env.CREDENTIAL_FILTER_WHITELIST || '').split(',').map(v => v.trim()));
    this.values = Object.entries(env)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(([k, v]) => filterEnvironmentVariables(whitelist, log, k, v))
      .map(([, v]) => v.replace(matchOperatorsRegex, '\\$&')) // escape potential regex
      .map((v) => new RegExp(v), 'g')
      .sort((a, b) => b.source.length - a.source.length);
  }

  filter(data) {
    const dataString = Buffer.isBuffer(data) ? data.toString('utf-8') : data;
    return this.values.reduce((acc, envVarRegex) => acc.replace(envVarRegex, '[redacted]'), dataString);
  }
}

function main() {
  const filter = new EnvarsFilter();

  const [scriptFile, ...args] = process.argv.slice(2);
  const childProcess = spawn(scriptFile, args);

  const outputFilteredText = data => process.stdout.write(filter.filter(data));
  childProcess.stdout.on('data', outputFilteredText);
  childProcess.stderr.on('data', outputFilteredText);
  childProcess.on('exit', (code) => {
    process.exit(code);
  });
  childProcess.on('error', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}

module.exports = { EnvarsFilter };
