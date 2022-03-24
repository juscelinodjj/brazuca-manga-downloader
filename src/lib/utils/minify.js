function main (string) {
  return string.split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('');
}

module.exports = main;