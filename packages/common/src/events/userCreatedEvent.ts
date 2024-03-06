import { type Topics } from "./topics";

export interface UserCreatedEvent {
  topic: Topics.UserCreated;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    username: string;
    version: number;
  };
}
