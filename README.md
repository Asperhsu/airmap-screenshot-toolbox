# Site screenshot to GIF

此工具使用 Google Chrome headless + puppeteer 定時抓取網站畫面

並於隔日組合當日目錄內所有圖檔為單張GIF

![](https://github.com/aspertw/screenshot-gif/raw/master/2018-01-19.gif)


## 套件來源

- Puppeteer [alekzonder/docker-puppeteer](https://github.com/alekzonder/docker-puppeteer)

- PNG解碼 [pngjs](https://github.com/lukeapage/pngjs)

- 圖片浮水印 [Jimp](https://github.com/oliver-moran/jimp)

- GIF轉換與產生 [eugeneware/gifencoder](https://github.com/eugeneware/gifencoder)


## 系統需求

- docker

- node.js

## shell script - screenshot.sh

定時呼叫 puppeteer 截圖 script.

因需要使用手機模式與定義語言，修改原本的screenSeries.js 改為自定義呼叫