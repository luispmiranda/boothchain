const amqp = require('amqplib/callback_api');

var async      = require('async');
var paths      = require('./lib/config').PATHS;
var printer    = require('./lib/printer').printer;
var fs         = require('fs.extra');
var glob       = require('glob');
var moment     = require('moment');

var convert = require('./lib/converter/imagemagick-converter').convert;

amqp.connect('amqp://127.0.0.1', function(err, conn) {
  if(err){
    console.log('Error opening RabbitMQ connection', err);
  }
  conn.createChannel(function(err, ch) {
    if (err) {
      console.err('Error creating RabbitMQ channel');
    }
    var q = 'queue';
    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

    ch.consume(q, function(msg) {
      var data = JSON.parse(msg.content.toString());
      printFull(data.filepath, data.z1, data.z2, data.opts, console.log);
    }, {noAck: true});
  });
});

function printFull(tmpPath, z1, z2, opts, callback){
  //var z1 = ((+contrast-1)/(2*+brightness*+contrast));
  //var z2 = ((+contrast+1)/(2*+brightness*+contrast));

  var z1 = 0.49;
  var z2 = 0.61;

  var imParams = [
      '-resize'    , '384x2000',
      '-level'     , (z1*100)+'%,'+(z2*100)+'%',
      '-colorspace', 'gray'
  ];

  var timestamp = new Date().getTime();

  var originalPath = paths.originals+'/original_'+timestamp;
  var finalPaths   = paths.finals+'/final_'+timestamp;

  async.series([
    // Move file to originals folder
    function(next){
        fs.move(tmpPath, originalPath, next);
    },
    // Convert and keep result in finals folder
    function(next){
        convert(originalPath, finalPaths+'-%d.png', imParams, next);
    },
    // print pixels camp logo
    function(next){
      printer.printImages([paths.system+'/pixels.png'], opts, next);
    },
    // print image
    function(next){
      glob(finalPaths+'*', {}, function(err, files){
        if(err){ return next(err); }
        printer.printImages(files, opts, next);
      });
    },
    // print date
    function(next){
      var date = new Date();
      var today = date.toISOString().substr(0,10);
      var hour  = date.toISOString().substr(11,4);

      printer.printLines([
        '',
        '   Printed on '+moment().format('YYYY.MM.DD HH:mm'),
        //'',
      ], opts, next);
    },
    // print footer
    function(next){
      printer.printImages([paths.system+'/footer.png'], opts, next);
    },
    // print url
    function(next){
      printer.printLines([
        '',
        '     pixels.camp/projects/16',
        '',
        '',
        '',
        ''
      ], opts, next);
    },
  ], callback);
}
