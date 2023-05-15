const amqp = require("amqplib");

const queue = "task";

// JALANKAN DENGAN 2 TERMINAL/SHELL MAKA PESAN DARI PUBLISHER AKAN TERDISTRIBUSI SECARA ROUND ROBIN
const main = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("connected and channel created");

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1); // UNTUK MEMBATASI MENERIMA 1 PESAN SEBELUM MEMBERIKAN ACKNOWLEDGE KE RABBITMQ
    channel.consume(queue, (msg) => {
      const secs = msg.content.toString().split(".").length - 1;
      console.log("received message: " + msg.content.toString());

      channel.ack(msg) // MENGEMBALIKAN ACKNOWLEDGE

      setTimeout(() => {
        console.log(" [x] DONE")
      }, secs * 1000)
    }, {
      noAck: false // MELAKUKAN ACKNOWLEDGE SECARA MANUAL
    })
  } catch (error) {
    console.error(error)
  }
};

main();