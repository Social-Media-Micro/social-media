import { PostEvent, Topics, UserEvent } from "./topics";

export type EventData<T extends Topics> = T extends Topics.User
  ? UserEvent
  : T extends Topics.Post
  ? PostEvent
  : never;
