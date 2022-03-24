'use strict';

const fs = require('fs');
const path = require('path');

function chooser (url, domains, folders) {
  const patternDomain = /https?:\/\/(www\.)?(.+?)\//;
  for (let index = 0; index < domains.length; index++) {
    const domain = patternDomain.test(url)
      ? url.match(patternDomain)[2] : false;
    const match = domain === domains[index];
    if (match) {
      return folders[index];
    }
  }
  return false;
}

function loader (lib) {
  const main = path.resolve(__dirname, `${lib}/main.js`);
  const exists = fs.existsSync(main);
  return exists ? require(main) : false;
}

module.exports = {chooser, loader};