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

if (!process.argv[2]) {
    console.error('ERROR: no url arg\n');

    console.info('for example:\n');
    console.log('  docker run --shm-size 1G --rm -v /tmp:/screenshots \\');
    console.log('  alekzonder/puppeteer:latest screenshot \'https://www.google.com\'\n');
    process.exit(1);
}


var url = process.argv[2];

var now = new Date();
var dateStr = now.toISOString().replace(/:/g, '_');
var width = 800;
var height = 600;
var filename = `${dateStr}_screenshot_${width}_${height}.png`;
var delay = 0;
var isMobile = true;
var storage = null;


if (typeof process.argv[3] === 'string') {
    var [width, height] = process.argv[3].split('x').map(v => parseInt(v, 10));
}

if (typeof process.argv[4] === 'string') {
    delay = parseInt(process.argv[4], 10);
}

if (typeof process.argv[5] === 'string') {
    storage = require(process.argv[5]) || null;
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
