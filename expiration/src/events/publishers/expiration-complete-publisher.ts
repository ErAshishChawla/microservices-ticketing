import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@eractickets/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
