'use strict';

function main (string) {
  return string.replace(/[\/|\\:*?"<>]/g, ' ');
}

module.exports = main;