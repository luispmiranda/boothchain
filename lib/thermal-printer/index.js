'use strict';

const SerialPort = require('serialport');
const Printer = require('thermalprinter');

const THERMAL_PRINTER_CONFIG = require('../config').THERMAL_PRINTER_CONFIG;

const BAUD_RATE = 19200;

/**
 * Provides a function that interacts with the printer on a given device
 * @param {String} device
 */
function thermalPrinterFactory(device) {
    return function print(paths, options, cb) {
        const serialPort = new SerialPort(device, {
            baudrate: BAUD_RATE
        });
        
        serialPort.on('open', function () {
            console.info('Serial port ' + device + ' opened');

            const portOptions = THERMAL_PRINTER_CONFIG.SERIAL_PORT;

            const printer = new Printer(serialPort, portOptions);

            printer.on('ready', function () {
                console.info('Printer ready');
                
                // Print header
                const p = printer
                    .lineFeed(1)
                    // .printLine( moment().format('YYYY.MM.DD HH:mm'))
                    // .lineFeed(1);

                // Print images
                paths.forEach(function (imagePath) {
                    p = p.printImage(imagePath);
                });

                // Print bottom and finish
                p = p.lineFeed(4)
                    .print(function() {
                        console.info('Finished printing ' + paths.join(', '));
                        return cb();
                    });
            });
        });
    };
}

module.exports = {
    thermalPrinterFactory
};