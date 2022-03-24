'use strict';

const downloader = require('../utils/download');
const mkDir = require('../utils/make-dir');
const request = require('../utils/request');
const sanitize = require('../utils/sanitize');
const writeJson = require('../utils/write-json');
const parser = require('./parser');
let mangaInfo; // cache
let saveMangaInfo = true;

async function getMangaInfo (url) {
  const response = await request(url);
  return parser['home'](response);
}

async function getChapterInfo (url) {
  const response = await request(url);
  return parser['chapter'](response);
}

async function getImages (url) {
  const response = await request(url);
  return parser['images'](response);
}

async function main (dirMain, urlHome, chapter) {
  if (!mangaInfo) {
    mangaInfo = await getMangaInfo(urlHome);
  }
  const title = sanitize(mangaInfo.title);
  const dirManga = `${dirMain}/${title}`;
  if (saveMangaInfo) {
    saveMangaInfo = false;
    mkDir(dirManga);
    writeJson(dirManga, title, mangaInfo);
  }
  console.log('\n' + `${mangaInfo.title} - Cap. ${chapter}`);
  const urlChapter = mangaInfo.chapters[chapter];
  if (!urlChapter) {
    throw 'Capítulo inexistente';
  }
  const chapterInfo = await getChapterInfo(urlChapter);
  const images = await getImages(chapterInfo);
  const folder = !Number.isInteger(chapter)
    ? `Capítulo ${chapter}` : `Capítulo ${String(chapter).padStart(4, '0')}`;
  const dirChapter = `${dirManga}/${folder}`;
  mkDir(dirChapter);
  writeJson(dirChapter, 'imagens', images);
  const errors = await downloader(dirChapter, images);
  if (errors.images.length) {
    writeJson(dirChapter, 'erros', errors);
  }
  return true;
}

module.exports = main;