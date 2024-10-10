import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
  clientId: "ai-camera-client",
  brokers: ["localhost:9092", "kafka:9092"],
});

// create a kafka producer
const kafkaProducer = kafkaClient.producer();

const produceMessage = async (topic, messages) => {
  try {
    await kafkaProducer.connect();
    await kafkaProducer.send({
      topic: topic,
      messages: messages.map((msg) => ({ value: msg })),
    });
    console.log(`Message sent to topic: ${topic}`);
  } catch (error) {
    console.error(`Error sending message to topic: ${topic}`);
    console.error(error);
  } finally {
    await kafkaProducer.disconnect();
  }
};

//create kafka consumer
const kafkaConsumer = kafkaClient.consumer({ groupId: "ai-camera-group" });

const consumeMessages = async (topic) => {
  try {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: topic });
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
          partition,
          topic,
          offset: message.offset,
        });
        onmessage(message.value.toString());
      },
    });
  } catch (error) {
    console.error(`Error consuming message from topic: ${topic}`);
    console.error(error);
  }
};

export { kafkaClient, produceMessage, consumeMessages };
