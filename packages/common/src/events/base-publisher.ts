import { Topics } from "./topics";
import { type Kafka, type Producer } from "kafkajs";
import logger from "../utils/logger";
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
      logger.info("Connecting Producer...");
      await producer.connect();
      this.producer = producer;
      logger.info("Producer Connected Successfully");
    }
  }

  async createTopic() {
    const admin = this.client.admin();
    try {
      await admin.connect();
      const allTopics = Object.values(Topics);
      for (let i = 0; i < allTopics.length; i++) {
        await admin.createTopics({
          topics: [{ topic: allTopics[i], numPartitions: 2 }],
        });
        logger.info("Created Topic successfully");
      }
    } catch (error) {
      logger.error("Error creating topic:", error);
    } finally {
      await admin.disconnect();
    }
  }

  async publish(data: T["data"]): Promise<void> {
    try {
      await this.createTopic();
      await this.createProducer(this.client);
      const producer = this.producer;
      const key = ulid();
      await producer.send({
        topic: this.topic,
        messages: [{ key, value: JSON.stringify(data) }],
      });
      logger.info(
        `Published Successfully at topic: ${this.topic} with key: ${key}`,
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
