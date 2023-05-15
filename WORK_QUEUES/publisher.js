const amqp = require("amqplib");

const queue = "task";
const msg = process.argv[2];

// JALANKAN DAN MASUKAN PESAN UNTUK MENGIRIM KE WORKER
const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");

    await channel.assertQueue(queue, {
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log("sent");

    setTimeout(() => {
      process.exit();
    }, 500);
  } catch (error) {
    console.error(error)
    process.exit(0);
  }
};

main();