import { type Topics } from "./topics";

export interface ForgetPasswordVerificationLinkEmail {
  topic: Topics.ForgetPasswordLinkEmail;
  data: {
    token: string;
  };
}
