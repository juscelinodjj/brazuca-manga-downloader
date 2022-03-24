'use strict';

const minify = require('../utils/minify');
const replaceHtmlEntities = require('../utils/replace-html-entities');

function getHtml (buffer) {
  const html = buffer.toString();
  const fns = [minify, replaceHtmlEntities];
  return fns.reduce((accumulator, element) => element(accumulator), html);
}

function getTitle (html) {
  const pattern = /<h1\sclass="title">(.+?)<\/h1>/;
  return pattern.test(html) ? html.match(pattern)[1] : null;
}

function getAuthor (html) {
  const pattern = /Autor:\s<\/strong>(.+?)<\/li>/;
  return pattern.test(html) ? html.match(pattern)[1] : null;
}

function getArtist (html) {
  const pattern = /Art\):\s<\/strong>(.+?)<\/li>/;
  return pattern.test(html) ? html.match(pattern)[1] : null;
}

function getStatus (html) {
  const pattern = /Status:\s<\/strong>(.+?)<\/li>/;
  return pattern.test(html) ? html.match(pattern)[1] : null;
}

function getSynopsis (html) {
  const pattern = /<article>((?:\r|\n|.)+)<\/article>/;
  return pattern.test(html) ? html.match(pattern)[1] : null;
}

function getGenres (html) {
  const patternGenres = /Categorias:\s<\/strong>(.+?)<\/li>/;
  const patternGenre = />(.+?)<\/a>/;
  const match = patternGenres.test(html);
  if (!match) {
    return null;
  }
  const genres = html.match(patternGenres)[1].split('<a');
  const parsedGenres = genres.reduce((accumulator, element) => {
    const genre = patternGenre.test(element)
      ? element.match(patternGenre)[1] : null;
    return genre ? [...accumulator, genre] : accumulator;
  }, []);
  return Object.keys(parsedGenres).length ? parsedGenres : null;
}

function getChapters (html) {
  const patternDiv = /leitura<\/h2><div>(.+?)<\/div>/;
  const patternUrl = /href="(.+?)"/;
  const patternChapter = /">(.+?)<\/a>/;
  const match = patternDiv.test(html);
  if (!match) {
    return null;
  }
  const div = html.match(patternDiv)[1];
  const anchors = div.split('<a');
  const chapters = anchors.reduce((accumulator, element) => {
    const chapter = patternChapter.test(element)
      ? element.match(patternChapter)[1] : null;
    const url = patternUrl.test(element) ? element.match(patternUrl)[1] : null;
    return chapter && url ? {...accumulator, ...{[chapter]: url}} : accumulator;
  }, {});
  return Object.keys(chapters).length ? chapters : null;
}

function home (buffer) {
  const html = getHtml(buffer);
  const title = getTitle(html);
  const author = getAuthor(html);
  const artist = getArtist(html);
  const status = getStatus(html);
  const synopsis = getSynopsis(html);
  const genres = getGenres(html);
  const chapters = getChapters(html);
  const info = {title, author, artist, status, synopsis, genres, chapters};
  const error = !Object.keys(info).every(key => info[key]);
  if (error) {
    throw 'Não foi possível obter as informações do manga';
  }
  return info;
}

function images (buffer) {
  const html = getHtml(buffer);
  const patternAnchors = /<a\shref='javascript:fnext\(\);'(.+?)<\/a>/g;
  const patternUrl = /src=['|"](.+?)['|"]/;
  const match = patternAnchors.test(html);
  if (!match) {
    throw 'Nenhuma imagem encontrada';
  }
  const anchors = html.match(patternAnchors);
  const images = anchors.reduce((accumulator, element, index) => {
    const key = `image ${index + 1}`;
    const url = patternUrl.test(element) ? element.match(patternUrl)[1] : null;
    return url ? {...accumulator, ...{[key]: url}} : accumulator;
  }, {});
  const error = !Object.keys(images).length;
  if (error) {
    throw 'Nenhuma imagem encontrada';
  }
  return images;
}

module.exports = {home, images};