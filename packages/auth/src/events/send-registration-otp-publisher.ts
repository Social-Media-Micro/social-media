import { Publisher } from "@monorepo/common/src/events/base-publisher";
import { Topics } from "@monorepo/common/src/events/topics";
import { type SendRegistrationOtpEvent } from "@monorepo/common/src/events/sendRegistraionOtpEvent";

export class SendRegistrationOtpPublisher extends Publisher<SendRegistrationOtpEvent> {
  topic: Topics.SendRegistrationOtp = Topics.SendRegistrationOtp;
}
