import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", (error0, rabbitmq) => {
  if (error0) {
    throw error0;
  }

  rabbitmq.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue("games_update", {
      durable: false,
    });
    channel.assertQueue("game_update", {
      durable: false,
    });

    const game = {
      title: "龍星的瓦爾尼爾 - Ecdysis of the dragon",
      price: { currency: "HKD", amount: 400 },
      store_id: "70010000039630",
      discount: false,
    };

    channel.sendToQueue(
      "game_update",
      Buffer.from(
        JSON.stringify({ game, lastUpdate: new Date().toISOString() })
      )
    );
  });
});
