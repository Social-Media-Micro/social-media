import { Publisher } from "@monorepo/common/src/events/base-publisher";
import { type EmailVerifiedSuccessfullyEvent } from "@monorepo/common/src/events/emailVerifiedSuccess";
import { Topics } from "@monorepo/common/src/events/topics";

export class EmailVerifiedSuccessfullyPublisher extends Publisher<EmailVerifiedSuccessfullyEvent> {
  topic: Topics.EmailVerified = Topics.EmailVerified;
}
