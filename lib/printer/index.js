'use strict';
var moment = require('moment');
var SerialPort = require('serialport').SerialPort;

function initPrinter(callback){
  var serialPort = new SerialPort('/dev/ttyUSB0', {
      baudrate: 19200
  });
  var Printer = require('thermalprinter');

  return serialPort.on('open',function() {
    console.log('Serial port /dev/ttyUSB0 opened');
    var prtOpts = {
          // these params seem to work fine for a 2.1+1.0 source
          // powering the printer + a model B RasPi
      maxPrintingDots :   5,
      heatingTime     : 150,
      heatingInterval : 100,
      commandDelay    : 500
    };
    var printer = new Printer(serialPort, prtOpts);
    return callback(null, printer, serialPort);
  });
}

function printImages(paths, opts, callback){
  return initPrinter(function(err, p, serialPort){
    p.on('ready', function() {
      console.log('Printer ready');
        paths.forEach(function(img){
          console.log('Printing '+img);
          p.printImage(img);
        });
        p.print(function() {
          console.log('Finished printing '+paths.join(', '));
          return serialPort.close(callback);
        });
    });
  });
}

function printLines(lines, opts, callback){
  return initPrinter(function(err, p, serialPort){
    p.on('ready', function() {
      console.log('Printer ready');
      lines.forEach(function(line){
        p.printLine(line);
      });
      p.print(function() {
        console.log('Finished printing '+lines.join(' '));
        return serialPort.close(callback);
      });
    });
  });
}

exports.printer = {
  printImages: printImages,
  printLines: printLines
};
