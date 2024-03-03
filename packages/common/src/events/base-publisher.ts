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
  async createTopic() {
    // !TODO need to update this code to make dynamic topics
    const admin = this.client.admin();
    try {
      await admin.connect();
      const oldTOpics = await admin.listTopics();
      console.log("Old Topics List: ", oldTOpics);
      await admin.createTopics({
        topics: [{ topic: "user-created", numPartitions: 2 }],
      });
      console.log("Topic created successfully");
      const newTOpics = await admin.listTopics();
      console.log("Old Topics List: ", newTOpics);
    } catch (error) {
      console.error("Error creating topic:", error);
    } finally {
      await admin.disconnect();
    }
  }

  async publish(data: T["data"]): Promise<void> {
    await this.createTopic();
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
