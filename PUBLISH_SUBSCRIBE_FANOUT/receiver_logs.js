const amqp = require("amqplib");

const exchange = "logs";

const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");

    // ASSERT TEMPORARY QUEUE AND GET THE QUEUE NAME
    const q = await channel.assertQueue("", { exclusive: true });
    console.log({ q });
    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C",
      q.queue
    );
    channel.bindQueue(q.queue, exchange, ""); // BIND WITH QUEUE AND EXCHANGE

    // CONSUME THE MESSAGE FROM THE PUBLISHER
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("[X] DONE : " + msg.content.toString());
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};
main();
