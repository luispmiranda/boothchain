const amqp = require('amqplib/callback_api');

const printAPI = require('./lib/converter/');

amqp.connect('amqp://127.0.0.1', function(err, conn) {
    console.log(conn);
  conn.createChannel(function(err, ch) {
    var q = 'queue';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());


        // msg.content is of the form "file=file.png contrast=1 brightness=1"
        const keyValues = msg.content.toString().split(' ');
        const file = keyValues[0].split('=')[1];
        const contrast = keyValues[1].split('=')[1];
        const brightness = keyValues[2].split('=')[1];

        printAPI.generateImages(file, contrast, brightness);

    }, {noAck: true});
  });
});