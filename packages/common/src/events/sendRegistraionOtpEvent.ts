import { type Topics } from "./topics";

export interface SendRegistrationOtpEvent {
  topic: Topics.SendRegistrationOtp;
  data: {
    otp: string;
  };
}
