var gs = require('glob-stream');
var fs = require('fs');
var path = require('path');
var Jimp = require("jimp");
var png = require('png-js');
var GIFEncoder = require('gifencoder');
var through = require('through2');
var moment = require('moment-timezone');

// process.argv[2]: config filename
// process.argv[3]: source folder
// process.argv[4]: output file path

if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    console.error('ERROR: args error\n');

    console.info('for example:\n');
    console.log('  node dialyGif.js ../conf/dialyGif.json \\');
    console.log('   \'source folder path\' \\');
    console.log('   \'output file path\' \n');
    process.exit(1);
}

var setting = require(process.argv[2]);
var pngWidth = setting.width;
var pngHeight = setting.height;
var sourceDir = process.argv[3];
var outputFilePath = process.argv[4];


// check source dir
if (!fs.existsSync(sourceDir)) {
    logger(sourceDir + ' folder not exists.');
    process.exit(1);
}

logger('processing: ' + sourceDir + ' to: ' + outputFilePath);

var encoder = new GIFEncoder(pngWidth, pngHeight);
gs(sourceDir + '/*.png')
    .pipe(through({ objectMode: true }, read))
    // .pipe(through({ objectMode: true }, appendWatermark))
    .pipe(through({ objectMode: true }, decodePng))
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 500, quality: 10 }))
    .pipe(fs.createWriteStream(outputFilePath));



/* functions */

function decodePng(chunk, enc, next) {
    var self = this;
    (new png(chunk)).decodePixels(function(pixels) {
        self.push(pixels);
        next();
    });
}

function read(chunk, enc, next) {
    var self = this;
    Jimp.read(chunk.path).then(function(image) {
        image.getBuffer(Jimp.AUTO, function (err, data) {
            self.push(data);
            next();
        });
    });
}

function appendWatermark(chunk, enc, next) {
    var self = this;
    var fullPath = chunk.path;
    var filename = fullPath.replace(/^.*[\\\/]/, '').replace('_screenshot_'+sourceWidth+'_'+sourceHeight+'.png', '');
    var date = moment(filename, "YYYY-MM-DDTHH:mm:ss.SSSZ").tz("Asia/Taipei").format();

    Promise.all([
        Jimp.read(chunk.path),
        Jimp.loadFont(Jimp.FONT_SANS_16_WHITE),
    ]).then(function (values) {
        var image = values[0];
        var fontWhite = values[1];

        var image2 = image.clone();
        image.blit( image2, 175, 0, 0, 575, 440-175, 50);

        image.print(fontWhite, 230, 13, date);

        image.getBuffer(Jimp.AUTO, function (err, data) {
            self.push(data);
            next();
        });
    });
  }

  function logger() {
    var now = '[' + moment().format() + ']';
    var args = [now].concat([].slice.call(arguments));
    console.log.apply(null, args);
  }