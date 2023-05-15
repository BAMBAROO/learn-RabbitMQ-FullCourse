const amqp = require("amqplib");

const args = process.argv.slice(2); // (SEVERITY) or which type of message what we gonna get like error, info or warning
const exchange = "direct_logs";

// if we don't put any type of message will get an error
if (args == 0) {
  console.log(`node receive_logs_direct.js ["error", "warning", "info"]`);
  process.exit();
}

const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");

    // assert exchange (memastikan exchange)
    await channel.assertExchange(exchange, "direct", { durable: false });
    // create temporary queue 
    const q = await channel.assertQueue("", {
      exclusive: true,
    });

    // binding dengan severity (type message) agar mendapatkan pesan dari routing key yang berbeda
    args.forEach(async (severity) => {
      await channel.bindQueue(q.queue, exchange, severity);
    });
    console.log("Waiting for Message, Click Ctrl+C to Quit.")

    // consuming every message
    channel.consume(
      q.queue,
      (msg) => {
        console.log(
          `[X] DONE ${msg.fields.routingKey} ${msg.content.toString()}`
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
main();
