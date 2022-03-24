'use strict';

const https = require('https');
const URL = require('url').URL;
const Stream = require('stream').Transform;

function request (url) {
  const data = new Stream();
  return new Promise((resolve, reject) => {
    let cancelTimeout = false;
    const req = https.request(url, res => {
      cancelTimeout = true;
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve({res, data: data.read()}));
    });
    req.setTimeout(60000, () => {
      if (!cancelTimeout) {
        req.destroy();
        const error = new Error('ETIMEDOUT');
        error.code = 'ETIMEDOUT';
        req.emit('error', error);
      }
    });
    req.on('error', error => reject(error));
    req.end();
  });
}

async function main (url) {
  try {
    const {res, data} = await request(url);
    const expectedCodes = [200, 301];
    const unexpectedCodes = !expectedCodes.includes(res.statusCode);
    if (unexpectedCodes) {
      const error = new Error('Unexpected HTTP response code');
      error.code = 'Status code: ' + res.statusCode;
      throw error;
    }
    if (res.statusCode === 301) {
      const location = res.headers.location;
      const newUrl = location.startsWith('/')
        ? new URL(url).origin + location : location;
      return main(newUrl);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = main;