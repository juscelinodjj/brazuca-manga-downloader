'use strict';

const fs = require('fs');
const path = require('path');
const request = require('./request');

async function download (url, filePath) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    const error = new Error('EEXIST');
    error.code = 'EEXIST';
    throw error;
  }
  try {
    const fileContent = await request(url);
    fs.writeFileSync(filePath, fileContent);
  } catch (error) {
    throw error;
  }
}

async function main (dir, images) {
  const errors = {dir, images: []};
  const total = Object.keys(images).length;
  for (let index = 0; index < total; index++) {
    console.log(`Baixando ${index + 1} | ${total}`);
    const [name, url] = Object.entries(images)[index];
    const id = name.replace(/\D/g, '').padStart(4, '0');
    const ext = path.extname(url);
    const fileName = id + ext;
    const filePath = path.resolve(dir, fileName);
    try {
      await download(url, filePath)
    } catch (error) {
      console.log('Error:', error.code);
      errors.images.push({error: error.code, url, name: fileName});
    }
  }
  return errors;
}

module.exports = main;