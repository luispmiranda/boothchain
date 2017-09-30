const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const TARGET_IMAGES_PATH = 'uploads';

const request = require('request');
const CONFIG = require('./lib/config');

const multer = require('multer'); // v1.0.5


const upload = multer({dest: CONFIG.TARGET_IMAGES_PATH + '/'}); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

// Serve index html file
app.get('/', function (req, res) {
    res.sendFile('public/index.html', {root: __dirname });
})

// Route to handle image upload
app.post('/api/print', upload.single('img-upld'), function (req, res) {
    const tmpPath = req.file.path;
    const targetPath = CONFIG.TARGET_IMAGES_PATH + '/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    const src = fs.createReadStream(tmpPath);
    const dest = fs.createWriteStream(targetPath);
    
    src.pipe(dest);
    src.on('end', function() { 
        console.info('File copied from ' + tmpPath + ' to ' + targetPath);
        

        /**********************
         * Send data to RabbitMQ
         **********************/
        const image = {
            filepath: targetPath,
            z1: req.body.z1,
            z2: req.body.z2,
            contrast: 10
        };

        var amqp = require('amqplib/callback_api');
        
        amqp.connect('amqp://127.0.0.1', function(err, conn) {
            conn.createChannel(function(err, ch) {
                
              var q = 'queue';

              ch.assertQueue(q, {durable: false});
              ch.sendToQueue(q, new Buffer(JSON.stringify(image)));
              console.log(" [x] Sent 'Hello World!'");
            });
          });
    });
    src.on('error', function(err) {
        console.error('An error occurred processing file streams');
    });

    // Handle this properly, return a json with a status code.
    res.json({
        response: 'Hello World'
    });
});

app.get('/api/tx', function (req, res) {
    
    //const tx = req.query.tx;
    const tx = '0x0d8615aad8c09a29a4d3cfd4eca69466221345d67764514153dde5678fc55fe3'
    const id = 1234;
    const url = 'https://moon.pixels.camp:8549/';
    
    request.post(url, {
        data: {
            method: 'eth_getTransactionByHash',
            params: [tx],
            id: '123'
        }
    }, function (err, resp, body) {
        if (err) {
            console.error(err, err);
        }
        console.log(body)
        var result = require('querystring').parse(body)
        console.log(result);
        res.json(resp);
    })
});

app.listen(3000, function () {
    console.info('Initialising server');
});
