#!/usr/bin/env node

function sleep(ms) {
    ms = (ms) ? ms : 0;
    return new Promise(resolve => {setTimeout(resolve, ms);});
}

process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(reason, p);
    process.exit(1);
});

const puppeteer = require('puppeteer');

// console.log(process.argv);

let setting = null;
if (typeof process.argv[2] === 'string') {
    setting = require(process.argv[2]) || null;
}

// check nessary param
if (setting === null || !setting.hasOwnProperty('url')
    || !setting.hasOwnProperty('width')
    || !setting.hasOwnProperty('height')
) {
    console.error('ERROR: no setting arg or require setting not set: url, width, height\n');

    console.info('for example:\n');
    console.log('  docker run --shm-size 1G --rm -v /tmp:/screenshots \\');
    console.log('  alekzonder/puppeteer:latest screenshot ./site.json\n');
    process.exit(1);
}



var url = setting.url;
var width = setting.width;
var height = setting.height;

var now = new Date();
var dateStr = now.toISOString();
var filename = null;

var delay = setting.hasOwnProperty('delay') ? parseInt(setting.delay, 10) : 0;
var isMobile = setting.hasOwnProperty('isMobile') ? !!setting.isMobile : false;
var storage = setting.hasOwnProperty('localStorage') ? setting.localStorage : null;

// output filename
if (typeof process.argv[3] === 'string') {
    filename = process.argv[3];
} else {
    filename = `${dateStr.replace(/:/g, '_')}.png`;
}

(async() => {

    const browser = await puppeteer.launch({
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--lang=zh-TW,en',
        ]
    });

    const page = await browser.newPage();
    page.setViewport({
        width,
        height,
        isMobile
    });

    await page.goto(url, {waitUntil: 'networkidle2'});


	// set local storage
	if (storage !== null) {
		await page.evaluate((storage) => {
			for (var name in storage) {
                let sessionJSON = JSON.stringify(storage[name]);

                if (sessionJSON === 'NOW()') {
                    sessionJSON = (new Date).getTime();
                }

				localStorage.setItem(name, sessionJSON);
			}
		}, storage);
	}


	await page.reload();

    await sleep(delay);

    await page.screenshot({path: `/screenshots/${filename}`, fullPage: false});

    browser.close();

    console.log(
        JSON.stringify({
            date: dateStr,
            timestamp: Math.floor(now.getTime() / 1000),
            filename,
            width,
            height
        })
    );

})();