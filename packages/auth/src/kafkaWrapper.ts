import { Kafka } from "kafkajs";
export class KafkaWrapper {
  private _client?: Kafka;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Kafka Client before connecting...");
    }
    return this._client;
  }

  connect(clientId: string) {
    this._client = new Kafka({
      clientId,
      brokers: ["203.190.153.26:9092"],
    });
  }
}

export const kafkaWrapper = new KafkaWrapper();
