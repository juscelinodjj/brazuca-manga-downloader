'use strict';

const fs = require('fs');
const path = require('path');

function main (dir, name, content) {
  const fileName = name + '.json';
  const filePath = path.resolve(dir, fileName);
  const fileContent = JSON.stringify(content, null, 2);
  fs.writeFileSync(filePath, fileContent);
}

module.exports = main;