import { Publisher } from "@monorepo/common/src/events/base-publisher";
import { Topics } from "@monorepo/common/src/events/topics";
import { type UserCreatedEvent } from "@monorepo/common/src/events/userCreatedEvent";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  topic: Topics.UserCreated = Topics.UserCreated;
}
