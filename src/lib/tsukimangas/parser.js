'use strict';

function home (buffer) {
  const json = buffer.toString();
  const object = JSON.parse(json);
  const title = object.title;
  const author =  object.author || 'N/A';
  const artist =  object.artist || 'N/A';
  const status =  object.status || 'N/A';
  const synopsis =  object.synopsis || 'N/A';
  const genres = !object.genres
    ? undefined : object.genres.map(element => element.genre);
  const info = {title, author, artist, status, synopsis, genres};
  const error = !Object.keys(info).every(key => info[key]);
  if (error) {
    throw 'Não foi possível obter as informações do manga';
  }
  return info;
}

function chapters (buffer) {
  const json = buffer.toString();
  const object = JSON.parse(json);
  const endpoint = 'https://tsukimangas.com/api/v2/chapter/versions/';
  const error = !object.data.length;
  if (error) {
    throw 'Nenhum capítulo encontrado';
  }
  return object.data.reduce((accumulator, element) => {
    const id = element.versions[0].id;
    const url = endpoint + id;
    const chapter = Number(element.number);
    accumulator.chapters[chapter] = url;
    return accumulator;
  }, {chapters: {}});
}

function images (buffer) {
  const json = buffer.toString();
  const object = JSON.parse(json);
  const error = !object.pages.length;
  if (error) {
    throw 'Nenhuma imagem encontrada';
  }
  return object.pages.reduce((accumulator, element, index) => {
    const {server, url: path} = element;
    const url = `https://cdn${server}.tsukimangas.com${path}`;
    const key = `image ${index + 1}`;
    return {...accumulator, ...{[key]: url}}
  }, {});
}

module.exports = {home, chapters, images};