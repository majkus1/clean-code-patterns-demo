import { IEventPublisher } from './IEventPublisher';
import { logger } from '../utils/logger';

/**
 * Observer Pattern - Simple Event Publisher Implementation
 */
export class SimpleEventPublisher implements IEventPublisher {
  private handlers: Map<string, Array<(event: any) => Promise<void>>> = new Map();
  
  public async publish(event: any): Promise<void> {
    const eventType = event.constructor.name;
    const eventHandlers = this.handlers.get(eventType) || [];
    
    logger.info(`Publishing event: ${eventType}`, { eventId: event.eventId });
    
    // Execute all handlers for this event type
    const promises = eventHandlers.map(handler => 
      handler(event).catch(error => 
        logger.error(`Error in event handler for ${eventType}`, error)
      )
    );
    
    await Promise.allSettled(promises);
  }
  
  public subscribe(eventType: string, handler: (event: any) => Promise<void>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
    logger.info(`Subscribed handler for event: ${eventType}`);
  }
  
  public unsubscribe(eventType: string, handler: (event: any) => Promise<void>): void {
    const eventHandlers = this.handlers.get(eventType);
    if (eventHandlers) {
      const index = eventHandlers.indexOf(handler);
      if (index > -1) {
        eventHandlers.splice(index, 1);
        logger.info(`Unsubscribed handler for event: ${eventType}`);
      }
    }
  }
  
  public getSubscribersCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0;
  }
}
