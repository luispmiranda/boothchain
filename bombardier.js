const json = {"filepath":"uploads/nodebot.png","contrast":0.5,"brightness":0.5}

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://127.0.0.1', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'queue';
      var message = JSON.stringify(json);
      ch.assertQueue(q, {durable: false});
      ch.sendToQueue(q, new Buffer(message));
      console.log(" [x] Sent " + message);
    });
  });