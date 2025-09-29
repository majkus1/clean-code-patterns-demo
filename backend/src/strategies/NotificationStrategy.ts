/**
 * Strategy Pattern implementation
 * Demonstrates Open/Closed Principle - open for extension, closed for modification
 */

/**
 * Strategy interface
 * Defines the contract for all notification strategies
 */
export interface NotificationStrategy {
  send(message: string, recipient: string): Promise<boolean>;
  canHandle(recipient: string): boolean;
}

/**
 * Email notification strategy
 */
export class EmailNotificationStrategy implements NotificationStrategy {
  public async send(message: string, recipient: string): Promise<boolean> {
    console.log(`📧 Sending email to ${recipient}: ${message}`);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  public canHandle(recipient: string): boolean {
    return recipient.includes('@');
  }
}

/**
 * SMS notification strategy
 */
export class SmsNotificationStrategy implements NotificationStrategy {
  public async send(message: string, recipient: string): Promise<boolean> {
    console.log(`📱 Sending SMS to ${recipient}: ${message}`);
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }

  public canHandle(recipient: string): boolean {
    return /^\+\d{10,15}$/.test(recipient);
  }
}

/**
 * Push notification strategy
 */
export class PushNotificationStrategy implements NotificationStrategy {
  public async send(message: string, recipient: string): Promise<boolean> {
    console.log(`🔔 Sending push notification to device ${recipient}: ${message}`);
    // Simulate push notification
    await new Promise(resolve => setTimeout(resolve, 75));
    return true;
  }

  public canHandle(recipient: string): boolean {
    return recipient.startsWith('device_');
  }
}

/**
 * Notification service using Strategy pattern
 * Context class that uses different strategies
 */
export class NotificationService {
  private strategies: NotificationStrategy[] = [];

  constructor() {
    // Register default strategies
    this.strategies.push(
      new EmailNotificationStrategy(),
      new SmsNotificationStrategy(),
      new PushNotificationStrategy()
    );
  }

  /**
   * Register a new notification strategy
   * Demonstrates Open/Closed Principle
   */
  public addStrategy(strategy: NotificationStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Send notification using appropriate strategy
   * Automatically selects the best strategy for the recipient
   */
  public async sendNotification(message: string, recipient: string): Promise<boolean> {
    const strategy = this.strategies.find(s => s.canHandle(recipient));
    
    if (!strategy) {
      throw new Error(`No notification strategy found for recipient: ${recipient}`);
    }

    try {
      return await strategy.send(message, recipient);
    } catch (error) {
      console.error(`Failed to send notification to ${recipient}:`, error);
      return false;
    }
  }

  /**
   * Send notification to multiple recipients using different strategies
   */
  public async sendBulkNotification(
    message: string, 
    recipients: string[]
  ): Promise<{ success: string[]; failed: string[] }> {
    const results = await Promise.allSettled(
      recipients.map(recipient => 
        this.sendNotification(message, recipient)
          .then(success => ({ recipient, success }))
      )
    );

    const success: string[] = [];
    const failed: string[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          success.push(result.value.recipient);
        } else {
          failed.push(result.value.recipient);
        }
      } else {
        // Extract recipient from error or use unknown
        failed.push('unknown');
      }
    });

    return { success, failed };
  }

  /**
   * Get available strategies
   */
  public getAvailableStrategies(): string[] {
    return this.strategies.map(strategy => strategy.constructor.name);
  }
}
