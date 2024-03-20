import { Publisher } from "@monorepo/common/src/events/base-publisher";
import { type ForgetPasswordVerificationLinkEmail } from "@monorepo/common/src/events/forgetPasswordVerificationLinkEmail";
import { Topics } from "@monorepo/common/src/events/topics";

export class SendForgetPasswordLink extends Publisher<ForgetPasswordVerificationLinkEmail> {
  topic: Topics.ForgetPasswordLinkEmail = Topics.ForgetPasswordLinkEmail;
}
