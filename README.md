# Brazuca Manga Downloader
Utilitário cli escrito em JS para baixar mangá de diversas fontes.

## OS
* [Linux](https://pt.wikipedia.org/wiki/Linux)

## Requisitos
* [Node.js 16 LTS](https://nodejs.org/pt-br/)

## Uso
```bash
node app.js [url] [capítulo]
```
```bash
node app.js [url] [capítulo inicial]-[capítulo final]
```
```bash
node app.js [url] [capítulo especial] -fc
```
##### Exemplo real de uso
> Obtendo o capítulo 1
```bash
node app.js https://yesmangas2.com/manga/saint-seiya-episode-g-ym97751 1
```
> Obtendo os capítulos 2 e 3
```bash
node app.js https://yesmangas2.com/manga/saint-seiya-episode-g-ym97751 2-3
```
> Obtendo o capítulo (especial) fora da regra numérica
```bash
node app.js https://yesmangas2.com/manga/saint-seiya-episode-g-ym97751 'especial-01' -fc
```

## Opções
```
-fc        Forçar capítulo
-h, -help  Mostrar ajuda
```

## Diretório
```bash
/home/$USER/Mangas
```

## Fontes
- https://mangayabu.top
- https://tsukimangas.com
- https://yesmangas2.com

## Licença
Distribuído sob a licença GPLv3. Consulte [LICENSE](https://github.com/juscelinodjj/brazuca-manga-downloader/blob/main/LICENSE) para obter mais informações.