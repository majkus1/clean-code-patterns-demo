/**
 * Observer Pattern - Event Publisher Interface
 */
export interface IEventPublisher {
  publish(event: any): Promise<void>;
  subscribe(eventType: string, handler: (event: any) => Promise<void>): void;
  unsubscribe(eventType: string, handler: (event: any) => Promise<void>): void;
}
