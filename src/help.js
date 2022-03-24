'use strict';

function main (dirMain, domains) {
  console.log('\nUso');
  console.log('  node app.js [url] [capítulo]');
  console.log('  node app.js [url] [capítulo inicial]-[capítulo final]');
  console.log('  node app.js [url] [capítulo especial] -fc');
  console.log('\nOpções');
  console.log('  -fc,       Forçar capítulo');
  console.log('  -h, -help  Mostrar ajuda');
  console.log('\nDiretório');
  console.log(`  ${dirMain}`);
  console.log('\nFontes');
  const ordenedDomains = domains.sort((a, b) => a.localeCompare(b));
  for (const domain of ordenedDomains) {
    console.log(`  https://${domain}`);
  }
  console.log('');
}

module.exports = main;