'use string';

const fs = require('fs');

function main (path) {
  const exists = fs.existsSync(path);
  if (exists) {
    return 'Diretório já existe';
  }
  try {
    fs.mkdirSync(path, {recursive: true});
  } catch (error) {
    throw error;
  }
}

module.exports = main;