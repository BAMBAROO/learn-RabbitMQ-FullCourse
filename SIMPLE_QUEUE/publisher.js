const amqp = require("amqplib");

let queue = "hello";
let msg = "hello world";

const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");
    
    await channel.assertQueue(queue, {
      durable: false
    });
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log("sent");

    setTimeout(() => {
      connection.close();
      process.exit(0)
    },500);
  } catch (error) {
    console.log(error);
  }
};

main();
