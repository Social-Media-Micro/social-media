import { type Topics } from "./topics";

export interface EmailVerifiedSuccessfullyEvent {
  topic: Topics.EmailVerified;
  data: {
    message: string;
  };
}
