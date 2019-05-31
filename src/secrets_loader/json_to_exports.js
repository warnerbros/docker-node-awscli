#!/usr/bin/env node

const fs = require('fs');

function convertJsonToExports(json, app) {
  const prefixedExports = [];
  Object.keys(json.prefixed).forEach(key => Object.entries(json.prefixed[key])
    .forEach(([subKey, value]) => {
      prefixedExports.push([`${key.toUpperCase()}_${subKey.toUpperCase()}`, value]);
    }));

  const nonPrefixedExports = Object.entries(json.noPrefix[app] || {})
    .map(([key, value]) => [key.toUpperCase(), value]);

  return prefixedExports.concat(nonPrefixedExports)
    .filter(([key]) => !process.env[key]) // don't overwrite secrets that already exist in the environment
    .map(([key, value]) => `export ${key}='${value.replace(/'/g, '\'')}'`).join('\n');
}

function main() {
  const [app] = process.argv.slice(2);
  const data = fs.readFileSync('/dev/stdin', 'utf-8').toString('utf-8');

  const exports = convertJsonToExports(JSON.parse(data), app);
  console.log(exports);
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}

