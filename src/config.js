'use strict';

const os = require('os');
const path = require('path');
const sources = require('./sources.json');

function getDirApp () {
  const dirHome = os.userInfo().homedir;
  return path.resolve(dirHome, 'Mangas');
}

function getFolders (sources) {
  return sources.map(element => element.folder);
}

function getDomains (sources) {
  return sources.map(element => element.domain);
}

function validateUrl (url, domains) {
  const patternDomain = /https?:\/\/(www\.)?(.+?)\//;
  const domain = patternDomain.test(url) ? url.match(patternDomain)[2] :  false;
  if (!domain) {
    return false;
  }
  return domains.includes(domain) ? url : false;
}

function isSingle (chapters) {
  return /^[1-9][0-9]{0,3}$/.test(chapters);
}

function isMultiple (chapters) {
  const match =  /^\d{1,4}-\d{1,4}$/.test(chapters);
  if (!match) {
    return false;
  }
  const [min, max] = chapters.split('-').map(element => Number(element));
  return min > 0 && max > min;
}

function validateChapters (chapters) {
  return isSingle(chapters) || isMultiple(chapters);
}

function range (min, max) {
  return Array(max - min + 1).fill()
    .map((element, index) => min + index);
}

function parserChapters (chapters) {
  if (!validateChapters(chapters)) {
    return false;
  }
  const [min, max] = chapters.split('-').map(element => Number(element));
  return (min === 0 || max <= min) ? false : (!max ? [min] : range(min, max));
}

function showHelp (unvalidatedUrl, options) {
  return ['-h', '-help'].includes(unvalidatedUrl)
    || ['-h', '-help'].some(element => options.includes(element));
}

function main () {
  const dirApp = getDirApp();
  const folders = getFolders(sources);
  const domains = getDomains(sources);
  const unvalidatedUrl = process.argv[2];
  const url = validateUrl(unvalidatedUrl, domains);
  const options = process.argv.slice(4);
  const help = showHelp(unvalidatedUrl, options);
  const forceChapter = options.includes('-fc');
  const unparsedChapters = process.argv[3];
  const chapters = !forceChapter
    ? parserChapters(unparsedChapters) : [unparsedChapters];
  const input = {
    url,
    chapters,
    options: {
      help,
      forceChapter
    }
  };
  return {dirApp, folders, domains, input};
}

module.exports = main;