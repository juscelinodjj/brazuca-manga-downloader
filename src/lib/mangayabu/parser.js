'use strict';

function getChapters (array) {
  const urlWithoutId = 'https://mangayabu.top/?p=';
  return array.reduce((accumulator, element) => {
    const chapter = Number(element.num);
    const url = urlWithoutId + element.id;
    return {...accumulator, ...{[chapter]: url}};
  }, {});
}

function home (buffer) {
  const html = buffer.toString();
  const patternJson = /<script defer id="manga-info"\s.*?>(.+?)<\/script>/;
  const json = patternJson.test(html) ? html.match(patternJson)[1] : null;
  if (!json) {
    throw 'Não foi possível obter as informações do manga';
  }
  const object = JSON.parse(json);
  const [author, artist, status] = ['N/A', 'N/A', 'N/A'];
  const {chapter_name: title, description: synopsis, genres} = object;
  const chapters = getChapters(object.allposts);
  return {title, author, artist, status, synopsis, genres, chapters};
}

function chapter (buffer) {
  const html = buffer.toString();
  const patternHash = /var\shash\s=\s(.+?);/;
  const patternHatsuna = /var\shatsuna\s=\s(.+?);/
  const hash = patternHash.test(html) ? html.match(patternHash)[1] : null;
  const hatsuna = patternHatsuna.test(html)
    ? html.match(patternHatsuna)[1] : null;
  const error = !hash && !hatsuna;
  if (error) {
    throw 'Não foi possível obter as informações do capítulo';
  }
  return `https://mangayabu.top/chapter.php?id=${hash}&hatsuna=${hatsuna}`;
}

function images (buffer) {
  const json = buffer.toString();
  const object = JSON.parse(json);
  const error = !object.Miko.length;
  if (error) {
    throw 'Nenhuma imagem encontrada';
  }
  return object.Miko.reduce((accumulator, element, index) => {
    return {...accumulator, ...{[index + 1]: element}}
  }, {});
}


module.exports = {home, chapter, images};