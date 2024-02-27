import { Topics } from "./topics";
import { Kafka, Producer } from "kafkajs";
interface Event {
  topic: Topics;
  data: {
    key: string;
    value: any;
  };
}

function isValidTopic(topic: string): topic is Topics {
  return Object.values(Topics).includes(topic as Topics); // Type assertion safe here
}

export abstract class Publisher<T extends Event> {
  abstract topic: T["topic"];
  protected client: Kafka;
  protected producer: Producer;

  constructor(client: Kafka) {
    this.client = client;
    this.createProducer(client);
  }

  async createProducer(client: Kafka) {
    if (!this.producer) {
      const producer = client.producer();
      await producer.connect();
      this.producer = producer;
      console.log("Producer Connected Successfully");
    }
  }

  async publish(data: T["data"]): Promise<void> {
    await this.ensureTopicExists();
    return new Promise(async (resolve, reject) => {
      try {
        const producer = this.producer;
        await producer.send({
          topic: this.topic,
          messages: [{ key: data.key, value: JSON.stringify(data.value) }],
        });
        console.log(
          `Published Successfully at topic: ${this.topic} with key: ${data.key}`
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  protected async ensureTopicExists(): Promise<void> {
    if (!isValidTopic(this.topic)) {
      throw new Error(`Invalid topic: ${this.topic}`);
    }

    const admin = this.client.admin();
    await admin.connect();

    if (!(await admin.listTopics()).includes(this.topic)) {
      await admin.createTopics({ topics: [{ topic: this.topic }] });
      console.log(`Created topic: ${this.topic}`);
    }

    await admin.disconnect();
  }
}
