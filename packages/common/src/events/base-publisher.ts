import { Topics } from "./topics";
import { Kafka, Producer } from "kafkajs";
import { ulid } from "ulid";
interface Event {
  topic: Topics;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract topic: Topics;
  protected client: Kafka;
  protected producer: Producer;

  constructor(client: Kafka) {
    this.client = client;
  }

  async createProducer(client: Kafka) {
    if (!this.producer) {
      const producer = client.producer();
      console.log("Connecting Producer...");
      await producer.connect();
      this.producer = producer;
      console.log("Producer Connected Successfully");
    }
  }

  async publish(data: T["data"]): Promise<void> {
    await this.createProducer(this.client);
    return new Promise(async (resolve, reject) => {
      try {
        const producer = this.producer;
        console.log("Publishing event...", {
          topic: this.topic,
          messages: [{ key: ulid(), value: JSON.stringify(data) }],
        });
        await producer.send({
          topic: this.topic,
          messages: [{ key: ulid(), value: JSON.stringify(data) }],
        });
        console.log(
          `Published Successfully at topic: ${this.topic} with key: ${data.key}`
        );
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
