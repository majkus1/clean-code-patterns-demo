import {
  NotificationService,
  EmailNotificationStrategy,
  SmsNotificationStrategy,
  PushNotificationStrategy,
  NotificationStrategy
} from './NotificationStrategy';

describe('NotificationStrategy', () => {
  describe('EmailNotificationStrategy', () => {
    let strategy: EmailNotificationStrategy;

    beforeEach(() => {
      strategy = new EmailNotificationStrategy();
    });

    it('should handle email addresses', () => {
      expect(strategy.canHandle('test@example.com')).toBe(true);
      expect(strategy.canHandle('user@domain.co.uk')).toBe(true);
    });

    it('should not handle non-email addresses', () => {
      expect(strategy.canHandle('+1234567890')).toBe(false);
      expect(strategy.canHandle('device_123')).toBe(false);
    });

    it('should send email notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await strategy.send('Test message', 'test@example.com');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 Sending email to test@example.com: Test message'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('SmsNotificationStrategy', () => {
    let strategy: SmsNotificationStrategy;

    beforeEach(() => {
      strategy = new SmsNotificationStrategy();
    });

    it('should handle phone numbers', () => {
      expect(strategy.canHandle('+1234567890')).toBe(true);
      expect(strategy.canHandle('+48123456789')).toBe(true);
    });

    it('should not handle non-phone numbers', () => {
      expect(strategy.canHandle('test@example.com')).toBe(false);
      expect(strategy.canHandle('device_123')).toBe(false);
      expect(strategy.canHandle('123')).toBe(false);
    });

    it('should send SMS notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await strategy.send('Test message', '+1234567890');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '📱 Sending SMS to +1234567890: Test message'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('PushNotificationStrategy', () => {
    let strategy: PushNotificationStrategy;

    beforeEach(() => {
      strategy = new PushNotificationStrategy();
    });

    it('should handle device IDs', () => {
      expect(strategy.canHandle('device_123')).toBe(true);
      expect(strategy.canHandle('device_abc')).toBe(true);
    });

    it('should not handle non-device IDs', () => {
      expect(strategy.canHandle('test@example.com')).toBe(false);
      expect(strategy.canHandle('+1234567890')).toBe(false);
    });

    it('should send push notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await strategy.send('Test message', 'device_123');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '🔔 Sending push notification to device device_123: Test message'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
      service = new NotificationService();
    });

    it('should send email notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await service.sendNotification('Test message', 'test@example.com');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 Sending email to test@example.com: Test message'
      );
      
      consoleSpy.mockRestore();
    });

    it('should send SMS notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await service.sendNotification('Test message', '+1234567890');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '📱 Sending SMS to +1234567890: Test message'
      );
      
      consoleSpy.mockRestore();
    });

    it('should send push notification', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await service.sendNotification('Test message', 'device_123');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '🔔 Sending push notification to device device_123: Test message'
      );
      
      consoleSpy.mockRestore();
    });

    it('should throw error for unsupported recipient', async () => {
      await expect(
        service.sendNotification('Test message', 'unsupported_recipient')
      ).rejects.toThrow('No notification strategy found for recipient: unsupported_recipient');
    });

    it('should send bulk notifications', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const recipients = [
        'test@example.com',
        '+1234567890',
        'device_123'
      ];
      
      const result = await service.sendBulkNotification('Bulk message', recipients);
      
      expect(result.success).toHaveLength(3);
      expect(result.failed).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      
      consoleSpy.mockRestore();
    });

    it('should add custom strategy', async () => {
      const customStrategy: NotificationStrategy = {
        send: jest.fn().mockResolvedValue(true),
        canHandle: jest.fn().mockReturnValue(true)
      };

      service.addStrategy(customStrategy);
      
      const result = await service.sendNotification('Test message', 'custom_recipient');
      
      expect(result).toBe(true);
      expect(customStrategy.send).toHaveBeenCalledWith('Test message', 'custom_recipient');
      expect(customStrategy.canHandle).toHaveBeenCalledWith('custom_recipient');
    });

    it('should return available strategies', () => {
      const strategies = service.getAvailableStrategies();
      
      expect(strategies).toContain('EmailNotificationStrategy');
      expect(strategies).toContain('SmsNotificationStrategy');
      expect(strategies).toContain('PushNotificationStrategy');
    });
  });
});
