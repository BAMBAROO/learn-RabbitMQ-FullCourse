const amqp = require("amqplib");

const args = process.argv.slice(2);
const msg = args.slice(1).join(" ") || "Message Hello";
const exchange = "direct_logs";
const severity = args.length > 0 ? args[0] : "info";

const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");

    await channel.assertExchange(exchange, "direct", { durable: false });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [X] Sent: " + msg);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};
main();
