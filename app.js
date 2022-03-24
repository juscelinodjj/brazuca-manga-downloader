'use strict';

const config = require('./src/config')();
const showHelp = require('./src/help');
const lib = require('./src/lib/main');

function tryFail (variable, message) {
  if (!variable) {
    console.log(`\nErro: ${message}`);
    process.exit(1);
  }
}

async function main (dirApp, url, chapters, domains, folders) {
  const folder = lib.chooser(url, domains, folders);
  const downloader = lib.loader(folder);
  tryFail(url, 'URL inválida');
  tryFail(chapters, 'Capítulo inválido');
  tryFail(folder, 'Não foi possível encontrar a lib');
  tryFail(downloader, 'Não foi possível carregar a lib');
  const dirMain = `${dirApp}/${folder}`;
  for (const chapter of chapters) {
    try {
      await downloader(dirMain, url, chapter);
    } catch (error) {
      console.log(error);
    }
  }
  console.log('\nConcluído.\n');
}

function init () {
  const {dirApp, domains, folders} = config;
  const {url, chapters} = config.input;
  const {help} = config.input.options;
  console.log('\nBrazuca Manga Downloader');
  console.log('Distribuído sob a licença GPLv3');
  console.log('https://github.com/juscelinodjj/brazuca-manga-downloader');
  if (help) {
    return showHelp(dirApp, domains);
  }
  main(dirApp, url, chapters, domains, folders);
}

init();