const amqp = require("amqplib");

let queue = "hello";

const main = async() => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.assertQueue(queue, {
      durable: false
    });
    channel.consume(queue, (msg) => {
      console.log(`got message: ${msg.content.toString()}`)
    }, {
      noAck: true
    });
    
    setTimeout(() => {
      connection.close();
      console.log("closed");
      process.exit(0);
    },1000)
  } catch (error) {
    console.log(error)
  }
};

main();