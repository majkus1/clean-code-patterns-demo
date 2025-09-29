import { User } from '../models/User';

/**
 * Domain Events - przykłady zdarzeń domenowych
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;
  
  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
    this.eventId = Math.random().toString(36).substring(7);
  }
}

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super(user.id);
  }
}

export class UserUpdatedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super(user.id);
  }
}

export class UserDeletedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super(user.id);
  }
}
